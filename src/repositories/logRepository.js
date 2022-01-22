import { Repository } from "./repository.js";

export default class LoggerRepository extends Repository {
    searchLogs = async (textQuery) => {
        return this.model.find({
            $text: {
                $search: textQuery
            }
        })
    }
};