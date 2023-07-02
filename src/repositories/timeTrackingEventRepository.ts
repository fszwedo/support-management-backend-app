import { Repository } from './repository';

export default class TimeTrackingEventRepository extends Repository { 
    async getLast() {
        return this.model.findOne({}, {}, {sort: { 'created_at': -1 }})
    }
};