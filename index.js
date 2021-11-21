import express from 'express';
import 'dotenv/config';

import makeZendeskRequest from './src/services/authenticationService.js'
import getNewTickets from './src/services/getNewTicketsService.js'
import getAgents from './src/services/getAgentsService.js';
import assignTicket from './src/services/assignTicketService.js';
import { readTextFile ,writeTextFile } from './src/services/readWriteTextFile.js';
import assignNewTicket from './src/controllers/ticketAssignmentController.js';

const app = express();

assignNewTicket();
//writeTextFile('./src/lastAssignmentTimestamps.csv', 'elo420')

app.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`)
})