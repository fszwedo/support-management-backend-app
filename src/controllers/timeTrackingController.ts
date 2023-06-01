import * as express from 'express';
import getTicketAuditLogs from '../services/zendesk/getTicketAuditLogs';
import getAgents from '../services/zendesk/getAgentsService';
import zendeskRequest from "../services/zendesk/authenticationService";
import TimeTrackingEventService from '../services/timeTrackingService';
import { TimeTrackingEvent } from '../models/timeTrackingEventModel';
import { TICKET_CUSTOM_FIELDS } from '../CONSTANTS';

export default class TimeTrackingController {
    private timeTrackingEventService;

    constructor(timeTrackingEventService: TimeTrackingEventService) {
        this.timeTrackingEventService = timeTrackingEventService
    }

    saveNewTimeTrackingEvents = async () => {
        //get all users - to match time tracking submission with user
        const agents = await getAgents(zendeskRequest);

        //get newest tracking event from Mongo
        const lastTimeTrackingEvent = await this.timeTrackingEventService.getNewestTimeTrackingEvent();
        console.log(lastTimeTrackingEvent)
        //get the newest audit logs
        const auditLogs = await getTicketAuditLogs();

        //filter audit logs to get the ones from the newest tracking event from mongo (or all events, if theres no data in mongo)
        const newAuditLogs = lastTimeTrackingEvent ? auditLogs.filter(log => new Date(log.created_at) > new Date(lastTimeTrackingEvent.created_at)) : auditLogs;

        //for each audit log - get events that are related to time tracking
        const timeTrackingEventsToSave: TimeTrackingEvent[] = [];

        newAuditLogs.forEach(log => {
            const timeSpentEvent = log.events.find(ev => ev.field_name === TICKET_CUSTOM_FIELDS.TIME_SPENT);
            const totalTimeSpentEvent =  log.events.find(ev => ev.field_name === TICKET_CUSTOM_FIELDS.TOTAL_TIME_SPENT)
            
            if(timeSpentEvent && totalTimeSpentEvent){
                const timeTrackingEvent: TimeTrackingEvent = {
                    created_at: new Date(log.created_at),
                    zendeskEventId: timeSpentEvent.id,
                    zendeskAuditLogId: log.id,
                    userId: log.author_id,
                    userName: agents.find(agent => agent.id === log.author_id).name,
                    ticketId: log.ticket_id,
                    timeSpent: parseInt(timeSpentEvent.value),
                    totalTimeSpent: parseInt(totalTimeSpentEvent.value)
                }

                timeTrackingEventsToSave.push(timeTrackingEvent);
            }
        })

        //save events in the db - if theres already an event with given eventID - skip!
        console.log(timeTrackingEventsToSave)
        this.timeTrackingEventService.saveTimeTrackingEvents(timeTrackingEventsToSave);
        return;
    }

    saveTimeTrackingEventsSince = async (date) => {
        return;
    }

    getTimeTrackingEvents = async (
        req: express.Request,
        res: express.Response
    ) => {
        return;
    }
}