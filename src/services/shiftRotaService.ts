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

    saveShiftRotaEntriesFromCsv = async (shiftData: ShiftRota[],offset:number) => {
        shiftData = passHoursToUTCTimeConversion(shiftData,offset)
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

//to convert shift data hours to UTC using UTCTimeConversion function
let passHoursToUTCTimeConversion = (shiftData: ShiftRota[], offset: number) => {
    for (let i = 0; i < shiftData.length; i++) {
      for (const key in shiftData[i]) {
        //for date and for empty times like "" as they are not needed to be converted
        if (key === "date" || shiftData[i][key] === "") continue;
  
        let subTimes = shiftData[i][key].split(";");
        let convertedSubTimes: string[] = [];
  
        subTimes.forEach((time:string) => {
          let [startTimeLocal, endTimeLocal]: string[] = time.split("-");
          let convertedTime = UTCTimeConversion(startTimeLocal, endTimeLocal, offset);
          convertedSubTimes.push(convertedTime);
        });

        shiftData[i][key] = convertedSubTimes.join(";");
      }
    }
    return shiftData;
  };


//UTC time conversion
const UTCTimeConversion = (startTimeLocal: string, endTimeLocal: string,offset:number) => {
    //function that takes time in minutes and returns time in hours and minutes format
    function convertMinsToHrsMins(a: number) {
      let hours = Math.trunc(a / 60);
      let minutes = a % 60;
      //If offset is full hours then result 8-16, if not 8:15-16:15
      if (minutes > 0) return hours + ":" + minutes;
      else return hours;
    }
  
    //function to convert start and end times to UTC
    const convertLocalTimeToUTC = (timeLocal: string) => {
        let timeLocalMinutes: number;
        if (timeLocal.length > 2)
          timeLocalMinutes = Number(timeLocal.split(":")[0]) * 60 + Number(timeLocal.split(":")[1]);
        else timeLocalMinutes = +timeLocal * 60;
      
        let timeLocalUTCMinutes = timeLocalMinutes + offset;
        return convertMinsToHrsMins(timeLocalUTCMinutes);
      }
  
      let startTimeUTC = convertLocalTimeToUTC(startTimeLocal);
      let endTimeUTC = convertLocalTimeToUTC(endTimeLocal);
  
    return `${startTimeUTC}-${endTimeUTC}`;
  };
  