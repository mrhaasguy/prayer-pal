import express from "express";
import path from "path";
import cluster from "cluster";
import os from "os";
import dal from "./dal";
import { IDalService, IMonitor } from "./interfaces/types";

const numCPUs = os.cpus().length;

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

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

  // Priority serve any static files.
  app.use(
    express.static(path.resolve(__dirname, "../angular-ui/dist/angular-ui"))
  );

  // API requests
  app.get("/api/v1/statuscheck", async (req, res) => {
    res.status(200).json({ result: "OK" });
  });

  app.post("/api/v1/monitors", async (req, res, next) => {
    var input = req.body;
    if (!input) return res.status(400).json({ error: "body is required" });
    if (!input.keyword)
      return res.status(400).json({ error: "keyword is required" });
    if (!input.userEmail)
      return res.status(400).json({ error: "userEmail is required" });

    var model: IMonitor = {
      keyword: input.keyword,
      userEmail: input.userEmail,
    };
    var succeeded = await dal(async (dalService: IDalService) => {
      await dalService.saveMonitor(model);
    }).catch(next);
    if (!succeeded) return;

    return res.status(201).json(model);
  });
  app.get("/api/v1/monitors", async (req, res, next) => {
    var email = req.query.userEmail;
    if (!email)
      return res.status(400).json({ error: "userEmail parameter is required" });

    var models: IMonitor[] = [];
    var succeeded = await dal(async (dalService: IDalService) => {
      models = await dalService.getAllMonitors(<string>email);
    }).catch(next);
    if (!succeeded) return;

    res.status(200).json({ rows: models });
  });
  app.get("/api/v1/monitors/:id", async (req, res, next) => {
    var id = req.params.id;
    if (!id) return res.status(400).json({ error: "id is required" });

    var model: IMonitor | null = null;
    var succeeded = await dal(async (dalService: IDalService) => {
      model = await dalService.getMonitor(id);
    }).catch(next);
    if (!succeeded) return;
    if (!model) {
      res.status(404).json("404 Not Found");
      return;
    }
    res.status(200).json(model);
  });

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
