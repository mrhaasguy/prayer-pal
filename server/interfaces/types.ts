export interface IMonitor {
  id?: string;
  keyword?: string;
  userEmail?: string;
}

export interface IDalService {
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByName(fullName: string): Promise<User | undefined>;
  getAllPrimaryUserEmails(): Promise<UserEmail[]>;
  saveUser(model: User): Promise<void>;
  savePrayerRequest(model: PrayerRequest): Promise<PrayerRequest>;
  getTopPrayerRequests(userId: string): Promise<PrayerRequest[]>;
  saveMonitor(model: IMonitor): Promise<void>;
  getAllMonitors(userEmail: string): Promise<IMonitor[]>;
  getMonitor(id: string): Promise<IMonitor | null>;
  deleteMonitor(id: string): Promise<void>;
  getPrayerRequest(id: string): Promise<PrayerRequest | null>;
}

export interface IEmail {
  from: { address: string; name?: string }[];
  subject: string;
  date: Date;
  text?: string | null;
  html: string;
}

export interface PrayerRequest {
  id?: string;
  userId: string;
  date: Date;
  from: string;
  subject: string;
  category?: string;
  message: string;
  prayerCount: number;
  lastPrayerDate: Date | null;
}

export interface User {
  id?: string;
  fullName: string;
  emails: UserEmail[];
}

export interface UserEmail {
  userId: string;
  email: string;
  isPrimary: boolean;
}
