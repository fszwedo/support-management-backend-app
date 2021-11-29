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

    //get the shift data
    const shiftData = await readTextFile(shiftFileName)
    const todayShifts = getTodayShifts(shiftData);

    //if there are new tickets - check available agents
    const agents = await getAgents();
    const isAvailableAgent = selectAgentToAssign(agents, agentToAssign, todayShifts);

    //if there are no agents - stop execution
    if (!isAvailableAgent) {
        console.log(`no available agents!`);
        return lastAssignedUserId;
    }

    //initialize the batch ticket update request payload values
    let newTicketPayload = {
        "tickets": []
    };

    //iterate over the tickets and add them to the payload for batch update
    for (let i = 0; i < newTickets.length; i++) {
        agentToAssign = selectAgentToAssign(agents, agentToAssign, todayShifts);

        let ticket = {
            "id": newTickets[i].id,
            "assignee_id": agentToAssign
        }
        newTicketPayload.tickets.push(ticket);
    }

    assignTicket(newTicketPayload);
    console.log(`Following tickets were assigned:`);
    console.log(newTicketPayload);
    return agentToAssign;
}

export default assignNewTicket;