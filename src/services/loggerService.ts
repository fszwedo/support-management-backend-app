import LoggerRepository from '../repositories/logRepository';
import { Log } from '../models/logModel';

export default class LoggerService {
    loggerRepository;

    constructor(loggerRepository: LoggerRepository){
        this.loggerRepository = loggerRepository;
    }

    getAllLogs = async () => { 
        return this.loggerRepository.getAll();
    }
    
    searchLogs = async (textQuery: string) => {
        return this.loggerRepository.searchLogs(textQuery);
    }

    saveLog = async (log: Log) => {    
        log.timestamp = new Date().toUTCString();
        return this.loggerRepository.create(log);
    }

    removeOldLogs = async () => {
        //to be implemented
    }
}