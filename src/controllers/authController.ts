import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import AuthService from '../services/authService';
import * as express from 'express';
import User from '../models/userModel';
import UserService from '../services/userService';


export default class AuthController {

    constructor(private authService: AuthService, private userService: UserService) {}

    register = async (req: express.Request, res: express.Response, next?: express.NextFunction) => {
        try {
            let user = await this.userService.findUser(req.body.email)
            if (user) return res.status(400).json({message: 'User with this email already exists!'});
            req.body.password = await this.authService.hashPassword(req.body.password)
            user = new User(req.body)
            await this.userService.saveUser(user);
            res.status(201).json({message: 'User created!'});
        }
        catch (err) {
            return res.status(500).json({message: err.message});
        }
    }

    login = async (req: express.Request, res: express.Response, next?: express.NextFunction) => {
        try {
            const user = await this.userService.findUser(req.body.email);
            if (!user) return res.status(401).json({message: 'Invalid email or password.'});
            const passwordCheckResult = await this.authService.checkPassword(req.body.password, user)
            if (!passwordCheckResult)  return res.status(401).json({message: 'Invalid email or password.'});
            if (!user.isActive)  return res.status(401).json({message: 'Your user is not active.'});
            const token = this.authService.generateToken(user);
            res.header('x-auth-token', token).status(200).json({_id: user._id, type: user.type});
        }
        catch {
            return res.status(500).json({message: 'Something went wrong...'});
        }
    }

}