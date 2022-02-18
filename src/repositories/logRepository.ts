import { Repository } from "./repository";

export default class LoggerRepository extends Repository {
    searchLogs = async (textQuery) => {
        return this.model.find({
            $text: {
                $search: textQuery
            }
        })
    }
};