import { Pool, PoolClient } from "pg";
import { IMonitor, IDalService } from "./interfaces/types";
import { v4 as uuidv4 } from "uuid";
import { Sequelize } from "sequelize";
import { User } from "./models/User";
import { PrayerRequest } from "./models/PrayerRequest";
import { UserEmail } from "./models/UserEmail";

const models = [User.initSchema, PrayerRequest.initSchema];

const sequelize = new Sequelize(
  process.env.DATABASE_URL || "postgresql://postgres@localhost:5432/prayerpal",
  {
    dialect: "postgres",
    protocol: "postgres",
    //logging: true
  }
);

models.forEach((m) => m(sequelize));

export class DalService implements IDalService {
  client: PoolClient;

  constructor(client: PoolClient) {
    this.client = client;
  }

  public async getAllPrimaryUserEmails(): Promise<UserEmail[]> {
    return UserEmail.findAll({ where: { isPrimary: true } });
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
      "SELECT * from prayer_requests where user_id = $1 AND category = $2 AND message = $3",
      [model.userId, model.category, model.message]
    );
    if (alreadyExistsResults.rows.length > 0) {
      model.id = alreadyExistsResults.rows[0].id;
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
        model.message,
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
      "UPDATE prayer_requests SET email_date = $1 WHERE id = $2",
      [model.date, model.id]
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
            message: r.message,
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
          message: r.message,
          lastPrayerDate: r.last_prayer_date,
          prayerCount: r.prayer_count,
        }
    );
  }

  public async saveMonitor(model: IMonitor) {
    if (!model.id) {
      model.id = uuidv4();
    }
    await this.client.query(
      "INSERT INTO monitor (id, keyword, user_email) " + "VALUES ($1, $2, $3);",
      [model.id, model.keyword, model.userEmail]
    );
  }
  public async getAllMonitors(userEmail: string) {
    const results = await this.client.query(
      "SELECT * from monitor where user_email = $1",
      [userEmail]
    );
    return results.rows.map((r) => this.toMonitorModel(r));
  }

  private toMonitorModel(r: any): IMonitor {
    return { id: r.id, keyword: r.keyword, userEmail: r.user_email };
  }

  public async getMonitor(id: string): Promise<IMonitor | null> {
    const result = await this.client.query(
      "SELECT * from monitor where id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return this.toMonitorModel(result.rows[0]);
  }
  public async deleteMonitor(id: string) {
    await this.client.query("DELETE FROM monitor WHERE id = $1;", [id]);
  }

  dispose() {
    this.client.release();
  }
}
interface IDalMonitor {}
export default async function dalServiceFactory(action: any) {
  var client = await pool.connect();
  var dalService = new DalService(client);
  try {
    await action(dalService);
  } finally {
    dalService.dispose();
  }
  return true;
}
