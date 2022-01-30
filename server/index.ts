import express from "express";
import path from "path";
import cluster from "cluster";
import os from "os";
import dal from "./dal";
import { IDalService, IMonitor } from "./interfaces/types";
import { validate } from "uuid";
import { generateDailyPrayersTemplate } from "./emailGenerator";
import { Aes256 } from "./utils";

const numCPUs = os.cpus().length;

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

function isDateBeforeToday(date: Date | null) {
  if (!date) {
    return true;
  }
  return new Date(date.toDateString()) < new Date(new Date().toDateString());
}
// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isPrimary) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Highest priority is to serve email static files from the public folder
  app.use("/static", express.static("public"));
  // Priority serve any static files.
  app.use(
    express.static(path.resolve(__dirname, "../angular-ui/dist/angular-ui"))
  );

  // API requests
  app.get("/api/v1/statuscheck", async (req, res) => {
    res.status(200).json({ result: "OK" });
  });

  app.get("/api/v1/prayer-request/prayed", async (req, res, next) => {
    const userId = req.query.userId as string;
    let prayerRequestIds: string[];
    try {
      prayerRequestIds = (
        Aes256.decrypt(
          decodeURIComponent(req.query.prayerRequestIds as string)
        ) ?? ""
      )
        .split(",")
        .filter((i) => i.trim().length > 0);
    } catch (e) {
      console.error(e);
      return res.status(400).send("unabled to decode prayerRequestIds");
    }
    if (!userId) return res.status(400).send("userId is required");
    console.log(prayerRequestIds);
    if (!prayerRequestIds || !prayerRequestIds.length)
      return res.status(400).send("prayerRequestIds is required");

    let message: string = "";
    var succeeded = await dal(async (dalService: IDalService) => {
      for (let i = 0; i < prayerRequestIds.length; i += 1) {
        let id = prayerRequestIds[i].trim();
        if (id) {
          if (!validate(id)) {
            message += i + ": Not a valid GUID";
            continue;
          }
          console.log("Looking up prayerRequest " + id);
          var prayerRequest = await dalService.getPrayerRequest(id);
          if (prayerRequest) {
            if (prayerRequest.userId !== userId) {
              message += i + ": Does not belong to the given userId<br>";
              continue;
            }
            if (isDateBeforeToday(prayerRequest.lastPrayerDate)) {
              message += i + ": Updated<br>";
              prayerRequest.prayerCount += 1;
              prayerRequest.lastPrayerDate = new Date();
              await dalService.savePrayerRequest(prayerRequest);
            } else {
              message += i + ": Already updated today<br>";
            }
          } else {
            message += i + ": Not found<br>";
          }
        }
      }
    }).catch(next);

    return res.status(200).send(message ?? "No messages");
  });

  app.get("/api/v1/prayer-request/daily", async (req, res, next) => {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).send("userId is required");
    if (!validate(userId))
      return res.status(400).send(userId + " Not a valid GUID");

    let result: string | undefined = undefined;
    await dal(async (dalService: IDalService) => {
      const userEmail = await dalService.getPrimaryUserEmail(userId);
      if (userEmail) {
        result = await generateDailyPrayersTemplate(userEmail, dalService);
      }
    }).catch(next);

    return res.status(200).send(result ?? "User not found");
  });
  // app.get("/api/v1/monitors", async (req, res, next) => {
  //   var email = req.query.userEmail;
  //   if (!email)
  //     return res.status(400).json({ error: "userEmail parameter is required" });

  //   var models: IMonitor[] = [];
  //   var succeeded = await dal(async (dalService: IDalService) => {
  //     models = await dalService.getAllMonitors(<string>email);
  //   }).catch(next);
  //   if (!succeeded) return;

  //   res.status(200).json({ rows: models });
  // });
  // app.get("/api/v1/monitors/:id", async (req, res, next) => {
  //   var id = req.params.id;
  //   if (!id) return res.status(400).json({ error: "id is required" });

  //   var model: IMonitor | null = null;
  //   var succeeded = await dal(async (dalService: IDalService) => {
  //     model = await dalService.getMonitor(id);
  //   }).catch(next);
  //   if (!succeeded) return;
  //   if (!model) {
  //     res.status(404).json("404 Not Found");
  //     return;
  //   }
  //   res.status(200).json(model);
  // });

  // All remaining requests return the Angular app, so it can handle routing.
  app.get("*", function (req, res) {
    if (req.originalUrl.indexOf("/api/") !== 0) {
      res.sendFile(
        path.resolve(__dirname, "../angular-ui/dist/angular-ui", "index.html")
      );
    }
  });

  app.listen(PORT, function () {
    console.error(
      `Node ${
        isDev ? "dev server" : "cluster worker " + process.pid
      }: listening on port ${PORT}`
    );
  });
}
