import { Repository } from './repository';

export default class LastAssignedAgentRepository extends Repository {    
    async getLast() {  
        return this.model.findOne({}, {}, {sort: { 'created_at': -1 }})
    }
};