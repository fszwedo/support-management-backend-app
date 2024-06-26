require('dotenv').config();
var mongoose = require('mongoose');

import shiftRotaModel from '../src/models/shiftRotaModel';
import ShiftRotaRepository from '../src/repositories/shiftRotaRepository';
import ShiftRotaService from '../src/services/shiftRotaService';

import sendEmailstoAgents from '../src/controllers/sendEmailController';

import userModel from '../src/models/userModel';
import UserRepository from '../src/repositories/userRepository';
import UserService from '../src/services/userService';

const shiftRotaRepository = new ShiftRotaRepository(shiftRotaModel);
const shiftRotaService = new ShiftRotaService(shiftRotaRepository);
const userRepository = new UserRepository(userModel);
const userService = new UserService(userRepository);

if(!process.env.MONGOLOGIN || !process.env.MONGOPW)throw new Error("Either MONGOLOGIN, or MONGOPW environment variable is not present!")

const mongooseConnection = async () => {
    await mongoose.connect(`mongodb+srv://${process.env.MONGOLOGIN}:${process.env.MONGOPW}@cluster0.mgkhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(error => console.error('Could not connect to MongoDB!', error))
}
mongooseConnection();

sendEmailstoAgents(shiftRotaService, userService); 