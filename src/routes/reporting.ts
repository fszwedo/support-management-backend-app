import * as express from 'express';
import rawReportingExportController from 'src/controllers/rawReportingExportController';
import {authorize} from "../middlewares/authMiddleware";
import {UserType} from "../models/userModel";

const reportingExportRoutes =  (reportingController: rawReportingExportController) => {
    const router = express.Router();
    router.route('/purchase-events').get(
       authorize([UserType.User, UserType.Admin]),
        reportingController.getPurchaseEvents);

    return router;
}

export default reportingExportRoutes;