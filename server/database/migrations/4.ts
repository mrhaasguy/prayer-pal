import { PoolClient } from "pg";
import { asyncForEach } from "../../utils";
import { UserStats, UserStatsPrayerRequest } from "./../../interfaces/types";

interface User {
  id: string;
}

interface PrayerRequestDateAndCategory {
  id: string;
  email_date: Date;
  last_prayer_date: Date;
  category: string;
}

exports.run = async (client: PoolClient) => {
  var users = await client.query("select * from users");

  await asyncForEach(users.rows, async (user: User) => {
    var jsonBlob: UserStats = { prayedRequests: [] };
    // Arbitrary date Jan 22 was when I added the button to confirm that I actually did pray for these requests.
    var results = await client.query(
      "select count(prayer_count) as totalprayed from prayer_requests where user_id = $1 AND prayer_count > 0 AND email_date > '2022-01-22';",
      [user.id]
    );
    jsonBlob.prayedRequestsTotalCount = results.rows[0].totalprayed;

    var results = await client.query(
      "select email_date, id, category, last_prayer_date from prayer_requests where user_id = $1 AND last_prayer_date IS NOT NULL AND email_date > '2022-01-22' order by email_date asc;",
      [user.id]
    );
    let prayedRequests: UserStatsPrayerRequest[] = [];
    results.rows.forEach((request: PrayerRequestDateAndCategory) => {
      prayedRequests.push({
        prayerRequestId: request.id,
        emailDate: request.email_date,
        prayedDate: request.last_prayer_date,
        category: request.category,
      });
    });
    jsonBlob.prayedRequests = prayedRequests;
    await client.query("UPDATE users SET user_stats = $1 WHERE id = $2", [
      jsonBlob,
      user.id,
    ]);
    console.log("Added user stats for user", user.id);
  });
};
