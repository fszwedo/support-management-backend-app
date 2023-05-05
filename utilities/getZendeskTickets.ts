import 'dotenv/config';
import makeZendeskRequest from '../src/services/zendesk/authenticationService'
import reassignTickets from '../src/controllers/ticketReassignmentController'


const getZendeskTickets = async () => {
    const tickets = await makeZendeskRequest('/api/v2/tickets.json', 'GET')
    console.log(tickets)
}

getZendeskTickets();

//reassignTickets();
