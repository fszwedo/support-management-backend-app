import getAgents from "../services/zendesk/getAgentsService";
import getNewTickets from "../services/zendesk/getNewTicketsService";
import assignTicket from "../services/zendesk/assignTicketService";
import selectAgentToAssign from "../services/zendesk/selectAgentToAssign";
import shiftRotaService from "../services/shiftRotaService";
import ShiftRotaRepository from "../repositories/shiftRotaRepository";
import shiftRotaModel from '../models/shiftRotaModel'
import makeZendeskRequest from "../services/zendesk/authenticationService";

import lastAssignedAgentService from '../services/lastAssignedAgentService';
import lastAssignedAgentModel from "../models/lastAssignedAgentModel";
import LastAssignedAgentRepository from '../repositories/lastAssignedAgentRepository';
import filterTicketsByKeyword from "../services/zendesk/filterTicketsByKeyword";

const assignNewTickets = async (logger) => {
    const shiftRota = new shiftRotaService(new ShiftRotaRepository(shiftRotaModel));
    const lastAssignedAgent = new lastAssignedAgentService(new LastAssignedAgentRepository(lastAssignedAgentModel));
    
    let agentToAssignId, agentToAssignName;

    const newTickets = await filterTicketsByKeyword(getNewTickets);
    
    //if there are no new tickets - stop execution
    if (newTickets.length === 0) {
        //console.log(`nothing to assign!`);
        return;
    }


    //get the shift data
    const todayShifts = await shiftRota.getTodayShifts();

    //if there are new tickets - get agents from Zendesk
    const agents = await getAgents(makeZendeskRequest);

    //check which agents are available at the current time
    const isAvailableAgent = await selectAgentToAssign(agents, lastAssignedAgent.getLastAgent, todayShifts,'any');
    
    //if there are no agents - stop execution
    if (!isAvailableAgent[0]) {
        //console.log(`no available agents!`);
        return;
    }

    //initialize the batch ticket update request payload values
    let newTicketPayload = {
        "tickets": []
    };

    //iterate over the tickets and add them to the payload for batch update
    for (let i = 0; i < newTickets.length; i++) {
        [agentToAssignId, agentToAssignName] = await selectAgentToAssign(agents, lastAssignedAgent.getLastAgent, todayShifts, newTickets[i].level);
        
        //save info about last assigned agent in the db
        await lastAssignedAgent.saveLastAgent(agentToAssignId);

        let ticket = {
            "id": newTickets[i].id,
            "assignee_id": agentToAssignId,
            'level': newTickets[i].level
        }
        newTicketPayload.tickets.push(ticket);
        console.log(new Date().toLocaleString() + ' ticket id ' + newTicketPayload.tickets[i].id + ' ticket level ' + newTicketPayload.tickets[i].level + ' was assigned to ' + agentToAssignName)
        
        logger.saveLog({
            type: 'info/ticket assignment',
            message: 'Ticket id ' + newTicketPayload.tickets[i].id + ' was assigned to ' + agentToAssignName
        })
    }    

    //finally - assign the tickets :)
   assignTicket(newTicketPayload);

    return;
}

export default assignNewTickets;