import UserRepository from "src/repositories/userRepository";
import { User } from '../models/userModel'
import * as mongoose from 'mongoose';

export default class UserService {
    constructor (private repository: UserRepository){}

    findUser = async (email: string) => {
        return await this.repository.find({email: email})
    }    

    saveUser = (user: User) => {
        return this.repository.create(user);
    }

    getAllUsers = async () => {
        return await this.repository.getAll();
    }

    getUserById = async (id: mongoose.ObjectId) => {
        return await this.repository.getById(id);
    }


}