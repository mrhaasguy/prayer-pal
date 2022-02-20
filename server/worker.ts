import dal from "./dal";
import { IDalService } from "./interfaces/types";
import nodemailer from "nodemailer";
import { generateDailyPrayersTemplate } from "./emailGenerator";

const result = require("dotenv").config();

if (result.error) {
  console.error("dotnet failed to load .env file");
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
      const userEmail = userEmails[i];
      const html = await generateDailyPrayersTemplate(userEmail, dalService);

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
        html,
      });

      console.log("Email sent: %s", info.messageId);

      // Don't automatically mark as prayed, let the user do it by clicking a button in the email.

      // prayerRequests.forEach((prayerRequest) => {
      //   prayerRequest.prayerCount += 1;
      //   prayerRequest.lastPrayerDate = new Date();
      // });
      // await Promise.all(
      //   prayerRequests.map((p) => dalService.savePrayerRequest(p))
      // );
    }
  });
})();
