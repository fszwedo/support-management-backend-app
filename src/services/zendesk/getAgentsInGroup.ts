import makeZendeskRequest from "./authenticationService";
import { Agent } from "./getAgentsService";

const getAgentsInGroup = async (groupId: number) => {
    const groupMemberships = await makeZendeskRequest('/api/v2/group_memberships', 'GET'); 
    const agentIds = groupMemberships.filter(el => el.group_id === groupId)
    return agentIds.map(res => res.user_id);
}

export default getAgentsInGroup;