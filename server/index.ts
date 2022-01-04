import express from "express";
import path from "path";
import cluster from "cluster";
import os from "os";
import dal from "./dal";
import { IDalService, IMonitor, IEmail, User } from "./interfaces/types";
import { EmailParser } from "./emailParser";
import nodemailer from 'nodemailer';

const result = require('dotenv').config();
if (result.error) {
  console.error(result.error);
}

const numCPUs = os.cpus().length;

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isPrimary) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Priority serve any static files.
  app.use(
    express.static(path.resolve(__dirname, "../angular-ui/dist/angular-ui"))
  );

  // API requests
  app.get("/api/v1/statuscheck", async (req, res) => {
    res.status(200).json({ result: "OK" });
  });

  app.post("/api/v1/monitors", async (req, res, next) => {
    var input = req.body;
    if (!input) return res.status(400).json({ error: "body is required" });
    if (!input.keyword)
      return res.status(400).json({ error: "keyword is required" });
    if (!input.userEmail)
      return res.status(400).json({ error: "userEmail is required" });

    var model: IMonitor = {
      keyword: input.keyword,
      userEmail: input.userEmail,
    };
    var succeeded = await dal(async (dalService: IDalService) => {
      await dalService.saveMonitor(model);
    }).catch(next);
    if (!succeeded) return;

    return res.status(201).json(model);
  });
  app.get("/api/v1/monitors", async (req, res, next) => {
    var email = req.query.userEmail;
    if (!email)
      return res.status(400).json({ error: "userEmail parameter is required" });

    var models: IMonitor[] = [];
    var succeeded = await dal(async (dalService: IDalService) => {
      models = await dalService.getAllMonitors(<string>email);
    }).catch(next);
    if (!succeeded) return;

    res.status(200).json({ rows: models });
  });
  app.get("/api/v1/monitors/:id", async (req, res, next) => {
    var id = req.params.id;
    if (!id) return res.status(400).json({ error: "id is required" });

    var model: IMonitor | null = null;
    var succeeded = await dal(async (dalService: IDalService) => {
      model = await dalService.getMonitor(id);
    }).catch(next);
    if (!succeeded) return;
    if (!model) {
      res.status(404).json("404 Not Found");
      return;
    }
    res.status(200).json(model);
  });

  // All remaining requests return the Angular app, so it can handle routing.
  app.get("*", function (req, res) {
    if (req.originalUrl.indexOf("/api/") !== 0) {
      res.sendFile(
        path.resolve(__dirname, "../angular-ui/dist/angular-ui", "index.html")
      );
    }
  });

  app.listen(PORT, function () {
    console.error(
      `Node ${
        isDev ? "dev server" : "cluster worker " + process.pid
      }: listening on port ${PORT}`
    );
  });

  var MailListener = require("mail-listener2");

  if (!process.env.SMTP_HOST) {
    throw new Error('SMTP_HOST not provided');
  }

var mailListener = new MailListener({
  username: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  host: process.env.SMTP_HOST,
  port: 993, // imap port
  tls: true,
  debug: console.log, // Or your custom function with only one incoming argument. Default: null
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
});

mailListener.start(); // start listening

// stop listening
//mailListener.stop();

mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});

mailListener.on("error", function(err:any){
  console.log(err);
});

