import rawReportingEventsRepository from "src/repositories/raweventsRepository";

export default class rawReportingExportService {
    private rawEventsRepository: rawReportingEventsRepository;

    constructor(rawEventsRepository){    
         this.rawEventsRepository = rawEventsRepository;
    }

    getPurchasesForAccountIdandDate = async (accountId : number, startDate: string, endDate: string) => {
        const query = 'SELECT * from event limit 1';
        
      //  let rows = await this.rawEventsRepository.queryRawEvents(query);
       // let result = this.convertToCSV(rows);
       // this.saveAsCSV(result);
        return await this.rawEventsRepository.queryRawEvents(query);
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
  
    saveAsCSV(result) {
        const fs = require('fs');
      const csv = result;
      try {
        fs.appendFileSync('./purchasesSample222.csv', csv);
      } catch (err) {
        console.error(err);
      }
    }

   
}