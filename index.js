import express from 'express';
import 'dotenv/config';
import { CronJob } from 'cron';
import assignNewTicket from './src/controllers/ticketAssignmentController.js';
import shiftRota from './src/routes/shiftRota.js';
import mongoose from 'mongoose';
import logModel from './src/models/logModel.js';
import loggerRepository from './src/repositories/logRepository.js';
import loggerService from './src/services/loggerService.js';
import * as cors from 'cors';

const app = express();
app.use(express.json());
app.use('/api/shiftRota', shiftRota);
app.use(cors());
const logger = new loggerService(new loggerRepository(logModel));

await mongoose.connect(`mongodb+srv://${process.env.MONGOLOGIN}:${process.env.MONGOPW}@cluster0.mgkhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(error => console.error('Could not connect to MongoDB!', error))

let lastAssignedUserId = 0;

app.listen(process.env.PORT, () => {
     console.log(`listening on ${process.env.PORT}`)
})

logger.saveLog({
    type: 'info/restart',
    message: 'App started at '+ new Date().toUTCString()
})

const job = new CronJob('1/10 * 7-22 * * *',  async function () {
    lastAssignedUserId = await assignNewTicket('./src/lastAssignmentTimestamps.csv', lastAssignedUserId, logger);
});
job.start();