import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

import ticketWithNewCommentsModel, { TicketComments } from "../../../src/models/ticketWithNewCommentsModel";
import { Repository } from "../../../src/repositories/repository";
import shiftRotaModel, { ShiftRota } from "../../models/shiftRotaModel";
import ShiftRotaRepository from "../../repositories/shiftRotaRepository";
import makeZendeskRequest from "../zendesk/authenticationService";
import getAgentsService from "../zendesk/getAgentsService";
import TicketDataService from "../zendesk/ticketDataService";
import { createCard } from "./card";

export interface TeamsNotificationRequest {
  ticketId: number;
  agentName: string;
  subject: string;
  message: string;
  from: string;
}

export default class NotificationsService {
  ticketDataService: TicketDataService;
  shiftRotaRepository: ShiftRotaRepository;
  updatedTicketsRepository: Repository;
  constructor() {
    this.ticketDataService = new TicketDataService();
    this.shiftRotaRepository = new ShiftRotaRepository(shiftRotaModel);
    this.updatedTicketsRepository = new Repository(ticketWithNewCommentsModel);
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

  async storeTicketUpdatesInTheNight(tickets: TicketComments[]) {
    for (const ticket of tickets) {
      try {
        await this.updatedTicketsRepository.create(ticket);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async mergeTicketUpdatesFromTheNight(tickets: TicketComments[]): Promise<TicketComments[]> {
    let nightTimeTickets: TicketComments[];

    try {
      nightTimeTickets = await this.updatedTicketsRepository.find({});
    } catch (error) {
      console.log(error);
    }

    const mergedTickets = [...tickets, ...nightTimeTickets];
    return mergedTickets;
  }

  async removeNightTimeTicketUpdatesFromDB() {
    try {
      await this.updatedTicketsRepository.deleteMany({});
    } catch (error) {
      console.log(error);
    }
  }

  async unavailableAgentsTicketNotifications(request: { minutesInThePast: number; currentDateUTC: Dayjs }) {
    const { minutesInThePast, currentDateUTC } = request;
    const currentHourInPoland = currentDateUTC.tz("Europe/Warsaw").hour();

    const todayShift = await this.shiftRotaRepository.getShiftForToday();
    const agents: any[] = await getAgentsService(makeZendeskRequest);
    let ticketsWithNewComments = await this.ticketDataService.getTicketsWithNewComments({
      minutesInThePast,
      currentDateUTC,
    });

    if (currentHourInPoland >= 0 && currentHourInPoland < 8) {
      return await this.storeTicketUpdatesInTheNight(ticketsWithNewComments);
    }

    if (currentHourInPoland === 8) {
      ticketsWithNewComments = await this.mergeTicketUpdatesFromTheNight(ticketsWithNewComments);
      await this.removeNightTimeTicketUpdatesFromDB();
    }

    for (const ticketWithNewComments of ticketsWithNewComments) {
      const assignedAgent = agents.filter((agent) => agent.id === ticketWithNewComments.agentId);
      const assignedAgentName = assignedAgent[0].name;
      const agentIndexInShift = todayShift.agents.indexOf(assignedAgentName);
      const workHours = todayShift.workHours[agentIndexInShift];

      for (const comment of ticketWithNewComments.comments) {
        if (this.shouldSendNotification({ workHours, comment, todayShift })) {
          await this.sendTeamsNotification({
            ticketId: ticketWithNewComments.ticketId,
            agentName: assignedAgentName,
            subject: ticketWithNewComments.subject,
            message: comment.message,
            from: comment.from,
          });
        }
      }
    }
  }

  shouldSendNotification(request: { workHours: string; comment: any; todayShift: ShiftRota }): boolean {
    const { workHours, comment, todayShift } = request;
    if (!workHours) {
      return false;
    }

    const [workStartHour, workEndHour] = workHours.split("-");
    const commentCreationHour = dayjs(comment.createdAt).hour();

    if (!(commentCreationHour < Number(workStartHour) || commentCreationHour > Number(workEndHour))) {
      return false;
    }

    if (comment.public && todayShift.agents.indexOf(comment.from) === -1) {
      if (commentCreationHour >= 0 && commentCreationHour < 8 && Number(workStartHour) < 14) {
        return false;
      }

      return true;
    }

    return false;
  }
}
