import shiftRotaModel from "../models/shiftRotaModel.js";
import shiftRotaRepository from "../repositories/shiftRotaRepository.js";

export default class shiftRotaService {

    shiftRepository;
    constructor(shiftRepository){
        this.shiftRepository = shiftRepository;
    }

    getAllShifts = () => { 
        return this.shiftRepository.getAll();
    }
    
    getTodayShifts = () => {
        return this.shiftRepository.getShiftForToday();
    }

    saveShiftRotaEntry = async (shiftRotaEntry) => {
        const newShiftRota = new shiftRotaModel(shiftRotaEntry);
    
        try {
           await newShiftRota.validate();
        }
        catch (ex) {
            console.log(ex.message)
            return ex.message;
        }
    
        this.shiftRepository.create(shiftRotaEntry);
    }

}
