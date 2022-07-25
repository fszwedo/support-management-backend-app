import 'dotenv/config';
import makeZendeskRequest from '../src/services/zendesk/authenticationService'

let ticket;
let ticketPayload = {
    "tickets": []
  };

ticket = {
    "comment": {
        "body": `help me with access`
    },
    "priority": "urgent",
    "subject": `access ticket`
}
ticketPayload.tickets.push(ticket)

ticket = {
    "comment": {
        "body": `sql data export needed`
    },
    "priority": "urgent",
    "subject": `sql data export needed`
}
ticketPayload.tickets.push(ticket)

ticket = {
    "comment": {
        "body": `sql access`
    },
    "priority": "urgent",
    "subject": `sql access`
}
ticketPayload.tickets.push(ticket)

ticket = {
    "comment": {
        "body": `cannot log in to tiger`
    },
    "priority": "urgent",
    "subject": `cannot log in to tiger`
}
ticketPayload.tickets.push(ticket)

ticket = {
    "comment": {
        "body": `Miele PDS: Elektro-Shop Köck GmbH - Create FTP Today account for de_AT`
    },
    "priority": "urgent",
    "subject": `blablablab`
}
ticketPayload.tickets.push(ticket)

makeZendeskRequest('/api/v2/tickets/create_many', 'POST', ticketPayload)

