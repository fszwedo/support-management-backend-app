import * as express from 'express';
import TimeTrackingController from '../controllers/timeTrackingController';

const timeTrackingRoutes =  (timeTrackingController: TimeTrackingController) => {
    const router = express.Router();

    router.get('/export', timeTrackingController.getTimeTrackingEvents);

    return router
}

export default timeTrackingRoutes;