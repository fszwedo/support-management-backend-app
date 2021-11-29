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
    let assignedTickets = [];

    const newTickets = await getNewTickets();
    console.log(newTickets)

    //if there are no new tickets - stop execution
    if (!newTickets) {
        console.log(`nothing to assign!`);
        return lastAssignedUserId;
    }

    //if there are new tickets - check available agents
    const agents = await getAgents();

    //if there are no agents - stop execution
    if (!agents) {
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
    let ticket = {
        "id": null,
        "assignee_id": null
    }

    //iterate over the tickets and add them to the payload for batch update
    for (let i = 0; i < newTickets.length; i++) {
        agentToAssign = selectAgentToAssign(agents, agentToAssign, todayShifts);

        if (agentToAssign) {
            console.log(`Ticket ${newTickets[i].id} will be assigned to ${agentToAssign}`); 
           
            ticket.id = newTickets[i].id;
            ticket.assignee_id = agentToAssign;

            newTicketPayload.push(ticket);
            assignedTickets.push(newTickets[i].id);
        } 
        else console.log(`no agent is available!`);
    }

    assignTicket(newTicketPayload);
    return agentToAssign;
}

export default assignNewTicket;