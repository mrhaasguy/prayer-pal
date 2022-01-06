import {convert} from 'html-to-text'
import dal from "./dal";
import { IEmail, PrayerRequest, User, IDalService } from './interfaces/types';
import {parseFullName} from 'parse-full-name';

export class EmailParser {

  constructor() {
  }

  public parseFullNameFromEmail(email: IEmail): string {
    const name = parseFullName(email.from[0].name ?? '');
    if (name.error?.length) {
      console.log('Name parse error: ' + name.error)
      return email.from[0].name ?? ''; // We tried our best
    }
    return name.last + ', ' + name.first;
  }

  public async parseUser(email: IEmail): Promise<User | null> {
    let user:User | undefined = undefined;
    await dal(async (dalService: IDalService)=>{
      user = await dalService.getUserByEmail(email.from[0].address);
      if (!user) {
        if (email.from[0].name) {
          const fullName = this.parseFullNameFromEmail(email);
          console.log('No user found for email ' + email.from[0].address +', looking up by name ' + fullName);
          user = await dalService.getUserByName(fullName);

          if (user) {
            user.emails.push({email: email.from[0].address, isPrimary: false, userId: user.id ?? ''});
            await dalService.saveUser(user);
          }
        }
      }
    });
    
    if (!user) {
      console.log('No user found for email or name');
      return null;
    }
    return user ?? null;
  }

  public parseEmailToPrayerRequests(userId: string, email: IEmail): PrayerRequest[] {

    let text = email.text;
    if (!text) {
      
      text = convert(email.html.replace(/&nbsp;/gi," "), {wordwrap: false});
    }
    const lines = text.split('\n');
    let prayerRequests: PrayerRequest[] = [];
    let from: string;
    let category: string;
    lines.forEach(line => {
      const lineTrimmed = line.trim();
      if (lineTrimmed.startsWith('From:')) {
        from = lineTrimmed.split('From:')[1].trim();
      } else if (lineTrimmed.startsWith('* ')) {
        prayerRequests.push({userId, date: email.date, message: lineTrimmed.substring(2), subject: email.subject, from: email.from[0].address, category});
      } else if (lineTrimmed.length > 0) {
        category = lineTrimmed;
      }
    });

    prayerRequests.forEach(p => p.from = from);

    return prayerRequests;
  }
}
