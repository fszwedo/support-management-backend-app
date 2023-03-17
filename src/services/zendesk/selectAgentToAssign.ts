import { ShiftRota } from "../../models/shiftRotaModel";
import { Agent } from './getAgentsService';
import { TicketLevels, categories } from "src/CONSTANTS";
import UserRepository from "src/repositories/userRepository";

const selectAgentToAssign = async (agents: Agent[], getLastAssignedAgentId: Function, shiftSchedule: ShiftRota, userRepository: UserRepository, ticketCategory) => { // we should define the type of ticketCategory here...   : categories = null) => {
    //extract the data if the shift rota is provided as an array with one object-type element (instead of object itself)
    if (Array.isArray(shiftSchedule) === true) shiftSchedule = shiftSchedule[0];

    //get hour and minute in UTC
    const currentDate = new Date();
    const currentHour = currentDate.getUTCHours();
    const currentMinute = currentDate.getUTCMinutes();

    let currentlyAvailableAgents = [];
    //first select the agents available at the current hour
    for (let agent in agents) {

        //if in the array of available agents we have a name of the agent that was returned Zendesk - get his working hours
        if (shiftSchedule.agents.find(e => e === agents[agent].name)) {
            //extract agent from the shift rota array
            const agentPositionInArray = shiftSchedule.agents.indexOf(agents[agent].name);

            //extract periods for which the agent works in the day - they are stored as semicolon-separated values in the database 
            //8-10;12-16 means agent works from 8 to 10 and then from 12 to 16
            const agentShiftPeriods = shiftSchedule.hours[agentPositionInArray].split(';');

            //for each worktime period - define if the agent is eligible for ticket assignments
            for (let period of agentShiftPeriods) {
                //extract the shift start and end hours to two-element array
                const agentShiftLimits = period.split('-');
                const agentStartTime = parseInt(agentShiftLimits[0]);
                const agentEndTime = parseInt(agentShiftLimits[1]);

                //check if the agent works at the moment with 30 minute offset (so agent working till 5pm will get the tickets assigned till 4:30pm) - if yes then push him to the array
                //agents working till 10pm are getting the tickets assigned till the end of the shift
                if (agentStartTime <= currentHour &&
                    (agentEndTime - 1 > currentHour ||
                        (agentEndTime - 1 === currentHour && currentMinute < 30) ||
                        //below we check if end hour is 10PM CET - but it is 9PM UTC, thus 'agentEndTime  === 21'
                        (agentEndTime === 21 && currentHour === 20)))
                    /*then*/ currentlyAvailableAgents.push(agents[agent]);
            }
        }
    }

    //then check if there are agents who can take the given category ticket
    //if there are agents specialized in the given category - we should only assign this ticket to them
    //if there are no agents specialized in the given category - we should assign the ticket to some other agent anyway

    const agentsSpecializedInCurrentCategory = currentlyAvailableAgents.filter(agent => agent.details.includes(ticketCategory))
    console.log()

    //then select the agent that should get the ticket assigned
    const lastAssignedAgentId = await getLastAssignedAgentId(ticketCategory);

    for (let agent in currentlyAvailableAgents) {
        if (currentlyAvailableAgents[agent].id > lastAssignedAgentId.agentId) {
            return [currentlyAvailableAgents[agent].id, currentlyAvailableAgents[agent].name]
        }
    }

    if (currentlyAvailableAgents.length > 0)
        return [currentlyAvailableAgents[0].id, currentlyAvailableAgents[0].name]

    return [undefined, undefined]
}

export default selectAgentToAssign;