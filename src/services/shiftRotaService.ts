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
                //console.log(formattedShiftData)
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
let passHoursToUTCTimeConversion = (shiftData:ShiftRota[],offset:number) =>{
    for (let i = 0; i < shiftData.length; i++) {
        for (const key in shiftData[i]) {
          if (key === "date") continue;
    
          let time = shiftData[i][key];
    
          //for empty times like ""
          if (time === "") continue;
          //for times like "9-13;15-16"
          else if (time.split("").includes(";")) {
            let subTimes = time.split(";");
            let convertedSubTimes: string[] = [];
            subTimes.forEach((time) => {
              let [startTimeLocal, endTimeLocal]: string[] = time.split("-");
              let convertedTime = UTCTimeConversion(startTimeLocal, endTimeLocal,offset);
              convertedSubTimes.push(convertedTime);
            });
    
            shiftData[i][key] = convertedSubTimes.join(";");
          }
          //for times like "9-17"
          else {
            let [startTimeLocal, endTimeLocal]: string[] = time.split("-");
            let convertedTime = UTCTimeConversion(startTimeLocal, endTimeLocal,offset);
    
            shiftData[i][key] = convertedTime;
          }
        }
      }
      return shiftData
}


//UTC time conversion
const UTCTimeConversion = (startTimeLocal: string, endTimeLocal: string,offset:number) => {
    function convertMinsToHrsMins(a: number) {
      let hours = Math.trunc(a / 60);
      let minutes = a % 60;
      //If offset is full hours then result 8-16, if not 8:15-16:15
      if (minutes > 0) return hours + ":" + minutes;
      else return hours;
    }
  
    // //Calculating offset(time diff bw local and UTC time)
    // let offset: number = new Date().getTimezoneOffset();
  
    //Converting start time to UTC
    let startTimeLocalMinutes: number;
    if (startTimeLocal.length > 2)
      startTimeLocalMinutes =
        Number(startTimeLocal.split(":")[0]) * 60 +
        Number(startTimeLocal.split(":")[1]);
    else startTimeLocalMinutes = +startTimeLocal * 60;
  
    let startTimeLocalUTCMinutes: number = startTimeLocalMinutes + offset;
    let startTimeUTC = convertMinsToHrsMins(startTimeLocalUTCMinutes);
  
    //Converting end time to UTC
    let endTimeLocalMinutes: number;
    if (endTimeLocal.length > 2)
      endTimeLocalMinutes =
        Number(endTimeLocal.split(":")[0]) * 60 +
        Number(endTimeLocal.split(":")[1]);
    else endTimeLocalMinutes = +endTimeLocal * 60;
  
    let endTimeLocalUTCMinutes: number = endTimeLocalMinutes + offset;
    let endTimeUTC = convertMinsToHrsMins(endTimeLocalUTCMinutes);
  
    return `${startTimeUTC}-${endTimeUTC}`;
  };
  