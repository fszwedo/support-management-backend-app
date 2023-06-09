import * as express from 'express';
import TimeTrackingController from '../controllers/timeTrackingController';

const timeTrackingRoutes =  (timeTrackingController: TimeTrackingController) => {
    const router = express.Router();

    router.get('/', timeTrackingController.getTimeTrackingEvents);
    router.get('/download', timeTrackingController.downloadTimeTrackingEvents);

    return router
}

export default timeTrackingRoutes;