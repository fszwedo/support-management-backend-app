import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

import lastTicketUpdatesCheckModel from "../../../src/models/lastTicketUpdatesCheckModel";
import logModel from "../../../src/models/logModel";
import lastTicketUpdatesCheckRepository, {
  default as LastTicketUpdatesCheck,
} from "../../../src/repositories/lastTicketUpdatesCheckRepository";
import LoggerRepository from "../../../src/repositories/logRepository";
import shiftRotaModel, { ShiftRota } from "../../models/shiftRotaModel";
import ShiftRotaRepository from "../../repositories/shiftRotaRepository";
import LoggerService from "../loggerService";
import ShiftRotaService from "../shiftRotaService";
import makeZendeskRequest from "../zendesk/authenticationService";
import getAgentsService from "../zendesk/getAgentsService";
import TicketDataService from "../zendesk/ticketDataService";
import { createCard } from "./card";
import { Comment, NotificationLog, TicketComments } from "./INotificationsService";

export interface TeamsNotificationRequest {
  ticketId: number;
  agentName: string;
  subject: string;
  message: string;
  from: string;
  agentToBeNotified: string;
}

export default class NotificationsService {
  ticketDataService: TicketDataService;
  shiftRotaRepository: ShiftRotaRepository;
  shiftRotaService: ShiftRotaService;
  lastTicketUpdatesCheckRepository: LastTicketUpdatesCheck;
  loggerService: LoggerService;
  constructor() {
    this.ticketDataService = new TicketDataService();
    this.shiftRotaRepository = new ShiftRotaRepository(shiftRotaModel);
    this.shiftRotaService = new ShiftRotaService(this.shiftRotaRepository);
    this.lastTicketUpdatesCheckRepository = new lastTicketUpdatesCheckRepository(lastTicketUpdatesCheckModel);
    this.loggerService = new LoggerService(new LoggerRepository(logModel));
  }

  async sendTeamsNotification(request: TeamsNotificationRequest) {
    const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
    const card = createCard(request);

    if (!webhookUrl) {
      console.log("TEAMS_WEBHOOK_URL is not present. Notifications to Teams will not be sent.");
    }

    try {
      await axios.post(webhookUrl, card);
    } catch (error) {
      console.log(error);
    }
  }

  async unavailableAgentsTicketNotifications(currentDateUTC: Dayjs) {
    const log = this.initializeLog(currentDateUTC);

    let lastTicketUpdatesCheck = await this.lastTicketUpdatesCheckRepository.getLastTicketUpdatesCheck();
    await this.lastTicketUpdatesCheckRepository.storeTicketUpdatesCheckDate();

    if (!lastTicketUpdatesCheck) {
      lastTicketUpdatesCheck = await this.lastTicketUpdatesCheckRepository.getLastTicketUpdatesCheck();
    }

    const minutesPastLastCheck = currentDateUTC.diff(lastTicketUpdatesCheck, "minute", true);
    log.lastTicketUpdatesCheck = lastTicketUpdatesCheck.toISOString();

    const todayShift = await this.shiftRotaRepository.getShiftForToday();
    const agents: any[] = await getAgentsService(makeZendeskRequest);

    let tickets = await this.ticketDataService.getTicketsWithNewComments(
      minutesPastLastCheck,
      currentDateUTC,
      lastTicketUpdatesCheck.toISOString()
    );
    await this.processTicketComments(tickets, agents, todayShift, currentDateUTC, log);

    this.loggerService.saveLog({
      type: "info",
      message: JSON.stringify(log),
    });
  }

  async processTicketComments(tickets: TicketComments[], agents: any[], todayShift: ShiftRota, currentDateUTC: Dayjs, log: any) {
    for (const ticket of tickets) {
      log.tickets.push(ticket.ticketId);
      const { assignedAgentName, workHours } = this.getTicketAgentInformation(agents, ticket, todayShift);

      for (const comment of ticket.comments) {
        const shouldSendNotification = this.shouldSendNotification(workHours, comment);

        log.comments.push(`ticket: ${ticket.ticketId} comment: ${comment.id} reason: ${shouldSendNotification.reason}`);

        if (shouldSendNotification.should) {
          const agentToBeNotified = this.getAgentToBeNotified(todayShift, currentDateUTC, assignedAgentName);

          const notificationsRequest = this.prepareNotificationRequest(ticket, assignedAgentName, comment, agentToBeNotified);
          await this.sendTeamsNotification(notificationsRequest);
        }
      }
    }
  }

  shouldSendNotification(workHours: string, comment: Comment): { should: boolean; reason: string } {
    // If comment comes from agent then comment.from equals undefined
    if (!comment.from || !workHours) {
      return {
        should: false,
        reason: !comment.from ? "comment.from equals undefined" : "agent is not working today",
      };
    }

    function anyWorkPeriodMakingNotificationObsolete(workHours: string): boolean {
      let result = false;

      const workPeriods = workHours.split(";");
      for (const workPeriod of workPeriods) {
        const [workStartHour, workEndHour] = workPeriod.split("-");
        const commentCreationHour = dayjs(comment.createdAt).utc().hour();
        const commentWithinWorkHours = !(commentCreationHour < Number(workStartHour) || commentCreationHour > Number(workEndHour));
        const nightCommentAndAgentFirstShift = commentCreationHour >= 0 && commentCreationHour < 8 && Number(workStartHour) < 12;

        if (commentWithinWorkHours || nightCommentAndAgentFirstShift) {
          result = true;
        }
      }

      return result;
    }

    if (anyWorkPeriodMakingNotificationObsolete(workHours)) {
      return {
        should: false,
        reason: "at least one of the work periods makes notification obsolete",
      };
    }

    return {
      should: true,
      reason: "all checks passed",
    };
  }

  getTicketAgentInformation(agents: any, ticketComment: TicketComments, todayShift: ShiftRota) {
    const assignedAgent = agents.filter((agent) => agent.id === ticketComment.agentId);
    const assignedAgentName = assignedAgent[0].name;
    const agentIndexInShift = todayShift.agents.indexOf(assignedAgentName);
    const workHours = todayShift.workHours[agentIndexInShift];

    return {
      assignedAgentName,
      workHours,
    };
  }

  getAgentToBeNotified(todayShift: ShiftRota, currentDateUTC: Dayjs, assignedAgentName: string): string {
    const workingTeamAgents = this.shiftRotaService.getWorkingTeamAgents(todayShift, currentDateUTC, assignedAgentName);
    const availableOverwatchers = workingTeamAgents.filter((agent) => agent.isOverwatch);

    if (availableOverwatchers.length > 0) {
      return availableOverwatchers[0].agentName;
    }

    const randomTeammate = workingTeamAgents[Math.floor(Math.random() * workingTeamAgents.length)];

    if (randomTeammate) {
      return randomTeammate.agentName;
    }

    // In case no one is available, notification should go to a team leader.
    return "Phil";
  }

  prepareNotificationRequest(ticket: TicketComments, agentName: string, comment: Comment, agentToBeNotified: string) {
    return {
      ticketId: ticket.ticketId,
      agentName,
      subject: ticket.subject,
      message: comment.message,
      from: comment.from,
      agentToBeNotified,
    };
  }

  initializeLog(currentDateUTC: Dayjs): NotificationLog {
    return {
      currentDateUTC: currentDateUTC.toISOString(),
      lastTicketUpdatesCheck: null,
      tickets: [],
      comments: [],
    };
  }
}
