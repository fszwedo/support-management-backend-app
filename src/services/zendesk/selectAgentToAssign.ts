import { ShiftRota } from "../../models/shiftRotaModel";
import { Agent } from './getAgentsService';


// in this component we assume the times in shift schedule are in CET 
//we convert everything to UTC for clarity

const selectAgentToAssign = (agents: Agent[], lastAssignedAgentId: string, shiftSchedule: ShiftRota) => {
    //extract the data if the shift rota is provided as an array with one object-type element (instead of object itself)
    if (Array.isArray(shiftSchedule) === true) shiftSchedule = shiftSchedule[0];
    
    //assure the date will be in UTC
    const currentDate = new Date();
    const currentHour = currentDate.getUTCHours();    
    const currentMinute = currentDate.getUTCMinutes();

    let currentlyAvailableAgents = [];
    //first select the agents available at the current hour
    for (let agent in agents) {       

        //if in the array of available agents we have a name of the agent that was returned Zendesk - get his working hours
        if (shiftSchedule.agents.find(e => e === agents[agent].name)) {
            const agentPositionInArray = shiftSchedule.agents.indexOf(agents[agent].name);
            const agentShiftLimits = shiftSchedule.hours[agentPositionInArray].split('-');
            //setting hours in current date
            const date = new Date();
            const agentStartTime = new Date(date.setHours(parseInt(agentShiftLimits[0]), 0,0,0)).getUTCHours();
            const agentEndTime = new Date(date.setHours(parseInt(agentShiftLimits[1]), 0,0,0)).getUTCHours();
            //check if the agent works at the moment with 30 minute offset (so agent working till 5pm will get the tickets assigned till 4:30pm) - if yes then push him to the array
            if (agentStartTime <= currentHour && 
                    (agentEndTime > currentHour + 1 || 
                    (agentEndTime - 1 === currentHour && currentMinute < 30) || 
                    (agentEndTime  === 22 && currentHour === 21))) 
                    /*then*/ currentlyAvailableAgents.push(agents[agent]);
        }        
    }

    //then select the agent that should get the ticket assigned
    for (let agent in currentlyAvailableAgents) {
        if (currentlyAvailableAgents[agent].id > lastAssignedAgentId){
           return [currentlyAvailableAgents[agent].id, currentlyAvailableAgents[agent].name]
        } 
    }

    if (currentlyAvailableAgents.length > 0)
    return [currentlyAvailableAgents[0].id, currentlyAvailableAgents[0].name]

    return [undefined, undefined]
}

export default selectAgentToAssign;