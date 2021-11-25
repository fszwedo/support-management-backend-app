import makeZendeskRequest from "./authenticationService.js";

const getAgents = async () => {
    const agents = await makeZendeskRequest('/api/v2/users/search.json?role[]=admin&role[]=agent', 'GET');
    return agents.users; //array of users
}

export default getAgents;