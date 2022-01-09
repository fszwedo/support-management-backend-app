import * as path from 'path';
import { fileURLToPath } from 'url';

//function to get the caller filename for the logs
function _getCallerFile() {
    var originalFunc = Error.prepareStackTrace;
    var callerfile;
    try {
        var err = new Error();
        var currentfile;

        Error.prepareStackTrace = function (err, stack) { return stack; };

        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();

            if(currentfile !== callerfile) break;
        }
    } catch (e) {}

    Error.prepareStackTrace = originalFunc; 
    return callerfile;
}

export default class loggerService {

    loggerRepository;
    constructor(loggerRepository){
        this.loggerRepository = loggerRepository;
    }

    getAllLogs = async () => { 
        return this.loggerRepository.getAll();
    }
    
    searchLogs = async (textQuery) => {
        return this.loggerRepository.searchLogs(textQuery);
    }

    saveLog = async (log) => {
        log.origin = path.basename(fileURLToPath(_getCallerFile()));
        return this.loggerRepository.create(log);
    }

    removeOldLogs = async () => {
        //to be implemented
    }
}