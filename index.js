import express from 'express';
import 'dotenv/config';
import { CronJob } from 'cron';
import assignNewTicket from './src/controllers/ticketAssignmentController.js';


const app = express();

let lastAssignedUserId = 0;

app.listen(process.env.PORT, () => {
   // console.log(`listening on ${process.env.PORT}`)
})

const job = new CronJob('1/10 * * * * *',  async function () {
    lastAssignedUserId = await assignNewTicket('./src/lastAssignmentTimestamps.csv', lastAssignedUserId);
});
job.start();
