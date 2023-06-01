import timeTrackingEventModel from "../models/timeTrackingEventModel";
import TimeTrackingEventRepository from "../repositories/timeTrackingEventRepository";
import { TimeTrackingEvent } from "../models/timeTrackingEventModel";

export default class TimeTrackingEventService {
    private timeTrackingEventRepository: TimeTrackingEventRepository;

    constructor(timeTrackingEventRepository: TimeTrackingEventRepository){
        this.timeTrackingEventRepository = timeTrackingEventRepository;
    }

    getNewestTimeTrackingEvent = async () => { 
        return this.timeTrackingEventRepository.getLast();         
    }

    getAllTimeTrackingEvents = async () => { 
        return;
    }
    
    getTimeTrackingEvents =  async (startDate, endDate) => {
        return;
    }

    saveTimeTrackingEvents = async (timeTrackingEvents: TimeTrackingEvent[]) => { 
        timeTrackingEvents.forEach(ev => {
            this.timeTrackingEventRepository.create(ev);
        })
        return ;
    }

}