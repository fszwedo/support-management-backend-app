import shiftRotaModel from "../models/shiftRotaModel.js";
import { Repository } from "./repository.js";

export default class shiftRotaRepository extends Repository {
    async getShiftForToday() {          
        const today = new Date(new Date().setHours(0,0,0,0));
        console.log(today)
        return this.model.find({
        })
    }
};