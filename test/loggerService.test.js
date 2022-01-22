import loggerService from "../src/services/loggerService";
import loggerRepository from "../src/repositories/logRepository";
import logModel from "../src/models/logModel";
import { fileURLToPath } from 'url';

jest.mock('url');

class TestLoggerRepository extends loggerRepository {
    logs = [];

    async create(log){
        this.logs=[...this.logs, log]
    }

    async getAll(){
        return this.logs;
    }

    //something wrong below
    searchLogs = async (textQuery) => {
        return this.logs.find({
            $text: {
                $search: textQuery
            }
        })
    }

}

const testLog = {
    type: 'test',
    message: 'test message'
}
const testLog2 = {
    type: 'elo',
    message: 'elo'
}

describe('Test logger service', () => {   
    fileURLToPath.mockReturnValue('/hello')

    let logger = new loggerService(new TestLoggerRepository(logModel));
    

    it('Logs the provided message', async () => {
        await logger.saveLog(testLog);
        const savedLogs = await logger.getAllLogs();
        expect(savedLogs).toEqual([testLog]);
    });
});

