import makeZendeskRequest from "./authenticationService";
import ticket from "../../models/ticketModel";

const getTicketsToReassign = async () : Promise<ticket[]> => {
    const ticketsResponse = await makeZendeskRequest('/api/v2/search.json?query=type%3Aticket%20assignee%3Anone%20-status%3Anew', 'GET'); 
    return ticketsResponse.results;
}

export default getTicketsToReassign;


