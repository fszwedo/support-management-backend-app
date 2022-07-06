import UserService from "../services/userService";
import * as express from 'express';

export default class UserController {
    private service;

    constructor(service: UserService) {
        this.service = service
    }

    getAllUsers = async (
        req: express.Request,
        res: express.Response,
    ) => {
        const users = await this.service.getAllUsers();
        res.status(200).json(users)
    }

    getMe = async (
        req: express.Request,
        res: express.Response,
    ) => {
        console.log(req.params)
        const user = await this.service.getUserById(req.params.id);
        res.status(200).json(user)
    }

    getUserByEmail = async (
        req: express.Request,
        res: express.Response,
    ) => {
        const user = await this.service.getUserByEmail(req.body.email);
        res.status(200).json(user)
    }

    changeUser = async (
        req: express.Request,
        res: express.Response,
    ) => {
        const user = await this.service.saveUser(req.body)
        res.status(200).json(user)
    }

    createUser = async (
        req: express.Request,
        res: express.Response,
    ) => {
        const user = await this.service.saveUser(req.body)
        res.status(200).json(user)
    }
}