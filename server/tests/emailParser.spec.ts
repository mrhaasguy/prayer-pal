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
          category: "Dept1:",
          date: date,
          from: "Generic Company",
          message: "John Doe’s wife Jane / health concerns",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Dept2:",
          date: date,
          from: "Generic Company",
          message: "Frank Jackson's son Skylar / cancer recurrence",
          subject: "Subject",
          userId: "USERID",
        },
        {
          category: "Dept2:",
          date: date,
          from: "Generic Company",
          message: "Will Smith's wife Jada / ongoing cancer issues",
          subject: "Subject",
          userId: "USERID",
        },
      ]);
    });

    it("should work3", () => {
      let parser = new EmailParser();
      const html = fs
        .readFileSync("./server/tests/test3.input.html", "utf8")
        .toString();
      let date = new Date();
      let results = parser.parseEmailToPrayerRequests("USERID", {
        from: [{ address: "fake@email.com" }],
        date,
        subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
        html,
      });
      expect(results).toStrictEqual([
        {
          userId: "USERID",
          date,
          message:
            "Joe - pray for A W, be with Joe as he gets close to his 1 yr mark with FF, pray for his wife and children",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: undefined,
        },
        {
          userId: "USERID",
          date,
          message:
            "John L - pray for his daughter and future son-n-law's salvation and their up coming marriage, pray that John and Denise recover from COVID and don't have long COVID",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: undefined,
        },
        {
          userId: "USERID",
          date,
          message:
            "Jack - pray for my family and that I am learning and obeying what my role is in heading up my family per God's design, my business decisions and peace",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: undefined,
        },
        {
          userId: "USERID",
          date,
          message: "Gary - growth as a husband and praise for santification",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: undefined,
        },
        {
          userId: "USERID",
          date,
          message: "Danny - pray for his health and knees",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: undefined,
        },
        {
          userId: "USERID",
          date,
          message: "Bill - patience for him with his wife",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: undefined,
        },
        {
          userId: "USERID",
          date,
          message: "Curt - pray for wisdom without doubt",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: undefined,
        },
        {
          userId: "USERID",
          date,
          message:
            "Lee - pray for his family and praise God for all He does - Greatful",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: undefined,
        },
        {
          userId: "USERID",
          date,
          message:
            "Cory - praise that his potential divorce is on hold, continue to pray for his family",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: undefined,
        },
        {
          userId: "USERID",
          date,
          message: "Russell - nephew Chris's health",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: undefined,
        },
        {
          userId: "USERID",
          date,
          message: "Dave - be in prayer for his son Val",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: undefined,
        },
        {
          userId: "USERID",
          date,
          message: "Bob - pray for his brother-n-law Michael",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: undefined,
        },
        {
          userId: "USERID",
          date,
          message: "Matt - the world",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: undefined,
        },
        {
          userId: "USERID",
          date,
          message: "Terry - his family",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: undefined,
        },
        {
          userId: "USERID",
          date,
          message: "Jim Q - prayer that more would open up and talk things out",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: undefined,
        },
        {
          userId: "USERID",
          date,
          message:
            "Jim S - pray for all of our unsaved relatives and he and his wife as they continue on a sugar fast Comment [https://abfboone.ccbchurch.com/message_comment_list.php?message_id=10842&vi=1] Or simply reply to this email",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: undefined,
        },
      ]);
    });

    it("should work4", () => {
      let parser = new EmailParser();
      const html = fs
        .readFileSync("./server/tests/test4.input.html", "utf8")
        .toString();
      let date = new Date();
      let results = parser.parseEmailToPrayerRequests("USERID", {
        from: [{ address: "fake@email.com" }],
        date,
        subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
        html,
      });

      expect(results).toStrictEqual([
        {
          userId: "USERID",
          date,
          message:
            "Terry - his familly, his mom in assisted living, his children",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: "Prayer request from 2.14.22",
        },
        {
          userId: "USERID",
          date,
          message:
            "Scott - pray for his family and his 90 year old mother. Pray for the people of the world we live in and how quickly things seem to be falling",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: "Prayer request from 2.14.22",
        },
        {
          userId: "USERID",
          date,
          message:
            "Bob L - please lift up in pray the church in Jefferson that ABF is helping",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: "Prayer request from 2.14.22",
        },
        {
          userId: "USERID",
          date,
          message:
            "Jim S - continue to pray for our unsaved relatives and he and his wife as they continue on a 40 day sugar fast",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: "Prayer request from 2.14.22",
        },
        {
          userId: "USERID",
          date,
          message:
            "Michael Newman - pray for his father Bob Newman and himself",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: "Prayer request from 2.14.22",
        },
        {
          userId: "USERID",
          date,
          message:
            "Aaron - pray for he and his family as they begin a serch for more suitable living arrangements and that this process will not consume him, obedience",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: "Prayer request from 2.14.22",
        },
        {
          userId: "USERID",
          date,
          message:
            "Brian R - pray for his mom as she continues with treatment for cancer, and pray for his marriage and his children",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: "Prayer request from 2.14.22",
        },
        {
          userId: "USERID",
          date,
          message:
            "Michael Turner - he is thankful for the study and praying for the future of the Regular Joes group,, please pray for his wife's cousin and their family in their bereavement, and the family of Ron, a friend in England who has recently died",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: "Prayer request from 2.14.22",
        },
        {
          userId: "USERID",
          date,
          message:
            "Jack - please pray for peace and wisdom for me and my wife as we face some business decisions, pray for my children, also my mother in law Ann as she starts down the path of surgery to have her stomach removed due to cancer",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: "Prayer request from 2.14.22",
        },
        {
          userId: "USERID",
          date,
          message:
            "Russell - pray for his sister who suffers from anxiety and worry over a lot of things, pray for pastor Scott and his teaching",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: "Prayer request from 2.14.22",
        },
        {
          userId: "USERID",
          date,
          message:
            "David Sexton - pray for his sister in law Katy who is recovering from a liver transplant, she is Jewish and pray that she meets the Lord",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: "Prayer request from 2.14.22",
        },
        {
          userId: "USERID",
          date,
          message:
            "Bill - pray for is daughter Lucy and her husband JT in Colorado as they make some tough decisions about their business",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: "Prayer request from 2.14.22",
        },
        {
          userId: "USERID",
          date,
          message:
            "Danny - pray that the Lord will provide him with some much needed new knees. Pray for a guy named Jim that he has been trying to get into a program and what Danny's role in this should be",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: "Prayer request from 2.14.22",
        },
        {
          userId: "USERID",
          date,
          message: "Curt - wisdom",
          subject: "FW: [Adult: Men - Regular Joe’s] Prayer request",
          from: "Jack Sharp <abfboone@ccbchurch.com>",
          category: "Prayer request from 2.14.22",
        },
      ]);
    });
  });
});
