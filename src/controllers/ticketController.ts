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
        console.log(req.body)

        //const ticket = await this.service.createTicket();
        res.status(200)//.json(ticket)
    }
}