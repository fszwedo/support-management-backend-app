require('dotenv').config();
var mongoose = require('mongoose');

import shiftRotaModel from '../src/models/shiftRotaModel';
import ShiftRotaRepository from '../src/repositories/shiftRotaRepository';
import ShiftRotaService from '../src/services/shiftRotaService';

import sendEmailstoAgents from '../src/controllers/sendEmailController';

const shiftRotaRepository = new ShiftRotaRepository(shiftRotaModel);
const shiftRotaService = new ShiftRotaService(shiftRotaRepository);

const mongooseConnection = async () => {
    await mongoose.connect(`mongodb+srv://${process.env.MONGOLOGIN}:${process.env.MONGOPW}@cluster0.mgkhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(error => console.error('Could not connect to MongoDB!', error))
}
mongooseConnection();

sendEmailstoAgents(shiftRotaService); 