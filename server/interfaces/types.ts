export interface IMonitor {
    id?: string,
    keyword?: string,
    userEmail?: string
}

export interface  IDalService {
    saveMonitor(model: IMonitor): Promise<void>,
    getAllMonitors(userEmail: string): Promise<IMonitor[]>,
    getMonitor(id: string) : Promise<IMonitor|null>,
    deleteMonitor(id: string): Promise<void>
}

export interface IEmail {
    from: {address: string, name?: string},
    subject: string,
    date: Date,
    text?: string | null,
    html: string
}

export interface IPrayerRequest {
    date: Date,
    category?: string,
    message: string,
}