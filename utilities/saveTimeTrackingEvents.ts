require('dotenv').config()
var mongoose = require('mongoose')
import timeTrackingEventModel from '../src/models/timeTrackingEventModel';
import TimeTrackingEventRepository from '../src/repositories/timeTrackingEventRepository';
import TimeTrackingService from '../src/services/timeTrackingService';
import TimeTrackingController from '../src/controllers/timeTrackingController'

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


timeTrackingEventController.saveNewTimeTrackingEvents();