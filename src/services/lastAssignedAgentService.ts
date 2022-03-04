import lastAssignedAgentModel from '../models/lastAssignedAgentModel';
import LastAssignedAgentRepository from '../repositories/lastAssignedAgentRepository';
import { LastAssignedAgent } from '../models/lastAssignedAgentModel';

export default class lastAssignedAgentService {
    private lastAssignedAgentRepository: LastAssignedAgentRepository;

    constructor(lastAssignedAgentRepository){
        this.lastAssignedAgentRepository = lastAssignedAgentRepository;
    }

    saveLastAgent = async (lastAssignedAgentId: string) => { 
        const previousAssignedAgent = await this.lastAssignedAgentRepository.getLast();
        if (previousAssignedAgent) return this.lastAssignedAgentRepository.updateById(previousAssignedAgent._id, {
            agentId: lastAssignedAgentId
        })

        return this.lastAssignedAgentRepository.create({
            agentId: lastAssignedAgentId
        })
    }

    getLastAgent = async () => {
        const lastAgentId = await this.lastAssignedAgentRepository.getLast();

        if (lastAgentId) return lastAgentId;
        return 0;
    }
}
    