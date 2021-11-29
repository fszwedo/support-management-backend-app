import makeZendeskRequest from "./authenticationService.js";

/*payload should be in format
{
  "tickets": [
    { "id": 1, "status": "solved" },
    { "id": 2, "status": "pending" }
  ]
}
*/

const assignTicket = async (payload) => {
    const tickets = await makeZendeskRequest(`/api/v2/tickets/update_many`, 'PUT', payload);
    return tickets; //array of tickets
}

export default assignTicket;