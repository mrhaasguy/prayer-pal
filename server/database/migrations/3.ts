import { PoolClient } from "pg";
import { Aes256 } from "../../Aes256";

interface PrayerRequestMessage {
  id: string;
  message: string;
}

exports.run = async (client: PoolClient) => {
  var results = await client.query("select id, message from prayer_requests;");
  var prayerRequests = results.rows as PrayerRequestMessage[];
  await Promise.all(
    prayerRequests.map((p) => {
      const encryptedMessage = Aes256.encrypt(p.message);
      console.log("Encrypting message for " + p.id);
      return client.query(
        "UPDATE prayer_requests SET message = $1 WHERE id = $2",
        [encryptedMessage, p.id]
      );
    })
  );
};
