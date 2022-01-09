const selectAgentToAssign = (agents, lastAssignedAgentId, shiftSchedule) => {

    //extract the data if the shift rota is provided as an array with one object-type element (instead of object itself)
    if (Array.isArray(shiftSchedule) === true) shiftSchedule = shiftSchedule[0];
    
    const currentDate = new Date();
    const currentHour = currentDate.getHours() + 1;
    const currentMinute = currentDate.getMinutes();

    let currentlyAvailableAgents = [];
    
    //first select the agents available at the current hour
    for (let agent in agents) {       

        //if in the array of available agents we have a name of the agent that was returned Zendesk - get his working hours
        if (shiftSchedule.agents.find(e => e === agents[agent].name)) {
            const agentPositionInArray = shiftSchedule.agents.indexOf(agents[agent].name);
            const agentShiftLimits = shiftSchedule.hours[agentPositionInArray].split('-');
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