import express from "express";
import UserController from "../controllers/userController";
import { authorize } from "..//middlewares/authMiddleware";
import { UserType } from "../models/userModel";

export default (userController: UserController) => {
    const router = express.Router();

    router.get('/',
        authorize([UserType.Admin]),
        userController.getAllUsers
    )

    router.get('/me',
        authorize([UserType.User, UserType.Admin]),
        userController.getMe
    )

    router.route('/:id').put(
        authorize([UserType.Admin]),
        userController.changeUser
    )

    router.route('/').post(
        authorize([UserType.Admin]),
        userController.createUser
    )
    return router;
}

