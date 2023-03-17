import { Repository } from './repository';
import { User } from 'src/models/userModel';

export default class UserRepository extends Repository { 
    async getByZendeskId(zendeskId: string): Promise<User> {
        return this.model.findOne({zendeskId: zendeskId});
    }
};