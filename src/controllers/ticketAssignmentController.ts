import getAgents from "../services/zendesk/getAgentsService";
import getNewTickets from "../services/zendesk/getNewTicketsService";
import assignTicket from "../services/zendesk/assignTicketService";
import selectAgentToAssign from "../services/zendesk/selectAgentToAssign";
import shiftRotaService from "../services/shiftRotaService";
import ShiftRotaRepository from "../repositories/shiftRotaRepository";
import shiftRotaModel from '../models/shiftRotaModel'
import makeZendeskRequest from "../services/zendesk/authenticationService";

const assignNewTicket = async (lastAssignedUserId, logger) => {
    const shiftRota = new shiftRotaService(new ShiftRotaRepository(shiftRotaModel));

    let agentToAssignId = lastAssignedUserId;
    let agentToAssignName = '';

    const newTickets = await getNewTickets();
    
    //if there are no new tickets - stop execution
    if (newTickets.length === 0) {
        //console.log(`nothing to assign!`);
        return lastAssignedUserId;
    }

    //get the shift data
    const todayShifts = await shiftRota.getTodayShifts();

    //if there are new tickets - check available agents
    const agents = await getAgents(makeZendeskRequest);

    const isAvailableAgent = selectAgentToAssign(agents, agentToAssignId, todayShifts);
    
    //if there are no agents - stop execution
    if (!isAvailableAgent[0]) {
        //console.log(`no available agents!`);
        return lastAssignedUserId;
    }

    //initialize the batch ticket update request payload values
    let newTicketPayload = {
        "tickets": []
    };

    //iterate over the tickets and add them to the payload for batch update
    for (let i = 0; i < newTickets.length; i++) {
        [agentToAssignId, agentToAssignName] = selectAgentToAssign(agents, agentToAssignId, todayShifts);
        
        let ticket = {
            "id": newTickets[i].id,
            "assignee_id": agentToAssignId
        }
        newTicketPayload.tickets.push(ticket);
        console.log(new Date().toLocaleString() + ' ticket id ' + newTicketPayload.tickets[i].id + ' was assigned to ' + agentToAssignName)
        
        logger.saveLog({
            type: 'info/ticket assignment',
            message: 'Ticket id ' + newTicketPayload.tickets[i].id + ' was assigned to ' + agentToAssignName
        })
    }

    assignTicket(newTicketPayload);

    return agentToAssignId;
}

export default assignNewTicket;