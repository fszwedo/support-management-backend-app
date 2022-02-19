import makeZendeskRequest from "./authenticationService";

/*payload should be in format
{
  "tickets": [
    { "id": 1, "status": "solved" },
    { "id": 2, "status": "pending" }
  ]
}
*/

const assignTicket = async (payload: object) => {
    const tickets = await makeZendeskRequest(`/api/v2/tickets/update_many`, 'PUT', payload);
    return tickets; //array of tickets
}

export default assignTicket;