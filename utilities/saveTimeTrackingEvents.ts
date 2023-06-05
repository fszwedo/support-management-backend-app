require('dotenv').config()
var express = require('express')
var mongoose = require('mongoose')
var cors = require('cors');
import timeTrackingEventModel from '../src/models/timeTrackingEventModel';
import TimeTrackingEventRepository from '../src/repositories/timeTrackingEventRepository';
import TimeTrackingService from '../src/services/timeTrackingService';
import TimeTrackingController from '../src/controllers/timeTrackingController'
import timeTrackingRoutes from '../src/routes/timeTracking'

const mongooseConnection = async () => {
    mongoose.set('strictQuery', true);
    await mongoose.connect(`mongodb+srv://${process.env.MONGOLOGIN}:${process.env.MONGOPW}@${process.env.MONGOCONNECTIONSTRING}`)
        .then(() => console.log('Connected to MongoDB...'))
        .catch(error => console.error('Could not connect to MongoDB!', error));
}
mongooseConnection();

const timeTrackingEventRepository = new TimeTrackingEventRepository(timeTrackingEventModel);
const timeTrackingEventService = new TimeTrackingService(timeTrackingEventRepository);
const timeTrackingEventController = new TimeTrackingController(timeTrackingEventService);

const saveTrackingEvents = async () => {
    await timeTrackingEventController.saveNewTimeTrackingEvents();
    process.exit();
}

const getTrackingEvents = async () => {
    const app = express();
    app.use(cors({
        exposedHeaders: 'x-auth-token'
    }));
    app.use(express.json());
    app.use('/api/timeTracking', timeTrackingRoutes(timeTrackingEventController));
    // await timeTrackingEventController.getTimeTrackingEvents();

    app.listen(process.env.PORT, () => {
        console.log(`listening on ${process.env.PORT}`)
    });    
}

//saveTrackingEvents();
getTrackingEvents();

