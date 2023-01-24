import * as express from 'express';
import TicketService from '../services/zendesk/ticketCreationService';

export default class TicketController {
    private service: TicketService;
    constructor(service: TicketService) {
        this.service = service;
    }

    postTicket = async (
        req: express.Request,
        res: express.Response,
    ) => {
        const ticketCategory = req.body.questionsFlow[0].answers[0];
        let ticket;
        //use appropriate service method for the selected path
        try {
            if (ticketCategory === 'Account access') ticket = await this.service.createAccountAccessRequest(req.body);
            else if (ticketCategory === 'Admintool access') ticket = await this.service.createAdminAccessRequest(req.body);
            else if (ticketCategory === 'Account creation') ticket = await this.service.createAccountCreationRequest(req.body);
            else if (ticketCategory === 'Platform issue') ticket = await this.service.createProblemReport(req.body);
            else if (ticketCategory === 'FTP') ticket = await this.service.createFTPRequest(req.body);
            else if (ticketCategory === 'Reporting') ticket = await this.service.createReportingRequest(req.body);
            else ticket = await this.service.createGeneralTicket(req.body);
        }
        catch (error) {
            console.log(error)
            //in case one of the functions above throws an error - generate a ticket anyway with a warning note
            await this.service.createGeneralTicket(req.body, true);
        }
        

        res.status(200).json(ticket).send();
    }
}