export interface IMonitor {
    id?: string,
    keyword?: string,
    userEmail?: string
}

export interface  IDalService {
    saveMonitor(model: IMonitor): Promise<void>,
    getAllMonitorIds(): Promise<string[]>,
    getMonitor(id: string) : Promise<IMonitor|null>,
    deleteMonitor(id: string): Promise<void>
}