import express from 'express';
import 'dotenv/config';
import { CronJob } from 'cron';
import assignNewTicket from './src/controllers/ticketAssignmentController.js';


const app = express();

let returnValues;
let lastAssignedUserId = 0;
let listOfRecentlyAssignedTickets = [];

app.listen(process.env.PORT, () => {
   // console.log(`listening on ${process.env.PORT}`)
})

const job = new CronJob('1/10 * * * * *',  async function () {
    returnValues = await assignNewTicket('./src/lastAssignmentTimestamps.csv', lastAssignedUserId, listOfRecentlyAssignedTickets);
    lastAssignedUserId = returnValues[0];
    listOfRecentlyAssignedTickets.push(returnValues[1]);
    if (listOfRecentlyAssignedTickets.length > 100) listOfRecentlyAssignedTickets.shift();
    console.log(returnValues);
});
job.start();
