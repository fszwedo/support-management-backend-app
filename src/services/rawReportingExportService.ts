import RawReportingEventsRepository from "src/repositories/raweventsRepository";
import { sendReporting } from "../services/sendEmailService";

export default class RawReportingExportService {
    private rawEventsRepository: RawReportingEventsRepository;

    constructor(rawEventsRepository){    
         this.rawEventsRepository = rawEventsRepository;
    }

    getPurchasesForAccountIdandDate = async (accountId : number, startDate: string, endDate: string, email: string) => {
        const query = `SELECT * from event where ui_trigger_type = 'purchase' and account_id = '${accountId}' and inserted_timestamp >= '${startDate}' and inserted_timestamp <= '${endDate}'`;
        
       let rows = await this.rawEventsRepository.queryRawEvents(query);
       let resultCSV = await this.convertToCSV(rows);
       await sendReporting(resultCSV, email);
       return rows;
    }

    convertToCSV  = async (rows) => {
        const converter = require('json-2-csv');
        let result = null;
        const csvOptions = {
            delimiter : {
                wrap  : '\'', // Double Quote (") character
                field : ';', // Comma field delimiter
                array : ',', // Semicolon array value delimiter
                eol   : '\n' // Newline delimiter
            },
            prependHeader    : true,
            sortHeader       : false,
            trimHeaderValues : true,
            trimFieldValues  : true   
        };
        await  converter.json2csvAsync(rows,csvOptions)
               .then(csv=>{result=csv;})
               .catch(err=>{
                console.log('error converting to CSV');
                throw(err);
            })
        return result;
    }
}