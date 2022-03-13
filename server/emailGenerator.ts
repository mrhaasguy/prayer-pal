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

  const urlBase = getUrlBase();
  const emailElement = React.createElement(DailyPrayerEmail, {
    user: {
      name: parseFullName(userEmail.fullName).first ?? userEmail.fullName,
      id: userEmail.userId,
    },
    prayerRequests,
    prayedForUrl: `${urlBase}/api/v1/prayer-request/prayed?userId=${userEmail.userId}&prayerRequestIds=${encryptedPrayerRequestIds}`,
    getMoreUrl: `${urlBase}/api/v1/prayer-request/daily?userId=${userEmail.userId}`,
  });
  return renderReactToHtml(emailElement);
}

function renderReactToHtml(element: React.ReactElement) {
  var reactHtml = juice(ReactDOMServer.renderToStaticMarkup(element));

  let html = fs
    .readFileSync("./server/templates/email-template-base.html", "utf8")
    .toString();

  return html.replace("{{BODY}}", reactHtml);
}

function getUrlBase() {
  const env = process.env.ENVIRONMENT;
  if (env) {
    return env;
  }
  return "https://prayer-pal.herokuapp.com";
}
