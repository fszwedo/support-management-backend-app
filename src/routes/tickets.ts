import * as express from 'express';
import ticketController from '../controllers/ticketController';

const ticketRoutes =  (controller: ticketController) => {
    return (router: express.Router) => {
        router.route('/').post(controller.postTicket);
    }
}

export default ticketRoutes;