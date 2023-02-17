import ShiftRotaRepository from '../src/repositories/shiftRotaRepository';
import shiftRotaService from '../src/services/shiftRotaService';
import shiftRotaModel from '../src/models/shiftRotaModel';
import mongoose from 'mongoose';
import 'dotenv/config';
import { readTextFile } from '../src/services/readWriteCsv';

const updateShiftsInDb = async () => {

    await mongoose.connect(`mongodb+srv://${process.env.MONGOLOGIN}:${process.env.MONGOPW}@cluster0.mgkhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
        .then(() => console.log('Connected to MongoDB...'))
        .catch(error => console.error('Could not connect to MongoDB!', error))

    //path is set rigidly to my documents folder - Phil
    const shiftData = await readTextFile("../../../../Filip/Documents/SHIFTROTA.csv")

    let offset: number = new Date().getTimezoneOffset();

    const shiftRota = new shiftRotaService(new ShiftRotaRepository(shiftRotaModel));

    //@ts-ignore
    await shiftRota.saveShiftRotaEntriesFromCsv(shiftData,offset)   
}

const doBatchUpdate = async() => {
    await updateShiftsInDb();
    process.exit();
}

doBatchUpdate();