import shiftRotaModel from "../models/shiftRotaModel.js";
import shiftRotaRepository from "../repositories/shiftRotaRepository.js";
import { readTextFile } from "./readWriteCsv.js";

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
        return this.shiftRepository.getShiftsForSpecifiedDay(new Date(day));
    }

    getShiftsFromCurrentMonthOnwards = async (day) => {
        return this.shiftRepository.getShiftsFromCurrentMonthOnwards(new Date(day));
    }

    saveShiftRotaEntry = async (shiftRotaEntry) => {
        const newShiftRota = new shiftRotaModel(shiftRotaEntry);
                
        try {
        await newShiftRota.validate();
           const checkIfThisShiftExists = await this.shiftRepository.getShiftsForSpecifiedDay(new Date(shiftRotaEntry.date))
           if (checkIfThisShiftExists.length >=1) {
             //  console.log(`There already is a shift rota entry for the date ${shiftRotaEntry.date}! Updating entry...`)
               this.shiftRepository.updateByDate(shiftRotaEntry);
           }
           else {
               this.shiftRepository.create(shiftRotaEntry);
              // console.log(`Creating shift rota entry for the date ${shiftRotaEntry.date}...`)
            }
        }
        catch (ex) {
            console.log(ex.message)
            return ex.message;
        }

        return shiftRotaEntry;
    }

    adjustShiftRotaEntry = async (shiftRotaEntry) => {
        return this.shiftRepository.updateByDate(shiftRotaEntry);
    }

    saveShiftRotaEntriesFromCsv = async (shiftData) => {
        let successCount = shiftData.length;
        let formattedShiftData = {
        }
        let agents = [];
        let hours  =[]

        for (let i = 0; i < shiftData.length; i++){
            try {
                agents = Object.keys(shiftData[i]);
                agents.shift();
                hours = Object.values(shiftData[i]);
                hours.shift();
                formattedShiftData = {
                    date: new Date(shiftData[i].date),
                    agents: agents,
                    hours: hours
                }
                await this.saveShiftRotaEntry(formattedShiftData);                
            } catch (error) {
                console.log(error)
                successCount--;
            }
            
        }

        return `${successCount} entries have been created!`
    }
}