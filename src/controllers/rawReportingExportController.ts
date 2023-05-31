import * as express from 'express';
import { sendEmail} from "../services/sendEmailService";
import { convertJsonRowsToCSV } from 'src/services/readWriteCsv';

import RawReportingExportService from 'src/services/rawReportingExportService';

export default class RawReportingExportController {
    private service: RawReportingExportService
    constructor(service: RawReportingExportService){
        this.service = service;
    }

    getPurchaseEvents = async (
        req: express.Request,
        res: express.Response,
    ) => {
        
        let errorMessage:string = null;

        if(!req.body.accountId || (typeof(req.body.accountId) != 'number')) errorMessage = 'Missing or wrong accountId'; 
        if(!req.body.startDate)  errorMessage += (errorMessage ? ", " : "Missing ") + 'startDate';
        if (!req.body.endDate) errorMessage += (errorMessage ? ", " : "Missing ") + 'endDate';
        if (!req.body.email) errorMessage += (errorMessage ? ", " : "Missing ") + 'email';
  
        if(errorMessage) return res.status(400).json({statusMessage: 'Wrong request, ${errorMessage}'});
        

        const purchaseEventsRows = await this.service.getPurchasesForAccountIdandDate(req.body.accountId, req.body.startDate, req.body.endDate);
        const email = req.body.email;
        let resultCSV = await convertJsonRowsToCSV(purchaseEventsRows);
        const content = 'Please find your requested report in the attachment';
        //const fs = require('fs');
        const attachment64 = Buffer.from(resultCSV).toString('base64');
        try {
        await sendEmail(email, 'supportinternal@mail.zoovu.io', 'Zoovu Support', 'Your data report', content, attachment64, "report.csv");
        }
        catch (error) {
         console.error(`Error sending reporting email to ${email}`);
         if (error.response) {
           console.error(error.response.body.errors)
         }
         throw(error);
       }

        res.status(200).json(purchaseEventsRows);
        
    }


}