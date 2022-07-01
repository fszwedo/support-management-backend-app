import UserRepository from "src/repositories/userRepository";
import { User } from '../models/userModel'

export default class UserService {
    constructor (private repository: UserRepository){}

    findUser = async (email: string) => {
        return await this.repository.find({email: email})
    }

    saveUser = async (user: User) => {
        return await this.repository.create(user);
    }

    getAllUsers = async () => {
        return await this.repository.getAll();
    }

}