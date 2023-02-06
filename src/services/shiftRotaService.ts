import shiftRotaModel from "../models/shiftRotaModel";
import ShiftRotaRepository from "../repositories/shiftRotaRepository";
import { ShiftRota } from "../models/shiftRotaModel";

export default class ShiftRotaService {
    private shiftRepository: ShiftRotaRepository;

    constructor(shiftRepository){
        this.shiftRepository = shiftRepository;
    }

    getAllShifts = async () => { 
        return this.shiftRepository.getAll();
    }
    
    getTodayShifts =  async (): Promise<ShiftRota> => {
        return this.shiftRepository.getShiftForToday();
    }

    getShiftsForSpecifiedDay = async (day: string) => {
        return this.shiftRepository.getShiftsForSpecifiedDay(day);
    }

    getShiftsFromCurrentMonthOnwards = async (day: string) => {
        return this.shiftRepository.getShiftsForCurrentMonthOnwards(day);
    }

    saveShiftRotaEntry = async (shiftRotaEntry: ShiftRota) => {
        const newShiftRota = new shiftRotaModel(shiftRotaEntry);
        
        try {
        await newShiftRota.validate();
           const checkIfThisShiftExists = await this.shiftRepository.getShiftsForSpecifiedDay(shiftRotaEntry.date)
                       
           if (checkIfThisShiftExists) {
               await this.shiftRepository.updateByDate(shiftRotaEntry);
               console.log(`Updating entry for ${shiftRotaEntry.date}...`)               
           }
           else {
               await this.shiftRepository.create(shiftRotaEntry);
               console.log(`Creating entry for ${shiftRotaEntry.date}...`)
            }
        }
        catch (ex) {
            console.log(ex.message)
            throw ex.message;
        }

        return shiftRotaEntry;
    }

    saveShiftRotaEntriesFromCsv = async (shiftData: ShiftRota[]) => {
        
        let successCount = shiftData.length;
        let formattedShiftData: ShiftRota;
        let agents: string[];
        let hours: string[];
        for (let i = 0; i < shiftData.length; i++){
            try {
                agents = Object.keys(shiftData[i]);
                agents.shift();
                hours = Object.values(shiftData[i]);
                hours.shift();
                formattedShiftData = {
                    date: shiftData[i].date,
                    agents: agents,
                    hours: hours
                }
                await this.saveShiftRotaEntry(formattedShiftData);                
            } catch (error) {
                console.log(error)                
                successCount--;
            }            
        }
        
        console.log(`${successCount} entries have been created/updated!`)
        if (successCount != shiftData.length) console.log(`${shiftData.length - successCount} error/s occured during the process! Check your data sheet.`)
        return;
    }
}