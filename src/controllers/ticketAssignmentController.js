import getAgents from "../services/getAgentsService.js";
import getNewTickets from "../services/getNewTicketsService.js";
import assignTicket from "../services/assignTicketService.js";
import { readTextFile } from "../services/readWriteCsv.js";
import getTodayShifts from "../services/getTodayShift.js";
import selectAgentToAssign from "../services/selectAgentToAssign.js";

const assignNewTicket = async (shiftFileName, lastAssignedUserId, listofAssignedTickets) => {
    let agentToAssign = lastAssignedUserId;
    let assignedTicketId;

    const agents = await getAgents();
    const newTickets = await getNewTickets();
    console.log(newTickets)
    const shiftData = await readTextFile(shiftFileName)
    const todayShifts = getTodayShifts(shiftData);
    console.log(`tickets = ${newTickets.length}`)

    if(newTickets.length > 0) {
        for (let i = 0; i < newTickets.length; i++){
            agentToAssign = selectAgentToAssign(agents, lastAssignedUserId, todayShifts);
            lastAssignedUserId = agentToAssign;            
            if(agentToAssign) {
                console.log(`${agentToAssign} will be assigned!`);
                await assignTicket(agentToAssign, newTickets[i].id);
                assignedTicketId = newTickets[i].id;
            }
            else console.log(`no agent is available!`);
        }        
        return [agentToAssign, assignedTicketId];
    }

    console.log(`nothing to assign!`);
    return [agentToAssign, assignedTicketId];   
}

export default assignNewTicket;


