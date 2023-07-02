import timeTrackingEventModel from "../models/timeTrackingEventModel";
import TimeTrackingEventRepository from "../repositories/timeTrackingEventRepository";
import { TimeTrackingEvent } from "../models/timeTrackingEventModel";

export default class TimeTrackingEventService {
    private timeTrackingEventRepository: TimeTrackingEventRepository;

    constructor(timeTrackingEventRepository: TimeTrackingEventRepository) {
        this.timeTrackingEventRepository = timeTrackingEventRepository;
    }

    getNewestTimeTrackingEvent = async () => {
        return this.timeTrackingEventRepository.getLast();
    }

    getAllTimeTrackingEvents = async () => {
        return this.timeTrackingEventRepository.getAll();
    }

    getTimeTrackingEvents = async (startDate: Date, endDate: Date) => {
        return this.timeTrackingEventRepository.find({
            created_at: { $gte: startDate, $lte: endDate }
        });
    }

    saveTimeTrackingEvents = async (timeTrackingEvents: TimeTrackingEvent[]) => {
        const results = await Promise.allSettled(timeTrackingEvents.map(async (event) => {
            await this.timeTrackingEventRepository.create(event);
        }));
        return {
            success: results.filter(result => result.status === 'fulfilled'),
            failure: results.filter(result => result.status === 'rejected')
        }
    };
}