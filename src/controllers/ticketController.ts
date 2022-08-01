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
        const ticket = await this.service.createAccessRequest(req.body);
        res.status(200).json(ticket).send();
    }
}