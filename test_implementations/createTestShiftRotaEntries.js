import shiftRotaRepository from '../src/repositories/shiftRotaRepository.js';;
import shiftRotaService from '../src/services/shiftRotaServices.js';
import shiftRotaModel from '../src/models/shiftRotaModel.js';
import mongoose from 'mongoose';
import 'dotenv/config';
import { readTextFile } from '../src/services/readWriteCsv.js'

await mongoose.connect(`mongodb+srv://${process.env.MONGOLOGIN}:${process.env.MONGOPW}@cluster0.mgkhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(error => console.error('Could not connect to MongoDB!', error))

const shiftData = await readTextFile('../helpscout-ticket-management/src/services/readWriteCsv.js')

const shiftRota = new shiftRotaService(new shiftRotaRepository(shiftRotaModel));

console.log(shiftData)


