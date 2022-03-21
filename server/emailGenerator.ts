import { parseFullName } from "parse-full-name";
import { IDalService } from "./interfaces/types";
import { takeRandom } from "./utils";
import { Aes256 } from "./Aes256";
import fs from "fs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import DailyPrayerEmail, {
  DailyPrayerEmailArgs,
  DailyPrayerEmailStats,
} from "./templates/daily-prayers-email";
import juice from "juice";
import moment from "moment";

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

  const userStats = await generatePrayedForUserStats(
    dalService,
    userEmail.userId
  );

  const urlBase = getUrlBase();
  const emailElement = React.createElement<DailyPrayerEmailArgs>(
    DailyPrayerEmail,
    {
      user: {
        name: parseFullName(userEmail.fullName).first ?? userEmail.fullName,
        id: userEmail.userId,
      },
      prayerRequests,
      prayedForUrl: `${urlBase}/api/v1/prayer-request/prayed?userId=${userEmail.userId}&prayerRequestIds=${encryptedPrayerRequestIds}`,
      getMoreUrl: `${urlBase}/api/v1/prayer-request/daily?userId=${userEmail.userId}`,
      stats: userStats,
    }
  );
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

async function generatePrayedForUserStats(
  dalService: IDalService,
  userId: string
) {
  const userStats = await dalService.getUserStats(userId);
  if (userStats) {
    const firstDayOfWeek = (
      moment().days() === 0 ? moment().day(-7) : moment().day(0)
    ).startOf("day");
    const prayedThisWeek = userStats.prayedRequests?.filter((p) =>
      firstDayOfWeek.isSameOrBefore(p.prayedDate)
    );

    const prayedForDaily: boolean[] = [];
    prayedThisWeek?.forEach(
      (p) => (prayedForDaily[moment(p.prayedDate).day() | 7] = true)
    );

    const dailyPrayerEmailStats: DailyPrayerEmailStats = {
      prayedForCount: userStats.prayedRequestsTotalCount ?? 0,
      prayedForThisWeek: prayedThisWeek?.length ?? 0,
      prayedForDaily /*{
        19: true,
        18: true,
        17: false,
        16: true,
        15: false,
        14: true,
        13: true,
      },*/,
      //userStats,
    };
    return dailyPrayerEmailStats;
  }
}
