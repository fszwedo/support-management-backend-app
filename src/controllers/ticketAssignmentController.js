import getAgents from "../services/getAgentsService.js";
import getNewTickets from "../services/getNewTicketsService.js";
import assignTicket from "../services/assignTicketService.js";
import { readTextFile } from "../services/readWriteCsv.js";
import getTodayShifts from "../services/getTodayShift.js";
import selectAgentToAssign from "../services/selectAgentToAssign.js";

const assignNewTicket = async (shiftFileName, lastAssignedUserId) => {
    let agentToAssign = lastAssignedUserId;
    const agents = await getAgents();
    const newTickets = await getNewTickets();
    const shiftData = await readTextFile(shiftFileName)
    const todayShifts = getTodayShifts(shiftData);
    if(newTickets.length > 0) 
    agentToAssign = selectAgentToAssign(agents, lastAssignedUserId, todayShifts);

   // console.log(agents);
    return agentToAssign;   
}

export default assignNewTicket;