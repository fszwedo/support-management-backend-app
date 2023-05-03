import ShiftRotaRepository from '../src/repositories/shiftRotaRepository';
import shiftRotaService from '../src/services/shiftRotaService';
import shiftRotaModel from '../src/models/shiftRotaModel';
import mongoose from 'mongoose';
import {readTextFile} from '../src/services/readWriteCsv'
require('dotenv').config();

if (!process.env.MONGOLOGIN || !process.env.MONGOPW) throw new Error("Either MONGOLOGIN, or MONGOPW environment variable is not present!")

const updateShiftsInDb = async () => {

    await mongoose.connect(`mongodb+srv://${process.env.MONGOLOGIN}:${process.env.MONGOPW}@${process.env.MONGOCONNECTIONSTRING}`)
        .then(() => console.log('Connected to MongoDB...'))
        .catch(error => console.error('Could not connect to MongoDB!', error))

    //path is set rigidly to my documents folder - Phil
    const shiftData = await readTextFile("../../../../Filip/Documents/SHIFTROTA.csv")

    let offset: number = new Date().getTimezoneOffset();

    const shiftRota = new shiftRotaService(new ShiftRotaRepository(shiftRotaModel));

    //@ts-ignore
    await shiftRota.saveShiftRotaEntriesFromCsv(shiftData, offset)
}

const doBatchUpdate = async () => {
    await updateShiftsInDb();
    process.exit();
}

doBatchUpdate();