import * as cheerio from 'cheerio';
import {convert} from 'html-to-text'
import { IEmail, IPrayerRequest } from './interfaces/types';
import os from "os";

export class EmailParser {

  constructor() {
  }

  public parse(email: IEmail): any {
    let text = email.text;
    if (!text) {
      text = convert(email.html, {wordwrap: false});
    }
    const lines = text.split('\n');
    let info: string = undefined;
    let prayerRequests: IPrayerRequest[] = [];
    lines.forEach(line => {
      const lineTrimmed = line.trim();
      if (lineTrimmed.startsWith('*')) {
        prayerRequests.push({date: email.date, message: lineTrimmed.substring(1)});
      }
    });


    return prayerRequests;
  }
}
