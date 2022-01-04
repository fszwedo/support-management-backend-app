import 'dotenv/config';
import makeZendeskRequest from '../src/services/authenticationService.js'

let ticket;
let ticketPayload = {
    "tickets": []
  };


for (let i = 0; i < 10; i++) {

     ticket = {
        "comment": {
            "body": `this is ticket ${i+1}`
        },
        "priority": "urgent",
        "subject": `this is ticket ${i+1}`
    }
            
    ticketPayload.tickets.push(ticket)
}

makeZendeskRequest('/api/v2/tickets/create_many', 'POST', ticketPayload)

