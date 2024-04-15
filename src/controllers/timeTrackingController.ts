import * as express from 'express';
import getTicketAuditLogs from '../services/zendesk/getTicketAuditLogs';
import getAgents from '../services/zendesk/getAgentsService';
import zendeskRequest from "../services/zendesk/authenticationService";
import TimeTrackingEventService from '../services/timeTrackingService';
import { TimeTrackingEvent } from '../models/timeTrackingEventModel';
import { TICKET_CUSTOM_FIELDS } from '../CONSTANTS';
import { convertToCSV } from '../services/readWriteCsv';

export default class TimeTrackingController {
    private timeTrackingEventService;
    private getAuditLogs;
    private getAgents;

    constructor(timeTrackingEventService: TimeTrackingEventService, getAuditLogService: typeof getTicketAuditLogs, getAgentsService: typeof getAgents) {
        this.timeTrackingEventService = timeTrackingEventService
        this.getAuditLogs = getAuditLogService;
        this.getAgents = getAgentsService;
    }

    saveNewTimeTrackingEvents = async (eventSearchStartDate?: Date) => {
        //get all users - to match time tracking submission with user
        const agents = await this.getAgents(zendeskRequest);

        //get newest tracking event from Mongo
        const lastTimeTrackingEvent = await this.timeTrackingEventService.getNewestTimeTrackingEvent();

        //get the newest audit logs - with search date if it was passed to saveNewTimeTrackingEvents (so we can backfill older tickets in case of app failure)
        const auditLogs = await this.getAuditLogs(eventSearchStartDate);

        //filter audit logs to get the ones from the newest tracking event from mongo (or all events, if theres no data in mongo)
        //we filter IF theres at least one event in db AND we dont have eventSearchStartDate (as otherwise we want to resave everything that's possible)
        const newAuditLogs = lastTimeTrackingEvent && !eventSearchStartDate ? auditLogs.filter(log => new Date(log.created_at) > new Date(lastTimeTrackingEvent.created_at)) : auditLogs;

        //for each audit log - get events that are related to time tracking
        const timeTrackingEventsToSave: TimeTrackingEvent[] = [];
        if (newAuditLogs.length > 0) {
            newAuditLogs.forEach(log => {
                const timeSpentEvent = log.events.find(ev => ev.field_name == TICKET_CUSTOM_FIELDS.TIME_SPENT.toString());
                const totalTimeSpentEvent = log.events.find(ev => ev.field_name == TICKET_CUSTOM_FIELDS.TOTAL_TIME_SPENT.toString())

                if (timeSpentEvent && totalTimeSpentEvent) {
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
            let savedEvents;
            try {
                savedEvents = await this.timeTrackingEventService.saveTimeTrackingEvents(timeTrackingEventsToSave);
                if (timeTrackingEventsToSave.length > 0)
                    return {
                        lastEventDate: timeTrackingEventsToSave.at(-1).created_at,
                        numberOfNewEventsSaved: savedEvents.success.length
                    };
            } catch (error) {
                console.log(error)
            }
        }
        return "No data to be saved!"
    }

    refreshTimeTrackingSince = async (
        req: express.Request,
        res: express.Response
    ) => {
        try {
            const response = await this.saveNewTimeTrackingEvents(new Date(req.query.fromDate.toString()));
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ message: 'There was an error during time tracking data refresh!' });
        }
    }

    getTimeTrackingEvents = async (
        req: express.Request,
        res: express.Response
    ) => {
        let trackingEvents = [];
        try {
            if (req.body.startDate && req.body.endDate) trackingEvents = await this.timeTrackingEventService.getTimeTrackingEvents(new Date(req.body.startDate), new Date(req.body.endDate));
            else trackingEvents = await this.timeTrackingEventService.getAllTimeTrackingEvents();
            res.status(200).json(trackingEvents)
        } catch (error) {
            res.status(400).json({ message: 'There was an error during time tracking export!' });
        }
    }

    downloadTimeTrackingEvents = async (
        req: express.Request,
        res: express.Response
    ) => {
        let trackingEvents = [];
        try {
            if (req.body.startDate && req.body.endDate) trackingEvents = await this.timeTrackingEventService.getTimeTrackingEvents(new Date(req.body.startDate), new Date(req.body.endDate));
            else trackingEvents = await this.timeTrackingEventService.getAllTimeTrackingEvents();
            const csv = await convertToCSV(trackingEvents, ['created_at', 'userName', 'ticketId', 'timeSpent', 'totalTimeSpent']);
            res
                .set({
                    "Content-Type": "text/csv",
                    "Content-Disposition": `attachment; filename="timeTracking.csv"`,
                })
                .send(csv);
            return;
        } catch (error) {
            res.status(400).json({ message: 'There was an error during time tracking download!' });
        }
    }
}