import getAgents from "../services/getAgentsService.js";
import getNewTickets from "../services/getNewTicketsService.js";
import assignTicket from "../services/assignTicketService.js";
import { readTextFile } from "../services/readWriteCsv.js";
import getTodayShifts from "../services/getTodayShift.js";
import selectAgentToAssign from "../services/selectAgentToAssign.js";

const assignNewTicket = async (shiftFileName, lastAssignedUserId) => {
    let agentToAssign = lastAssignedUserId;
    let assignedTickets = [];

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
                assignTicket(agentToAssign, newTickets[i].id);
                assignedTickets.push(newTickets[i].id);
            }
            else console.log(`no agent is available!`);
        }      
        console.log(`Tickets with following ids were assigned: ${assignedTickets}`)  
        return agentToAssign;
    }

    console.log(`nothing to assign!`);
    return agentToAssign;   
}

export default assignNewTicket;


