import getAgents from "../services/getAgentsService.js";
import getNewTickets from "../services/getNewTicketsService.js";
import assignTicket from "../services/assignTicketService.js";
import {
    readTextFile
} from "../services/readWriteCsv.js";
import getTodayShifts from "../services/getTodayShift.js";
import selectAgentToAssign from "../services/selectAgentToAssign.js";

const assignNewTicket = async (shiftFileName, lastAssignedUserId) => {
    let agentToAssign = lastAssignedUserId;

    const newTickets = await getNewTickets();

    //if there are no new tickets - stop execution
    if (newTickets.length === 0) {
        console.log(`nothing to assign!`);
        return lastAssignedUserId;
    }

    //if there are new tickets - check available agents
    const agents = await getAgents();

    //if there are no agents - stop execution
    if (agents.length === 0) {
        console.log(`no available agents!`);
        return lastAssignedUserId;
    }

    //get the shift data
    const shiftData = await readTextFile(shiftFileName)
    const todayShifts = getTodayShifts(shiftData);

    //initialize the batch ticket update request payload values
    let newTicketPayload = {
        "tickets": []
    };

    //iterate over the tickets and add them to the payload for batch update
    for (let i = 0; i < newTickets.length; i++) {
        agentToAssign = selectAgentToAssign(agents, agentToAssign, todayShifts);

        if (agentToAssign) {            
            let ticket = {
                "id": newTickets[i].id,
                "assignee_id": agentToAssign
            }
            newTicketPayload.tickets.push(ticket);
        } 
        else console.log(`no agent is available!`);
    }

    assignTicket(newTicketPayload);
    console.log(`Following tickets were assigned: ${newTicketPayload}`)
    return agentToAssign;
}

export default assignNewTicket;