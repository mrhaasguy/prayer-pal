import Mustache from "mustache";
import { parseFullName } from "parse-full-name";
import { IDalService } from "./interfaces/types";
import { takeRandom } from "./utils";
import fs from "fs";
import { Aes256 } from "./Aes256";

export async function generateDailyPrayersTemplate(
  userEmail: { userId: string; fullName: string },
  dalService: IDalService
) {
  let prayerRequests = await dalService.getTopPrayerRequests(userEmail.userId);
  prayerRequests = takeRandom(prayerRequests, 4);

  let html = fs
    .readFileSync("./server/templates/daily-prayers-email.html", "utf8")
    .toString();

  let index = 0;
  return Mustache.render(html, {
    user: {
      name: parseFullName(userEmail.fullName).first ?? userEmail.fullName,
      id: userEmail.userId,
    },
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
    EncryptAndEncode: function () {
      return function (rawText: string, render: any) {
        const encrypted = Aes256.encrypt(render(rawText));
        if (encrypted) return encodeURIComponent(encrypted); //
        return "";
      };
    },
  });
}
