import { EmailParser } from "../emailParser";
import * as fs from "fs";

describe("emailParser", () => {
  describe("parse function", () => {
    it("should work1", () => {
      let parser = new EmailParser();
      const html = fs.readFileSync("./server/tests/test2.input.html", "utf8").toString();
      let results = parser.parse({from: {address: 'fake@email.com'}, date: new Date(), subject: 'Subject', html});
      expect(results).toBe("");
    });
  });
});
