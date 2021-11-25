import makeZendeskRequest from "./authenticationService.js";

const assignTicket = async (agentId, ticketId) => {
    const ticketBody = {
        "ticket": {
          "assignee_id": agentId
        }
      }
    console.log(`ticket id is ${ticketId}`)
    const tickets = await makeZendeskRequest(`/api/v2/tickets/${ticketId}`, 'PUT', ticketBody);

    return tickets; //array of tickets
}

export default assignTicket;