const getAgents = async (makeZendeskRequest) => {
    const agents = await makeZendeskRequest('/api/v2/users/search.json?role[]=admin&role[]=agent', 'GET');
    return agents.users; //array of users
}

export default getAgents;