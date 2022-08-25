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
        if (ticketCategory === 'Admintool access') ticket = await this.service.createAdminAccessRequest(req.body);
        res.status(200).json(ticket).send();
    }
}