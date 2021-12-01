//this file/logic REALLY calls for a refactor

const selectAgentToAssign = (agents, lastAssignedAgentId, shiftSchedule) => {

    const currentDate = new Date();
    const currentHour = currentDate.getHours() + 1;
    const currentMinute = currentDate.getMinutes();

    let currentlyAvailableAgents = [];

    //first select the agents available at the current hour
    for (let agent in agents) {

        if (shiftSchedule[agents[agent].name]) {
            const agentShiftLimits = shiftSchedule[agents[agent].name].split('-');
            //check if the agent works at the moment with 30 minute offset (so agent working till 5pm will get the tickets assigned till 4:30pm) - if yes then push him to the array
            if (agentShiftLimits[0] <= currentHour && 
                    (agentShiftLimits[1] > currentHour + 1 || 
                    (agentShiftLimits[1] - 1 === currentHour && currentMinute < 30) || 
                    (agentShiftLimits[1]  === 22 && currentHour === 21))) 
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