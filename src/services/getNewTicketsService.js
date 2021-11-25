import makeZendeskRequest from "./authenticationService.js";

const getNewTickets = async () => {
    const ticketsResponse = await makeZendeskRequest('/api/v2/tickets.json?page[size]=100&sort=-id', 'GET');
    const tickets = ticketsResponse.tickets;
    const newTickets = tickets.filter(ticket => ticket.status === 'new');
    return newTickets;
}

export default getNewTickets;