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
               console.log(`Updating entry for ${shiftRotaEntry.date}...`)
               this.shiftRepository.updateByDate(shiftRotaEntry);
           }
           else {
               this.shiftRepository.create(shiftRotaEntry);
               console.log(`Creating entry for ${shiftRotaEntry.date}...`)
            }
        }
        catch (ex) {
            console.log(ex.message)
            throw ex.message;
        }

        return shiftRotaEntry;
    }

    saveShiftRotaEntriesFromCsv = async (shiftData: ShiftRota[], minutesOffsetFromUTC) => {
        //offset here should be passed as a result of getTimezoneOffset() function of the user
        const hoursOffsetFromUTC = minutesOffsetFromUTC / 60;
        
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
                //here we apply the offset from UTC to keep the data in UTC in the DB
                const UTCHours = hours.map(el => {
                    let splittedHours = el.split('-'); 
                    const mappedArray = splittedHours.map(hour => {
                        if (hour !== '')  return hour = (parseInt(hour) + hoursOffsetFromUTC).toString();
                    }); 
                    return mappedArray.join('-')
                })
                formattedShiftData = {
                    date: shiftData[i].date,
                    agents: agents,
                    hours: UTCHours
                }
                //await this.saveShiftRotaEntry(formattedShiftData);                
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