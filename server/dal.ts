import { Pool, PoolClient } from "pg";
import {
  IMonitor,
  IDalService,
  User,
  PrayerRequest,
  UserEmail,
  PrimaryUserEmail,
  UserStats,
} from "./interfaces/types";
import { v4 as uuidv4 } from "uuid";
import { fileExist } from "./utils";
import * as fs from "fs";
import { Aes256 } from "./Aes256";
import { stringSimilarity } from "string-similarity-js";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres@localhost:5432/prayerpal",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

let hasRunDatabaseUpdate = false;

class DalService implements IDalService {
  client: PoolClient;

  constructor(client: PoolClient) {
    this.client = client;
  }

  public async getUserStats(userId: string): Promise<UserStats> {
    const results = await this.client.query(
      "SELECT user_stats FROM users where id = $1",
      [userId]
    );
    return results.rows[0]?.user_stats ?? {};
  }
  public async saveUserStats(
    userId: string,
    userStats: UserStats
  ): Promise<void> {
    await this.client.query("update users set user_stats = $1 where id = $2", [
      userStats,
      userId,
    ]);
  }

  public async getAllPrimaryUserEmails(): Promise<PrimaryUserEmail[]> {
    const results = await this.client.query(
      "SELECT * FROM user_emails ue INNER JOIN users u ON ue.user_id = u.id WHERE ue.is_primary = true"
    );
    return results.rows.map(
      (r) =>
        <PrimaryUserEmail>{
          userId: r.user_id,
          email: r.email,
          fullName: r.fullname,
        }
    );
  }

  public async getPrimaryUserEmail(
    userId: string
  ): Promise<PrimaryUserEmail | undefined> {
    const results = await this.client.query(
      "SELECT * FROM user_emails ue INNER JOIN users u ON ue.user_id = u.id WHERE ue.is_primary = true AND u.id = $1",
      [userId]
    );
    if (results.rows.length > 0) {
      return results.rows.map(
        (r) =>
          <PrimaryUserEmail>{
            userId: r.user_id,
            email: r.email,
            fullName: r.fullname,
          }
      )[0];
    }
    return undefined;
  }

  public async getUserByEmail(email: string): Promise<User | undefined> {
    console.log('looking up user by email "' + email + '"');
    const results = await this.client.query(
      "SELECT * FROM users u LEFT JOIN user_emails ue ON u.id = ue.user_id WHERE u.id IN (select user_id FROM user_emails where email = $1)",
      [email]
    );
    console.log("Found query result: " + JSON.stringify(results.rows));
    let user: User | undefined = undefined;
    results.rows.forEach((r) => {
      user = user ?? { id: r.user_id, fullName: r.fullname, emails: [] };
      user.emails.push({
        userId: user.id ?? "",
        email: r.email,
        isPrimary: r.is_primary,
      });
    });

    console.log("Found user: " + JSON.stringify(user ?? {}));
    return user;
  }
  public async getUserByName(fullName: string): Promise<User | undefined> {
    console.log('looking up user by name "' + fullName + '"');
    const results = await this.client.query(
      "SELECT * FROM users u LEFT JOIN user_emails ue ON u.id = ue.user_id WHERE u.fullname = $1",
      [fullName]
    );
    console.log("Found query result: " + JSON.stringify(results.rows));
    let user: User | undefined = undefined;
    results.rows.forEach((r) => {
      user = user ?? { id: r.user_id, fullName: r.fullname, emails: [] };
      user.emails.push({
        userId: user.id ?? "",
        email: r.email,
        isPrimary: r.is_primary,
      });
    });

    console.log("Found user: " + JSON.stringify(user ?? {}));
    return user;
  }
  public async saveUser(model: User) {
    if (!model.id) {
      model.id = uuidv4();

      console.log("Saving new user " + model.id);
      await this.client.query(
        "INSERT INTO users (id, fullname) " + "VALUES ($1, $2);",
        [model.id, model.fullName]
      );
    }

    for (let i = 0; i < model.emails.length; i += 1) {
      let email = model.emails[i];
      email.userId = model.id;
      const results = await this.client.query(
        "SELECT * FROM user_emails e WHERE e.user_id = $1 AND e.email = $2",
        [model.id, email.email]
      );

      if (results.rows.length === 0) {
        let emailId = uuidv4();

        console.log(
          "Saving new user_email " + emailId + " for user " + email.userId
        );
        await this.client.query(
          "INSERT INTO user_emails (id, user_id, email, is_primary) VALUES ($1, $2, $3, $4);",
          [emailId, email.userId, email.email, email.isPrimary]
        );
      }
    }
  }

