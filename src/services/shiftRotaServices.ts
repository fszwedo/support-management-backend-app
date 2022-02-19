import shiftRotaModel from "../models/shiftRotaModel";
import ShiftRotaRepository from "../repositories/shiftRotaRepository";
import { ShiftRota } from "../models/shiftRotaModel";

export default class shiftRotaService {
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
        return this.shiftRepository.getShiftsForSpecifiedDay(new Date(day));
    }

    getShiftsFromCurrentMonthOnwards = async (day: string) => {
        return this.shiftRepository.getShiftsForCurrentMonthOnwards(new Date(day));
    }

    saveShiftRotaEntry = async (shiftRotaEntry: ShiftRota) => {
        shiftRotaEntry.date = new Date(shiftRotaEntry.date); 
        const newShiftRota = new shiftRotaModel(shiftRotaEntry);
        
        try {
        await newShiftRota.validate();
           const checkIfThisShiftExists = await this.shiftRepository.getShiftsForSpecifiedDay(shiftRotaEntry.date)
                       
           if (checkIfThisShiftExists) {
               console.log(`Updating entry for ${shiftRotaEntry.date.toLocaleDateString('en-US')}...`)
               this.shiftRepository.updateByDate(shiftRotaEntry);
           }
           else {
               this.shiftRepository.create(shiftRotaEntry);
               console.log(`Creating entry for ${shiftRotaEntry.date.toLocaleDateString('en-US')}...`)
            }
        }
        catch (ex) {
            console.log(ex.message)
            return ex.message;
        }

        return shiftRotaEntry;
    }

    adjustShiftRotaEntry = async (shiftRotaEntry: ShiftRota) => {
        return this.shiftRepository.updateByDate(shiftRotaEntry);
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

        return `${successCount} entries have been created!`
    }
}