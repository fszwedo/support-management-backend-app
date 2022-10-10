import { Repository } from "./repository";
import * as dateFNS from 'date-fns';
import * as mongoose from 'mongoose';

export default class ShiftRotaRepository extends Repository {
    async getShiftForToday() {  
        return this.model.findOne({
            date: new Date().toISOString().substring(2).split('T')[0]
        })
    }

    //day should be in standard js date format!
     getShiftsForSpecifiedDay = async (day: String) => { 
        return this.model.findOne({
            date: day
        })
    }

    async getShiftsForCurrentMonthOnwards(day: String) { 
        const date = day.slice(0, -2) + '01';
        
        return this.model.find({
            date: date
        })
    }

    //day should be in standard js date format!
    async getShiftsForDateScope(dayFrom: String, dayTo: String) { 
        if(dayFrom > dayTo) throw 'Day From larger than day To';
        return this.model.find({
           date: {  $gte: dayFrom, $lte: dayTo }}

        )
    }

    async updateByDate(shiftData) {      
        return this.model.updateOne({
            date: shiftData.date
        }, shiftData);
    }
};