// emailParsed {
//   html: '<div dir="ltr">The message!</div>\n',
//   text: 'The message!\n',
//   headers: {
//     'return-path': '<mrhaasguy@gmail.com>',
//     'delivered-to': 'prayer@thehaashaus.com',
//     received: [
//       'from mproxy201.prod.i.riva.co ([10.10.81.107]) by prod-use1-mbackend1001.ops.titan.email with LMTP id UL6XIll0zmGlfgAAPIr9UA (envelope-from <mrhaasguy@gmail.com>) for <prayer@thehaashaus.com>; Fri, 31 Dec 2021 03:09:13 +0000',
//       'from mx.flockmail.com ([10.10.81.107]) by mproxy201.prod.i.riva.co with LMTP id kILBIVl0zmGJdAAA6G8cDw (envelope-from <mrhaasguy@gmail.com>) for <prayer@thehaashaus.com>; Fri, 31 Dec 2021 03:09:13 +0000',
//       'from mx.flockmail.com (localhost [127.0.0.1]) by mx.flockmail.com (Postfix) with ESMTP id 7ABF540004 for <prayer@thehaashaus.com>; Fri, 31 Dec 2021 03:09:13 +0000 (UTC)',
//       'from mail-oi1-f182.google.com (mail-oi1-f182.google.com [209.85.167.182]) by mx.flockmail.com (Postfix) with ESMTPS id 2D9B940005 for <prayer@thehaashaus.com>; Fri, 31 Dec 2021 03:09:13 +0000 (UTC)',
//       'by mail-oi1-f182.google.com with SMTP id w80so4311294oie.9 for <prayer@thehaashaus.com>; Thu, 30 Dec 2021 19:09:13 -0800 (PST)'
//     ],
//     'received-spf': 'pass (sender SPF authorized) identity=mailfrom; client-ip=209.85.167.182; helo=mail-oi1-f182.google.com; envelope-from=mrhaasguy@gmail.com;',
//     'authentication-results': [
//       'mx.flockmail.com; dmarc=pass (p=none dis=none) header.from=gmail.com',
//       'mx.flockmail.com; dkim=pass (2048-bit key) header.d=gmail.com header.i=@gmail.com header.b="ZflxW7SA"'
//     ],
//     'dkim-signature': 'v=1; a=rsa-sha256; c=relaxed/relaxed; d=gmail.com; s=20210112; h=mime-version:from:date:message-id:subject:to; bh=PetkhAQ4GyQ1k/kWWtY4Vo9f4ZqBS0PKuxJomZNNJcY=; b=ZflxW7SAa46pinVaoXpGx3OZ5XvIYThwCHikqY4Q+IsXW9Z+/b6UOmPWL+IqHAyUAc VvDaAA6+uMuhvZTZMkhlC73O9r51EddZ++pHvJYnm054JTKxsshKAida/OzyQBf5ONj5 NCMGGPg6N77LRVhnIhI6323UVojtNMBZaIzA2vhUeXiy5MZMKdt739dsx4i1+7nZji+Q kkyxY2SbFLHe2bAe7vZzCtyEv1N3Q39sRqaXAwo2Zl0F5/zHOH7UU/YTQ0CBD2Q/m9Rv zQoUHXirwhz6DTwRL0MVYmRvt1+WWzydLa2BWehBxafRJ3ZZsx3dDhQ1gHZor7fx/VvO KzzQ==',
//     'x-google-dkim-signature': 'v=1; a=rsa-sha256; c=relaxed/relaxed; d=1e100.net; s=20210112; h=x-gm-message-state:mime-version:from:date:message-id:subject:to; bh=PetkhAQ4GyQ1k/kWWtY4Vo9f4ZqBS0PKuxJomZNNJcY=; b=Ei2TuMIvbRzJSDJSCQgtU0iqE/TNgXaMihSZRZcbnV1vENLLmTGHh89Yviet6ZXTDN fPFnJka+8lxJknldIoH79e//8xJEpaam8aybFr5UgpCNf806j81yv20utpE9+qFery2a EmpisrbxtpGlixpTz8G4ShcbSx3O/LQ8crxOy0vR3O6R7DTJxF18fLCj8TPbnJ/HTWDB kS8xiEaljzi+O+WnfiKzk/3dnm2KKjymX24ELUAMd8dATTv7dlhESZuI/w6m87/a261N RC/CGdEYb6rAPBsF9725gIjrP435Bc6xnybEqWjJxpu9Qd34PiwjYJZiVHbL7GFBIZSU 6dXA==',
//     'x-gm-message-state': 'AOAM531TqqBFHMl6fb5H03V07CmS1a88DSyVQuLr4C8s8t9xJmY7BWsw E9Kodou+vx9J/EYDwpF8ed5Rtb5XFqrz96uxum9/tPy3vwA=',
//     'x-google-smtp-source': 'ABdhPJzTG3kar7KdbOaodXuRI1o61c16v7P2sJsZEj+pnh0V1JpjnVUqIwBRMLvxuSAF6JjfQHvF5KxCmLUtBWdQasU=',
//     'x-received': 'by 2002:a05:6808:1707:: with SMTP id bc7mr26066883oib.86.1640920152237; Thu, 30 Dec 2021 19:09:12 -0800 (PST)',
//     'mime-version': '1.0',
//     from: 'Aaron Haas <mrhaasguy@gmail.com>',
//     date: 'Thu, 30 Dec 2021 22:09:01 -0500',
//     'message-id': '<CAK_zYXsaTpg13WPa9yc5_qdb=COmw7K0=Xx9iqcpAf_HeMyGeg@mail.gmail.com>',
//     subject: 'The subject',
//     to: 'prayer@thehaashaus.com',
//     'content-type': 'multipart/alternative; boundary="000000000000c76a7505d4687ea3"',
//     'x-cmae-score': '0',
//     'x-cmae-analysis': 'v=2.4 cv=XdPqcK15 c=1 sm=1 tr=0 ts=61ce7459 a=mhd/gIxGtYZ9RLrJ+ad2kw==:117 a=IOMw9HtfNCkA:10 a=x7bEGLp0ZPQA:10 a=OyfAJaTBa9UA:10 a=qMo77Ti7v6FnBjs34WkA:9 a=QEXdDO2ut3YA:10',
//     'x-virus-scanned': 'ClamAV using ClamSMTP'
//   },
//   subject: 'The subject',
//   messageId: 'CAK_zYXsaTpg13WPa9yc5_qdb=COmw7K0=Xx9iqcpAf_HeMyGeg@mail.gmail.com',
//   priority: 'normal',
//   from: [ { address: 'mrhaasguy@gmail.com', name: 'Aaron Haas' } ],
//   to: [ { address: 'prayer@thehaashaus.com', name: '' } ],
//   date: 2021-12-31T03:09:01.000Z,
//   receivedDate: 2021-12-31T03:09:13.000Z,
mailListener.on("mail", async function(mail: IEmail, seqno: any, attributes:any){
  // do something with mail object including attachments
  console.log('New email!');
  console.log('FROM: ', mail.from);
  console.log('SUBJECT: ' + mail.subject);
  console.log('DATE: ' + mail.date);
  console.log('BODY TEXT: ' + mail.text);
  console.log('BODY HTML: ' + mail.html);

  var parser = new EmailParser();
  let user = await parser.parseUser(mail);
  if (!user) {
    if (mail.from[0]?.name && mail.from[0].name.indexOf('Haas') >= 0) {
      await dal(async (dalService: IDalService) => {
        user = {fullName: mail.from[0].name ?? '', emails: [{email: mail.from[0].address, isPrimary: true, userId:''}]}
        await dalService.saveUser(user as User);
        });
    } else {
      console.log('Ignoring email from "' + mail.from[0]?.address + '" since it is not a registered user');
    }
  }
  if (user && user.id) {
    console.log('parsing email...');
    let prayerRequests = parser.parseEmailToPrayerRequests(user.id, mail);
    await dal(async (dalService: IDalService) => {
      await Promise.all(prayerRequests.map(p => dalService.savePrayerRequest(p)));
      });

    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 993, // imap port
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Prayer Pal" <' + process.env.SMTP_USER + '>', // sender address
      to: user.emails.filter(u => u.isPrimary)[0].email,
      subject: "Prayer Requests received", // Subject line
      text: "Hey " + user.fullName +", \r\nI received the following prayer requests:\r\n" + JSON.stringify(prayerRequests, null, 2), // plain text body
    });
  
    console.log("Email sent: %s", info.messageId);
  }
  //console.log("emailParsed", mail);
  // mail processing code goes here

});

}

