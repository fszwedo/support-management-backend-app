var express = require('express')
var mongoose = require('mongoose')
var cors = require('cors');
require('dotenv').config()
import cron from 'cron'

import assignNewTicket from './src/controllers/ticketAssignmentController';
import shiftRota from './src/routes/shiftRota';

import logModel from './src/models/logModel';
import LoggerRepository from './src/repositories/logRepository';
import LoggerService from './src/services/loggerService';

import shiftRotaModel from './src/models/shiftRotaModel';
import ShiftRotaRepository from './src/repositories/shiftRotaRepository';
import ShiftRotaService from './src/services/shiftRotaService';
import ShiftRotaController from './src/controllers/shiftRotaController';

import shiftChangeRequestModel from './src/models/shiftChangeRequestModel';
import ShiftChangeRepository from './src/repositories/shiftChangeRequestRepository';
import ShiftChangeService from './src/services/shiftChangeService';
import ShiftChangeController from './src/controllers/shiftChangeController';
import shiftChangeRoute from './src/routes/shiftChangeRequest';

const shiftRotaRepository = new ShiftRotaRepository(shiftRotaModel);
const shiftRotaService = new ShiftRotaService(shiftRotaRepository);
const shiftRotaController = new ShiftRotaController(shiftRotaService);

const shiftChangeRepository = new ShiftChangeRepository(shiftChangeRequestModel);
const shiftChangeService = new ShiftChangeService(shiftChangeRepository, shiftRotaRepository);
const shiftChangeController = new ShiftChangeController(shiftChangeService);

console.log('starting for ' + process.env.URL)

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/shiftRota', shiftRota(shiftRotaController));
app.use('/api/shiftChangeRequest', shiftChangeRoute(shiftChangeController)); 

const logger = new LoggerService(new LoggerRepository(logModel));

const mongooseConnection = async () => {
    await mongoose.connect(`mongodb+srv://${process.env.MONGOLOGIN}:${process.env.MONGOPW}@cluster0.mgkhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(error => console.error('Could not connect to MongoDB!', error))
}
mongooseConnection();

let lastAssignedUserId = 0;

app.listen(process.env.PORT, () => {
     console.log(`listening on ${process.env.PORT}`)
})

logger.saveLog({
        type: 'info/restart',
        message: 'App started at '+ new Date().toUTCString()
    })

const job = new cron.CronJob('1/10 * 5-24 * * *',  async function () {
    lastAssignedUserId = await assignNewTicket(lastAssignedUserId, logger);
});
job.start();