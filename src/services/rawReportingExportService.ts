import RawReportingEventsRepository from "src/repositories/raweventsRepository";

export default class RawReportingExportService {
    private rawEventsRepository: RawReportingEventsRepository;
    constructor(rawEventsRepository){    
         this.rawEventsRepository = rawEventsRepository;
    }

    getPurchasesForAccountIdandDate = async (accountId : number, startDate: string, endDate: string) => {
      const query = `SELECT * from event where ui_trigger_type = 'purchase' and account_id = '${accountId}' and inserted_timestamp >= '${startDate}' and inserted_timestamp <= '${endDate}'`;

       let rows = await this.rawEventsRepository.queryRawEvents(query);
       return rows;
    }
    
}
