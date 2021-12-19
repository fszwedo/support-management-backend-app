import shiftRotaModel from "../models/shiftRotaModel.js";
import shiftRotaRepository from "../repositories/shiftRotaRepository.js";

const getAllShifts = () => {
    const shiftRepository = new shiftRotaRepository(shiftRotaModel);
    return shiftRepository.getAll();
}

const getTodayShifts = () => {
    const shiftRepository = new shiftRotaRepository(shiftRotaModel);
    return shiftRepository.getShiftForToday();
}

const saveShiftRotaEntry = async (shiftRotaEntry) => {
    const shiftRepository = new shiftRotaRepository(shiftRotaModel);

    const newShiftRota = new shiftRotaModel(shiftRotaEntry);

    try {
       await newShiftRota.validate();
    }
    catch (ex) {
        console.log(ex.message)
        return ex.message;
    }

    shiftRepository.create(shiftRotaEntry);
}


export { getTodayShifts, saveShiftRotaEntry };