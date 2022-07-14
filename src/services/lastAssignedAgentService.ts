import lastAssignedAgentModel from '../models/lastAssignedAgentModel';
import LastAssignedAgentRepository from '../repositories/lastAssignedAgentRepository';
import { LastAssignedAgent } from '../models/lastAssignedAgentModel';

export default class lastAssignedAgentService {
    private lastAssignedAgentRepository: LastAssignedAgentRepository;

    constructor(lastAssignedAgentRepository){
        this.lastAssignedAgentRepository = lastAssignedAgentRepository;
    }

    saveLastAgent = async (lastAssignedAgentId: string, ticketLevel: string = null) => { 
        const previousAssignedAgent = await this.lastAssignedAgentRepository.getLast(ticketLevel);
        if(ticketLevel === null) {
            if (previousAssignedAgent) return this.lastAssignedAgentRepository.updateById(previousAssignedAgent._id, {
                agentId: lastAssignedAgentId,
                level: ticketLevel
            })

            return this.lastAssignedAgentRepository.create({
                agentId: lastAssignedAgentId,
                level: ticketLevel  

            })
        }
        else {

            if (previousAssignedAgent) return this.lastAssignedAgentRepository.updateById(previousAssignedAgent._id, {
                agentId: lastAssignedAgentId,
                level: ticketLevel
            })

            return this.lastAssignedAgentRepository.create({
                agentId: lastAssignedAgentId,
                level: ticketLevel
            })

        }
    }

    getLastAgent = async (ticketLevel: string = null) => {
        const lastAgentId = await this.lastAssignedAgentRepository.getLast(ticketLevel);

        if (lastAgentId) return lastAgentId;
        return 0;
    }
}
    