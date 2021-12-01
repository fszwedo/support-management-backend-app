import getAgents from "../services/getAgentsService.js";
import getNewTickets from "../services/getNewTicketsService.js";
import assignTicket from "../services/assignTicketService.js";
import {
    readTextFile
} from "../services/readWriteCsv.js";
import getTodayShifts from "../services/getTodayShift.js";
import selectAgentToAssign from "../services/selectAgentToAssign.js";

const assignNewTicket = async (shiftFileName, lastAssignedUserId) => {
    let agentToAssignId = lastAssignedUserId;
    let agentToAssignName = '';

    const newTickets = await getNewTickets();

    //if there are no new tickets - stop execution
    if (newTickets.length === 0) {
        //console.log(`nothing to assign!`);
        return lastAssignedUserId;
    }

    //get the shift data
    const shiftData = await readTextFile(shiftFileName)
    const todayShifts = getTodayShifts(shiftData);

    //if there are new tickets - check available agents
    const agents = await getAgents();
    const isAvailableAgent = selectAgentToAssign(agents, agentToAssignId, todayShifts);
    
    //if there are no agents - stop execution
    if (!isAvailableAgent[0]) {
        console.log(`no available agents!`);
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
    }

    assignTicket(newTicketPayload);

    for(let i = 0; i < newTicketPayload.tickets.length; i++){
        console.log(new Date().toLocaleString() + ' ticket id ' + newTicketPayload.tickets[i].id + ' was assigned to ' + agentToAssignName)
    }
    return agentToAssignId;
}

export default assignNewTicket;