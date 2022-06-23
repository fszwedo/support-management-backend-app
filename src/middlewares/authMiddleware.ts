import { UserType } from "../models/userModel";
import * as express from 'express';
const jwt = require('jsonwebtoken');


export const authorize = (roles: UserType[]) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token: string = req.header('x-auth-token');
    console.log(token)
    if (!token) return res.status(401).json({message: 'UNAUTHORIZED'});
    try {
        const payload = jwt.verify(token, process.env.JWTPRIVATEKEY);
        return roles.includes(payload.type) ? next() : res.status(403).json({message: 'FORBIDDEN'});
    }
    catch (err) {
        console.log(err)
        res.status(400).json({message: 'INVALID TOKEN'});
    }
} 