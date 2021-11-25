import express from 'express';
import 'dotenv/config';
import { CronJob } from 'cron';

import makeZendeskRequest from './src/services/authenticationService.js'
import getNewTickets from './src/services/getNewTicketsService.js'
import getAgents from './src/services/getAgentsService.js';
import assignTicket from './src/services/assignTicketService.js';
import {
    readTextFile
} from './src/services/readWriteCsv.js';
import assignNewTicket from './src/controllers/ticketAssignmentController.js';
import getTodayShifts from './src/services/getTodayShift.js';

const app = express();


let lastAssignedUserId = 0;

app.listen(process.env.PORT, () => {
   // console.log(`listening on ${process.env.PORT}`)
})




const job = new CronJob('1/3 * * * * *',  async function () {
    lastAssignedUserId = await assignNewTicket('./src/lastAssignmentTimestamps.csv', lastAssignedUserId);
    //console.log(lastAssignedUserId)
});
job.start();