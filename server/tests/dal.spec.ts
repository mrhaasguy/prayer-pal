import { IDalService, IMonitor } from '../interfaces/types';
import dal from '../dal';

let disposed = false;
let querySelectResults = [];
const poolClient = {
    query: jest.fn((input: string, obj: object[])=>{
        if (input.indexOf("SELECT") === 0) {
            return {rows: querySelectResults};
        }
        return undefined;
    }),
    release: jest.fn(()=> disposed = true)
}
jest.mock('pg', () => {
    const pool = {
        connect: jest.fn(() => poolClient)
    };
    return { Pool: jest.fn(() => pool) };
});

afterEach(() => {
    querySelectResults = [];
    jest.clearAllMocks();
    disposed = false;
});

describe("dalService", ()=>{
    describe("saveMonitor function", ()=>{
        it("should perform insert query", async ()=>{
            let monitor : IMonitor = {};
            await dal(async (dalService: IDalService) => {
                await dalService.saveMonitor(monitor);
              });
            expect(poolClient.query).toHaveBeenCalledTimes(1);
            expect(poolClient.query.mock.calls[0][0]).toContain("INSERT INTO monitor");
            expect(poolClient.query.mock.calls[0][1]).toContain(monitor.id); // insert statement should contain id
        });
        it("should create new id guid", async ()=>{
            let monitor : IMonitor = {};
            await dal(async (dalService: IDalService) => {
                await dalService.saveMonitor(monitor);
              });
            expect(monitor.id).not.toBeUndefined();
        });
        it("should dispose properly", async ()=>{
            let monitor : IMonitor = {};
            await dal(async (dalService: IDalService) => {
                expect(disposed).toBeFalsy();
                await dalService.saveMonitor(monitor);
                expect(disposed).toBeFalsy();
              });
            expect(disposed).toBeTruthy();
        });
    });
    describe("getMonitor function", ()=>{
        it("should perform select query", async ()=>{
            let id : "SOME_ID"
            await dal(async (dalService: IDalService) => {
                await dalService.getMonitor(id);
              });
            expect(poolClient.query).toHaveBeenCalledTimes(1);
            expect(poolClient.query.mock.calls[0][0]).toContain("SELECT");
            expect(poolClient.query.mock.calls[0][1]).toContain(id); // select statement should contain id
        });
        it("should return a monitor if it exists", async ()=>{
            let id : "SOME_ID"
            var results: IMonitor;
            querySelectResults = [{id: id, keyword: 'KW', user_email: 'email'}];
            await dal(async (dalService: IDalService) => {
                results = await dalService.getMonitor(id);
              });
            expect(results).not.toBeNull();
            expect(results).toEqual({id: id, keyword: 'KW', userEmail: 'email'});
        });
        it("should return null if it doesn't exist", async ()=>{
            let id : "SOME_ID"
            var results: IMonitor = undefined;
            querySelectResults = [];
            await dal(async (dalService: IDalService) => {
                results = await dalService.getMonitor(id);
              });
            expect(results).toBeNull();
        });
        it("should dispose properly", async ()=>{
            let monitor : IMonitor = {};
            await dal(async (dalService: IDalService) => {
                expect(disposed).toBeFalsy();
                await dalService.getMonitor("id");
                expect(disposed).toBeFalsy();
              });
            expect(disposed).toBeTruthy();
        });
    });
    describe("deleteMonitor function", ()=>{
        const id = "SOME_ID";
        it("should perform delete query", async ()=>{
            await dal(async (dalService: IDalService) => {
                await dalService.deleteMonitor(id);
              });
            expect(poolClient.query).toHaveBeenCalledTimes(1);
            expect(poolClient.query.mock.calls[0][0]).toContain("DELETE FROM monitor");
            expect(poolClient.query.mock.calls[0][1]).toContain(id); // delete statement should contain id
        });
        it("should dispose properly", async ()=>{
            await dal(async (dalService: IDalService) => {
                expect(disposed).toBeFalsy();
                await dalService.deleteMonitor(id);
                expect(disposed).toBeFalsy();
              });
            expect(disposed).toBeTruthy();
        });
    });
});