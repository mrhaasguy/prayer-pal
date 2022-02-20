// Fixes a bug where the user_stats.prayedRequestsTotalCount was being saved as a string, so adding 1 was resulting in 40111111...

import { PoolClient } from "pg";
import { asyncForEach } from "../../utils";
import { UserStats, UserStatsPrayerRequest } from "./../../interfaces/types";

interface User {
  id: string;
  user_stats: UserStats | undefined;
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
    if (
      user.user_stats?.prayedRequestsTotalCount &&
      typeof user.user_stats?.prayedRequestsTotalCount === "string"
    ) {
      let countAsString = user.user_stats?.prayedRequestsTotalCount as string;

      // This isn't always correct, but it's the best we've got...
      user.user_stats.prayedRequestsTotalCount =
        parseInt(countAsString.split("1")[0]) +
        (countAsString.match(/1/g) || []).length;
    }

    await client.query("UPDATE users SET user_stats = $1 WHERE id = $2", [
      user.user_stats,
      user.id,
    ]);
    console.log(
      "Fixed user stats prayedRequestsTotalCount for user",
      user.id,
      user.user_stats?.prayedRequestsTotalCount
    );
  });
};
