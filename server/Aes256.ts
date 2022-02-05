const encryptionKey = process.env.AES256_KEY;
if (!encryptionKey) {
  throw new Error("AES256_KEY not provided");
}
var aes256 = require("aes256");

let Aes256 = {
  encrypt(text: string): string | undefined {
    if (!text) return undefined;
    return aes256.encrypt(encryptionKey, text);
  },
  decrypt(text: string): string | undefined {
    if (!text) return undefined;
    return aes256.decrypt(encryptionKey, text);
  },
};

export { Aes256 };
