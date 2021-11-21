import makeZendeskRequest from "./authenticationService.js";

const getNewTickets = async () => {
    const tickets = await makeZendeskRequest('/api/v2/search.json?query=status:new', 'GET');

    return tickets.results;  //array of tickets
}

export default getNewTickets;