import express from "express";
import ShiftRotaController from "../controllers/shiftRotaController";
import { authorize } from "..//middlewares/authMiddleware";
import { UserType } from "../models/userModel";

const shiftRotaRoutes = (shiftRotaController: ShiftRotaController) => {
    const router = express.Router();

    router.route('/').get(
        authorize([UserType.User, UserType.Admin]),
        shiftRotaController.getShiftRotaData
    )

    //user can get the shift data for specific day here
    router.route('/:date').get(
        authorize([UserType.User, UserType.Admin]),
        shiftRotaController.getShiftRotaForSelectedDate
    )

    //user can save the shift data for specific day here
    router.route('/').put(
        authorize([UserType.Admin]),
        shiftRotaController.setShiftRotaForSelectedDate
    )

    return router;
}


export default shiftRotaRoutes;
