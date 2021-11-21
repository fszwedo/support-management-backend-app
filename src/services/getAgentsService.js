import makeZendeskRequest from "./authenticationService.js";

const getAgents = async () => {
    const agents = await makeZendeskRequest('/api/v2/users/search.json?query=role:admin&role:agent', 'GET');
    
    //just testing things here
    // agents.users.forEach(element => {
    //     console.log(element)        
    // });

    return agents.users; //array of users
}

export default getAgents;