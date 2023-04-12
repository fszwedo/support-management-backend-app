import mongoose from 'mongoose';
import 'dotenv/config';
import logModel from '../src/models/logModel';
import loggerRepository from '../src/repositories/logRepository';
import loggerService from '../src/services/loggerService';

if(!process.env.MONGOLOGIN || process.env.MONGOPW)throw new Error("Either MONGOLOGIN, or MONGOPW environment variable is not present!")

const loggerTest = async () => {
    await mongoose.connect(`mongodb+srv://${process.env.MONGOLOGIN}:${process.env.MONGOPW}@cluster0.mgkhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
        .then(() => console.log('Connected to MongoDB...'))
        .catch(error => console.error('Could not connect to MongoDB!', error))

    const logger = new loggerService(new loggerRepository(logModel));

    logger.saveLog({
        type: 'warning',
        message: 'test warning message'
    })

    console.log('log saved');
}


loggerTest();