  public async savePrayerRequest(model: PrayerRequest) {
    if (model.id) {
      await this.updatePrayerRequest(model);
      return model;
    }
    const alreadyExistsResults = await this.client.query(
      "SELECT * from prayer_requests where user_id = $1 AND category = $2",
      [model.userId, model.category]
    );

    const similarPrayerRequest = alreadyExistsResults.rows.find((r) => {
      const similarity = stringSimilarity(
        model.message,
        Aes256.decrypt(r.message) ?? ""
      );
      console.log(similarity);
      return similarity > 0.8;
    });
    if (similarPrayerRequest) {
      model.id = similarPrayerRequest.id;
      console.log(
        "Prayer request " + model.id + " already exists, updating date"
      );
      await this.updatePrayerRequestEmailDate(model);
      return (await this.getPrayerRequest(model.id ?? "")) ?? model;
    }

    if (!model.id) {
      model.id = uuidv4();
    }

    console.log("INSERT Prayer request " + model.id);
    await this.client.query(
      "INSERT INTO prayer_requests (id, user_id, email_date, from_email, subject, category, message) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7);",
      [
        model.id,
        model.userId,
        model.date,
        model.from,
        model.subject,
        model.category,
        Aes256.encrypt(model.message),
      ]
    );
    return model;
  }

  public async updatePrayerRequest(model: PrayerRequest): Promise<void> {
    await this.client.query(
      "UPDATE prayer_requests SET email_date = $1, prayer_count = $2, last_prayer_date = $3 WHERE id = $4",
      [model.date, model.prayerCount, model.lastPrayerDate, model.id]
    );
    return;
  }
  public async updatePrayerRequestEmailDate(
    model: PrayerRequest
  ): Promise<void> {
    await this.client.query(
      "UPDATE prayer_requests SET email_date = $1, message = $2 WHERE id = $3",
      [model.date, Aes256.encrypt(model.message), model.id]
    );
    return;
  }

  public async getPrayerRequest(id: string): Promise<PrayerRequest | null> {
    const results = await this.client.query(
      "SELECT * from prayer_requests where id = $1",
      [id]
    );
    if (results.rows.length > 0) {
      return results.rows.map(
        (r) =>
          <PrayerRequest>{
            id: r.id,
            userId: r.user_id,
            date: r.email_date,
            from: r.from_email,
            subject: r.subject,
            category: r.category,
            message: Aes256.decrypt(r.message),
            lastPrayerDate: r.last_prayer_date,
            prayerCount: r.prayer_count,
          }
      )[0];
    }
    return null;
  }

  public async getTopPrayerRequests(userId: string): Promise<PrayerRequest[]> {
    const results = await this.client.query(
      "SELECT * from prayer_requests where user_id = $1 AND email_date > current_date at time zone 'UTC' - interval '30 days' ORDER BY prayer_count ASC, last_prayer_Date DESC , RANDOM() LIMIT 10",
      [userId]
    );
    return results.rows.map(
      (r) =>
        <PrayerRequest>{
          id: r.id,
          userId: r.user_id,
          date: r.email_date,
          from: r.from_email,
          subject: r.subject,
          category: r.category,
          message: Aes256.decrypt(r.message),
          lastPrayerDate: r.last_prayer_date,
          prayerCount: r.prayer_count,
        }
    );
  }

  public async updateDatabase(): Promise<void> {
    console.log("Checking for database update");
    const results = await this.client.query(
      "SELECT version from database_updates where id = 1 FOR UPDATE;" // Lock the row so we won't run the db update more than once
    );
    const version: number = results.rows[0].version;
    let nextVersion = version + 1;
    while (
      await fileExist("./server/database/migrations/" + nextVersion + ".sql")
    ) {
      console.log("Updating to version " + nextVersion);
      let sql = fs
        .readFileSync(
          "./server/database/migrations/" + nextVersion + ".sql",
          "utf8"
        )
        .toString();
      await this.client.query(sql);

      if (
        await fileExist("./server/database/migrations/" + nextVersion + ".ts")
      ) {
        await require("./database/migrations/" + nextVersion).run(this.client);
      }
      await this.client.query("update database_updates set version = $1;", [
        nextVersion,
      ]);
      nextVersion += 1;
    }

    console.log("Database updates completed");
  }

  dispose() {
    this.client.release();
  }
}

var beginTransaction = async (client: PoolClient) => {
  console.log("Starting transaction...");
  await client.query("BEGIN;");
};
var commitTransaction = async (client: PoolClient) => {
  console.log("Committing transaction...");
  await client.query("COMMIT;");
};

var rollbackTransaction = async (client: PoolClient) => {
  try {
    console.log("Rolling back transaction...");
    await client.query("ROLLBACK;");
    console.log("Rollback successful");
  } catch (e2) {
    console.error("error trying to ROLLBACK failed query", e2);
  }
};
export default async function dalServiceFactory(action: any) {
  var client = await pool.connect();
  var dalService = new DalService(client);
  try {
    await beginTransaction(client);
    if (!hasRunDatabaseUpdate) {
      await dalService.updateDatabase();
      await commitTransaction(client);
      await beginTransaction(client);
      hasRunDatabaseUpdate = true;
    }
    await action(dalService);
    await commitTransaction(client);
  } catch (e) {
    console.error(e);
    await rollbackTransaction(client);
    throw e;
  } finally {
    dalService.dispose();
  }
  return true;
}
