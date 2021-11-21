import makeZendeskRequest from "./authenticationService.js";

const assignTicket = async (agentId, ticketId) => {
    const ticketBody = {
        "ticket": {
          "assignee_id": agentId
        }
      }

    const tickets = await makeZendeskRequest(`/api/v2/tickets/${ticketId}`, 'PUT', ticketBody);

    return tickets; //array of users
}

export default assignTicket;