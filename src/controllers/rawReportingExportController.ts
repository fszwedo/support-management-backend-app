import * as express from 'express';

import RawReportingExportService from 'src/services/RawReportingExportService';

export default class RawReportingExportController {
    private service: RawReportingExportService
    constructor(service: RawReportingExportService){
        this.service = service;
    }

    getPurchaseEvents = async (
        req: express.Request,
        res: express.Response,
    ) => {
        const purchaseEvents = await this.service.getPurchasesForAccountIdandDate(req.body.accountId, req.body.startDate, req.body.endDate, req.body.email);
        res.status(200).json(purchaseEvents);
    }
}