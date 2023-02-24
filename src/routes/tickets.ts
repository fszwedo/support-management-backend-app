import * as express from 'express';
import ticketController from '../controllers/ticketController';

const ticketRoutes =  (ticketController: ticketController) => {
    const router = express.Router();

    router.post('/leadgen', ticketController.postTicket);

    return router
}

export default ticketRoutes;