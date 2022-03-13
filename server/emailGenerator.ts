import { parseFullName } from "parse-full-name";
import { IDalService } from "./interfaces/types";
import { takeRandom } from "./utils";
import { Aes256 } from "./Aes256";
import fs from "fs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import DailyPrayerEmail from "./templates/daily-prayers-email";
import juice from "juice";

export async function generateDailyPrayersTemplate(
  userEmail: { userId: string; fullName: string },
  dalService: IDalService
) {
  let prayerRequests = await dalService.getTopPrayerRequests(userEmail.userId);
  prayerRequests = takeRandom(prayerRequests, 4);

  function encryptAndEncode(value: string) {
    const encrypted = Aes256.encrypt(value);
    if (encrypted) return encodeURIComponent(encrypted); //
    return "";
  }
  const encryptedPrayerRequestIds = encryptAndEncode(
    prayerRequests
      .map((p) => p.id)
      .filter((p) => !!p)
      .join(",")
  );
  const emailElement = React.createElement(DailyPrayerEmail, {
    user: {
      name: parseFullName(userEmail.fullName).first ?? userEmail.fullName,
      id: userEmail.userId,
    },
    prayerRequests,
    prayedForUrl: `https://prayer-pal.herokuapp.com/api/v1/prayer-request/prayed?userId=${userEmail.userId}&prayerRequestIds=${encryptedPrayerRequestIds}`,
    getMoreUrl: `https://prayer-pal.herokuapp.com/api/v1/prayer-request/daily?userId=${userEmail.userId}`,
  });
  var reactHtml = juice(ReactDOMServer.renderToStaticMarkup(emailElement));

  let html = fs
    .readFileSync("./server/templates/email-template-base.html", "utf8")
    .toString();

  return html.replace("{{BODY}}", reactHtml);
}
