import { Repository } from "./repository.js";

export default class loggerRepository extends Repository {
    searchLogs = async (textQuery) => {
        return this.model.find({
            $text: {
                $search: textQuery
            }
        })
    }
};