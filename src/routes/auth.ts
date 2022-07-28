import express from "express";
import AuthController from "src/controllers/authController";

export default (controller: AuthController) => {
    const router = express.Router();

    router.route('/register').post(controller.register)
 
    router.route('/login').post(controller.login)

    return router;
}

