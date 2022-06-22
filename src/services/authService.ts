import { User, UserType } from "../models/userModel";
import UserRepository from "src/repositories/userRepository";
const jwt = require('jsonwebtoken');
import * as bcrypt from "bcrypt";
import * as express from "express";
import * as mongoose from 'mongoose';

type UserModel = User & mongoose.Document;

export default class AuthService {
    private saltRounds: number = 10;
    private tokenName: string = 'x-auth-token'

    constructor(
        private repository: UserRepository,
        private jwtPrivateKey: string
    ) { }

    generateToken = (user: UserModel) => {
        const expiresIn = 60 * 60; //JWT token expires in 1 hour

        return jwt.sign(
            { _id: user._id, type: user.type },
            this.jwtPrivateKey,
            { expiresIn: expiresIn });
    };

    hashPassword = async (user: UserModel) => {
        return await bcrypt.hash(user.password, this.saltRounds);
    }

    checkPassword = async (password: string, user: User) => {
        return await bcrypt.compare(password, user.password)
    }

    saveUser = async (user: User) => {
        return await this.repository.create(user);
    }

}
