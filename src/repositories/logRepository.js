import logModel from '../models/logModel.js'
import { Repository } from "./repository.js";
import * as dateFNS from 'date-fns';

export default class loggerRepository extends Repository {
    searchLogs = async (textQuery) => {
        return this.model.find({
            $text: {
                $search: textQuery
            }
        })
    }
};