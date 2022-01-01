import { Pool, PoolClient } from "pg";
import { IMonitor, IDalService } from "./interfaces/types";
import { v4 as uuidv4 } from "uuid";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres@localhost:5432/prayerpal",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

class DalService implements IDalService {
  client: PoolClient;

  constructor(client: PoolClient) {
    this.client = client;
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
    return results.rows.map(r => this.toMonitorModel(r));
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
