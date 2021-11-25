const selectAgentToAssign = (agents, lastAssignedAgentId, shiftSchedule) => {

    for (let agent in agents){
        console.log(agents[agent])
        if(agents[agent].id > lastAssignedAgentId
            ) return agents[agent].id
    }
    return agents[0].id;

}

export default selectAgentToAssign;