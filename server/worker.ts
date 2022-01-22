import dal from "./dal";
import { IDalService, IMonitor, IEmail, User } from "./interfaces/types";
import nodemailer from "nodemailer";
import { parseFullName } from "parse-full-name";
import Mustache from "mustache";
import * as fs from "fs";

const result = require("dotenv").config();
/**
 * Returns a random number between 0 (inclusive) and max (exclusive)
 */
function random(max: number) {
  return Math.floor(Math.random() * max);
}
function takeRandom<T>(array: T[], count: number): T[] {
  let results: T[] = [];
  for (let i = 0; i < count; i += 1) {
    let index = random(array.length);
    results.push(...array.splice(index, 1));
  }
  return results;
}

if (result.error) {
  console.error(result.error);
}

if (!process.env.SMTP_HOST) {
  throw new Error("SMTP_HOST not provided");
}

let transporter = nodemailer.createTransport({
  host: "smtp.titan.email",
  port: 465, // imap port
  tls: {
    requestCert: true,
    rejectUnauthorized: false,
  },
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
(async () => {
  await dal(async (dalService: IDalService) => {
    var userEmails = await dalService.getAllPrimaryUserEmails();
    for (let i = 0; i < userEmails.length; i += 1) {
      let userEmail = userEmails[i];
      let prayerRequests = await dalService.getTopPrayerRequests(
        userEmail.userId
      );
      prayerRequests = takeRandom(prayerRequests, 3);

      let html = fs
        .readFileSync("./server/templates/daily-prayers-email.html", "utf8")
        .toString();

      let index = 0;
      html = Mustache.render(html, {
        user: { name: "there" },
        date: new Date(),
        prayerRequests,
        index: () => (index += 1),
        FormatDate: function () {
          return function (rawText: string, render: any) {
            const rawDate = new Date(render(rawText));
            console.log(rawDate);
            return rawDate.toISOString().split("T")[0];
          };
        },
      });

      let info = await transporter.sendMail({
        from: '"Prayer Pal" <' + process.env.SMTP_USER + ">", // sender address
        to: userEmail.email,
        subject:
          "Prayer Requests for " +
          [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ][new Date().getUTCDay()], // Subject line
        text:
          "Hey there, \r\n Here are todays prayer requests:\r\n" +
          JSON.stringify(prayerRequests, null, 2), // plain text body
        html,
      });

      console.log("Email sent: %s", info.messageId);

      prayerRequests.forEach((prayerRequest) => {
        prayerRequest.prayerCount += 1;
        prayerRequest.lastPrayerDate = new Date();
      });
      await Promise.all(
        prayerRequests.map((p) => dalService.savePrayerRequest(p))
      );
    }
  });
})();
