import makeZendeskRequest from "./authenticationService";

const getNewTickets = async () => {
    let newTickets;
    const ticketsResponse = await makeZendeskRequest('/api/v2/tickets.json?page[size]=100&sort=-id', 'GET');
    if (ticketsResponse.tickets) {
        const tickets = ticketsResponse.tickets;    
        newTickets = tickets.filter(ticket => ticket.status != 'xyz');
    }    
    return newTickets;
}

export default getNewTickets;