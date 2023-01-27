import * as express from 'express';
import ShiftChangeRequestController from '../controllers/shiftChangeController';

const shiftChangeRoute =  (controller: ShiftChangeRequestController) => {
    const router = express.Router();

    router.route('/').get(controller.getShiftChangeRequests);
    router.route('/').post(controller.createShiftChangeRequest);    

    return router;
}

export default shiftChangeRoute;