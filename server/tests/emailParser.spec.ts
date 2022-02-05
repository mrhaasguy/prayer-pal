import { EmailParser } from "../emailParser";
import * as fs from "fs";

describe("emailParser", () => {
  describe("parse function", () => {
    it("should work1", () => {
      let parser = new EmailParser();
      const html = fs
        .readFileSync("./server/tests/test1.input.html", "utf8")
        .toString();
      let date = new Date();
      let results = parser.parseEmailToPrayerRequests("USERID", {
        from: [{ address: "fake@email.com" }],
        date: new Date(),
        subject: "Subject",
        html,
      });
      expect(results).toStrictEqual([
        {
          category: "Rebecca & Matt",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Pray for Haley their former sitter. She is 18 and was in a car accident and just found out she has breast cancer. She is doing better this week. They are thinking less radiation at this point.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Rebecca & Matt",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Pray for continued discernment as they try to figure out how to help her through this time.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "The Seyllers",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Thanking God for his provision with a new home. The big move is this weekend.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "The Seyllers",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Thanking God for a new member of the family who is on the way and will arrive in May. So far everything is looking good.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "The Seyllers",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message: "Pray for Jen as she goes through morning sickness.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "The Cutlers",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Are selling their house today and closing on the new one. May we keep Michael and Chelsea in our prayers that all goes well. The move is Saturday.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Operation Christmas Child",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Praising God for his provision of boxes this season. May we keep the workers, and volunteers in our prayers and they now work on getting them to the children. Pray for the local churches and that through the boxes the children may gain the ultimate gift of eternal life.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Operation Christmas Child",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Pray for the workers and their families as many of the processing centers are short handed this year. Many from Boone have been called to serve throughout the country to fill the needs.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Operation Christmas Child",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message: "Matt Cottrell is serving in Houston, Texas currently",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Operation Christmas Child",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Joe Mott was in Atlanta last week and will return again next week for 2 more weeks to assist.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Operation Christmas Child",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Lori Holton arrived in Denver Wednesday and will serve till next Wednesday at the processing center there.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Amanda",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Prayer for her demenor and attitude. As she gets through the next couple of weeks.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Amanda",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Prayer for Finley he has yet another cold. Pray that his immune system will get built up after missing so much preschool due to the lockdown during Covid",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Afgan Family",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Prayer for the Afgan family that has relocated to Boone. Pray that relations will be established and that through this ministry they will not only adjust to life in the states.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Jessica",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "May me we keep JP Poison's wife Rebecca. She is dealing with neurological issues from a virus and raising 3 kids",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Hannah Reader",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message: "May we keep Maranda Maxey in our prayers.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Betsy Cain",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Please pray for her cousin who is oversees in Missions. Serving as an Audio Engineer.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Amber Lee",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Pray for her brother Trever as he recovers from his seizure. Trever is back in Boone living at home but struggling with managing the pain. Pray for patience of all parties and that he can get control of his anxiety.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Christy Miller",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message: "Continuing to pray through the adoption process.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Christy Miller",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message: "Please continue praying for Michael for healing.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Sharon Sheets",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Son Noah, who was adopted is moving to Oregon. Praying for God's provision and direction for him.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Lori Holton",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Praying that my former coworker will get the help he needs and that his family has the strength they need to get him help. Please pray that through this he does not harm anyone including himself. Pray that his ears will be open to the truth, and that God's light will shine into the darkness that surrounds him.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Prayers for Ministry and Missions abroad",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Betsy Cain's cousin who is oversees in Missions. Serving as an Audio Engineer.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Prayers for Ministry and Missions abroad",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Nick and Maia Mikhaluk and their son Dannie from the Ukraine - they are missionaries through our International Partnership",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Prayers for Ministry and Missions abroad",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message: "Myanmar Update from Amy",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Prayers for Ministry and Missions abroad",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Please continue to pray for Pastor V and my missionary friend John along with the other believers in Myanmar.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Prayers for Ministry and Missions abroad",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Pastors with orphans in their care are still in hiding with the kids. Food is scarce.",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Prayers for Ministry and Missions abroad",
          date: date,
          from: "Lori Holton <abfboone@ccbchurch.com>",
          message:
            "Military forces (coup) are burning houses and towns in the Chin State, the Chin people are historically one of a couple of Christian clans in Myanmar. I have friends posting pictures of their families' homes on fire. Last I heard around 200 houses and a number of churches had been burned. I do not know where these people will go when their world is on fire around them.",
          subject: "Subject",
          userId: "USERID",
        },
      ]);
    });
    it("should work2", () => {
      let parser = new EmailParser();
      const html = fs
        .readFileSync("./server/tests/test2.input.html", "utf8")
        .toString();
      let date = new Date();
      let results = parser.parseEmailToPrayerRequests("USERID", {
        from: [{ address: "fake@email.com" }],
        date: new Date(),
        subject: "Subject",
        html,
      });
      expect(results).toStrictEqual([
        {
          category: "Broadcast:",
          date: date,
          from: "Samaritan's Purse",
          message: "Duane Gaylord’s wife Nora / health concerns",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Compliance:",
          date: date,
          from: "Samaritan's Purse",
          message: "Gary Beard’s son Evan / cancer recurrence",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Donor Ministries:",
          date: date,
          from: "Samaritan's Purse",
          message: "Esther Fitzstevens / deteriorating health",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Donor Ministries:",
          date: date,
          from: "Samaritan's Purse",
          message: "Louise Stout / cancer",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "OCC:",
          date: date,
          from: "Samaritan's Purse",
          message: "Mike Brummitt’s wife Christi / cancer",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "OCC:",
          date: date,
          from: "Samaritan's Purse",
          message: "Ross Robinson’s wife Cindy / ALS",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "The President’s Office:",
          date: date,
          from: "Samaritan's Purse",
          message: "Mel Graham’s wife Terri / cancer",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "The President’s Office:",
          date: date,
          from: "Samaritan's Purse",
          message: "Aileen Coleman / aging health concerns",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "The President’s Office:",
          date: date,
          from: "Samaritan's Purse",
          message: "Sami Dagher / heart issues",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Projects:",
          date: date,
          from: "Samaritan's Purse",
          message: "Bev Kauffeldt / cancer",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Purchasing:",
          date: date,
          from: "Samaritan's Purse",
          message: "Lori Pearce’s husband Larry / ongoing health concerns",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Quality Assurance:",
          date: date,
          from: "Samaritan's Purse",
          message: "Kristen Sanders / cancer",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Security:",
          date: date,
          from: "Samaritan's Purse",
          message: "Hal Bullock and his family / recent loss of his wife Ruth",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "WMM:",
          date: date,
          from: "Samaritan's Purse",
          message: "Will Roberts’ wife Lucy / ongoing neurological issues",
          subject: "Subject",
          userId: "USERID",
        },
      ]);
    });
  });
});
