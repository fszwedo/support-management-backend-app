import { string } from "yargs";
import zendeskRequest from "./authenticationService";

export interface Agent {
    name: string,
    id: number,
    email: string
}

const getAgents = async (makeZendeskRequest: typeof zendeskRequest) => {
    const agents = await makeZendeskRequest('/api/v2/users/search.json?role[]=admin&role[]=agent', 'GET');
    return agents.users; //array of users
}

export default getAgents;