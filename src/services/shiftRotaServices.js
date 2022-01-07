import shiftRotaModel from "../models/shiftRotaModel.js";
import shiftRotaRepository from "../repositories/shiftRotaRepository.js";

export default class shiftRotaService {

    shiftRepository;
    constructor(shiftRepository){
        this.shiftRepository = shiftRepository;
    }

    getAllShifts = async () => { 
        return this.shiftRepository.getAll();
    }
    
    getTodayShifts =  async () => {
        return this.shiftRepository.getShiftForToday();
    }

    getShiftsForSpecifiedDay = async (day) => {
        return this.shiftRepository.getShiftForSpecifiedDay(new Date(day));
    }

    saveShiftRotaEntry = async (shiftRotaEntry) => {
        const newShiftRota = new shiftRotaModel(shiftRotaEntry);
        
        try {
           const checkIfThisShiftExists = await this.shiftRepository.getShiftForSpecifiedDay(new Date(shiftRotaEntry.date))
           if (checkIfThisShiftExists.length >=1) throw 'There already is an entry for this date!'
           await newShiftRota.validate();
        }
        catch (ex) {
            console.log(ex.message)
            return ex.message;
        }
    
        this.shiftRepository.create(shiftRotaEntry);
        return shiftRotaEntry;
    }
}