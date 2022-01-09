import shiftRotaModel from "../models/shiftRotaModel.js";
import { Repository } from "./repository.js";
import * as dateFNS from 'date-fns';

export default class shiftRotaRepository extends Repository {
    async getShiftForToday() {      
        return this.model.find({
            date: {
                $gte: dateFNS.startOfDay(new Date()),
                $lte: dateFNS.endOfDay(new Date())
            }
        })
    }

    //day should be in standard js date format!
    async getShiftsForSpecifiedDay(day) {      
        return this.model.find({
            date: {
                $gte: dateFNS.startOfDay(day),
                $lte: dateFNS.endOfDay(day)
            }
        })
    }

    //day should be in standard js date format!
    async getShiftsForCurrentMonthOnwards(day) {      
        return this.model.find({
            date: {
                $gte: dateFNS.startOfMonth(day),
            }
        })
    }

    async updateByDate(shiftData) {
        const date = new Date(shiftData.date)
        return this.model.updateOne({
            date: {
                $gte: dateFNS.startOfDay(date),
                $lte: dateFNS.endOfDay(date)
            }
        }, shiftData);
    }
};