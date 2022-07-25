import { Repository } from './repository';

export default class LastAssignedAgentRepository extends Repository {    
    async getLast(ticketLevel: string = null) {  
        if(ticketLevel === null) { 
          return this.model.findOne({}, {}, {sort: { 'created_at': -1 }})
        }
        return this.model.findOne({level: ticketLevel}, {}, {sort: { 'created_at': -1 }})

    }
};