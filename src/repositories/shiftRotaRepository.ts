import { Repository } from "./repository";
import * as dateFNS from 'date-fns';
import * as mongoose from 'mongoose';

export default class ShiftRotaRepository extends Repository {
    async getShiftForToday() {      
        return this.model.findOne({
            date: {
                $gte: dateFNS.startOfDay(new Date()),
                $lte: dateFNS.endOfDay(new Date())
            }
        })
    }

    //day should be in standard js date format!
     getShiftsForSpecifiedDay = async (day: Date) => {      
        return this.model.findOne({
            date: {
                $gte: dateFNS.startOfDay(day),
                $lte: dateFNS.endOfDay(day)
            }
        })
    }

    //day should be in standard js date format!
    async getShiftsForCurrentMonthOnwards(day: Date) {      
        return this.model.find({
            date: {
                $gte: dateFNS.startOfMonth(day),
            }
        })
    }

    async updateByDate(shiftData) {
        shiftData.date = new Date(shiftData.date)

        return this.model.updateOne({
            date: {
                $gte: dateFNS.startOfDay(shiftData.date),
                $lte: dateFNS.endOfDay(shiftData.date)
            }
        }, shiftData);
    }
};