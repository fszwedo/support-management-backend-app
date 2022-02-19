import * as express from 'express';
import ShiftChangeRequestController from '../controllers/shiftChangeController';

const shiftChangeRoute =  (controller: ShiftChangeRequestController) => {
    return (router: express.Router) => {
        router.route('/').get(controller.getShiftChangeRequests);
        router.route('/').post(controller.createShiftChangeRequest);
    }
}

export default shiftChangeRoute;