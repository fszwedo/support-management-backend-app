import * as express from 'express';
import TicketService from '../../src/services/zendesk/ticketService';

export default class TicketController {
    private service: TicketService;
    constructor(service: TicketService){
        this.service = service;
    }

    postTicket = async (
        req: express.Request,
        res: express.Response,
    ) => {
        const ticketCategory = req.body.questionsFlow[0].answers[0];
        let ticket;

        //use appropriate service method for the selected path
        if (ticketCategory === 'Account access') ticket = await this.service.createAccountAccessRequest(req.body);
        else if (ticketCategory === 'Admintool access') ticket = await this.service.createAdminAccessRequest(req.body);
        else if (ticketCategory === 'Account creation') ticket = await this.service.createAccountCreationRequest(req.body);
        else if (ticketCategory === 'General platform issue') ticket = await this.service.createProblemReport(req.body);
        else if (ticketCategory === 'FTP') ticket = await this.service.createFTPRequest(req.body);
        else if (ticketCategory === 'Reporting') ticket = await this.service.createReportingRequest(req.body);
        else ticket = await this.service.createTicket(req.body);

        res.status(200).json(ticket).send();
    }
}