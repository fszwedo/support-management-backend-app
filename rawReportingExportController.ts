import * as express from 'express';

import rawReportingExportService from 'src/services/zendesk/rawReportingExportService';

export default class rawReportingExportController {
    private service: rawReportingExportService
    constructor(service: rawReportingExportService){
        this.service = service;
    }

    getPurchaseEvents = async (
        req: express.Request,
        res: express.Response,
    ) => {
        console.log(req.body);
        const purchaseEvents = await this.service.getPurchasesForAccountIdandDate(req.body.accountId, req.body.startDate, req.body.endDate);
        console.log(purchaseEvents);
        res.status(200).json(purchaseEvents);
    }
}