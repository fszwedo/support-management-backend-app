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
};