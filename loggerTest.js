import mongoose from 'mongoose';
import 'dotenv/config';
import logModel from './src/models/logModel.js';
import loggerRepository from './src/repositories/logRepository.js';
import loggerService from './src/services/loggerService.js';

await mongoose.connect(`mongodb+srv://${process.env.MONGOLOGIN}:${process.env.MONGOPW}@cluster0.mgkhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(error => console.error('Could not connect to MongoDB!', error))

const logger = new loggerService(new loggerRepository(logModel));

logger.saveLog({
    type: 'warning',
    message: 'test warning message'
})

console.log('log saved')



