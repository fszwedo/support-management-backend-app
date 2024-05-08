import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

import lastTicketUpdatesCheckModel from "../../../src/models/lastTicketUpdatesCheckModel";
import ticketWithNewCommentsModel from "../../../src/models/ticketWithNewCommentsModel";
import {
  default as LastTicketUpdatesCheck,
  default as lastTicketUpdatesCheckRepository,
} from "../../../src/repositories/lastTicketUpdatesCheckRepository";
import { Repository } from "../../../src/repositories/repository";
import shiftRotaModel, { ShiftRota } from "../../models/shiftRotaModel";
import ShiftRotaRepository from "../../repositories/shiftRotaRepository";
import ShiftRotaService from "../shiftRotaService";
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
  agentToBeNotified: string;
}

export default class NotificationsService {
  ticketDataService: TicketDataService;
  shiftRotaRepository: ShiftRotaRepository;
  updatedTicketsRepository: Repository;
  shiftRotaService: ShiftRotaService;
  lastTicketUpdatesCheckRepository: LastTicketUpdatesCheck;
  constructor() {
    this.ticketDataService = new TicketDataService();
    this.shiftRotaRepository = new ShiftRotaRepository(shiftRotaModel);
    this.updatedTicketsRepository = new Repository(ticketWithNewCommentsModel);
    this.shiftRotaService = new ShiftRotaService(this.shiftRotaRepository);
    this.lastTicketUpdatesCheckRepository = new lastTicketUpdatesCheckRepository(lastTicketUpdatesCheckModel);
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

  async unavailableAgentsTicketNotifications(request: { currentDateUTC: Dayjs }) {
    const { currentDateUTC } = request;

    let lastTicketUpdatesCheck = await this.lastTicketUpdatesCheckRepository.getLastTicketUpdatesCheck();
    await this.lastTicketUpdatesCheckRepository.storeTicketUpdatesCheckDate();

    if (!lastTicketUpdatesCheck) {
      lastTicketUpdatesCheck = await this.lastTicketUpdatesCheckRepository.getLastTicketUpdatesCheck();
    }

    const millisecondsInThePast = currentDateUTC.diff(lastTicketUpdatesCheck, "milliseconds");
    const todayShift = await this.shiftRotaRepository.getShiftForToday();
    const agents: any[] = await getAgentsService(makeZendeskRequest);

    let ticketsWithNewComments = await this.ticketDataService.getTicketsWithNewComments({
      millisecondsInThePast,
      currentDateUTC,
    });

    for (const ticketWithNewComments of ticketsWithNewComments) {
      const assignedAgent = agents.filter((agent) => agent.id === ticketWithNewComments.agentId);
      const assignedAgentName = assignedAgent[0].name;
      const agentIndexInShift = todayShift.agents.indexOf(assignedAgentName);
      const workHours = todayShift.workHours[agentIndexInShift];

      for (const comment of ticketWithNewComments.comments) {
        if (this.shouldSendNotification({ workHours, comment, todayShift })) {
          const agentToBeNotified = this.getAgentToBeNotified(todayShift, currentDateUTC, assignedAgentName);
          await this.sendTeamsNotification({
            ticketId: ticketWithNewComments.ticketId,
            agentName: assignedAgentName,
            subject: ticketWithNewComments.subject,
            message: comment.message,
            from: comment.from,
            agentToBeNotified,
          });
        }
      }
    }
  }

  getAgentToBeNotified(todayShift: ShiftRota, currentDateUTC: Dayjs, assignedAgentName: string): string {
    const currentHour = currentDateUTC.hour();
    const assignedAgentTeam = this.shiftRotaService.getAgentTeam(assignedAgentName);
    let workingAgents: { agentName: string; isOverwatch: boolean }[] = [];

    todayShift.workHours.forEach((workHours: string, index: number) => {
      if (workHours) {
        const [workStartHour, workEndHour] = workHours.split("-");
        if (Number(workStartHour) <= currentHour && Number(workEndHour) >= currentHour) {
          const agentName = todayShift.agents[index];
          const isOverwatch = todayShift.overwatchAssignments[index];
          workingAgents.push({
            agentName,
            isOverwatch,
          });
        }
      }
    });

    const availableAgentsInAssigneesTeam = workingAgents.filter((agent) => this.shiftRotaService.getAgentTeam(agent.agentName) === assignedAgentTeam);
    const availableOverwatchers = availableAgentsInAssigneesTeam.filter((agent) => agent.isOverwatch);

    if (availableOverwatchers.length > 0) {
      return availableOverwatchers[0].agentName;
    }
    
    const randomWorkingAgentFromTheTeam = availableAgentsInAssigneesTeam[Math.floor(Math.random() * availableAgentsInAssigneesTeam.length)];

    if (randomWorkingAgentFromTheTeam) {
      return randomWorkingAgentFromTheTeam.agentName;
    }

    return "Phil";
  }

  shouldSendNotification(request: { workHours: string; comment: any; todayShift: ShiftRota }): boolean {
    const { workHours, comment, todayShift } = request;

    // If comment comes from agent then comment.from equals undefined
    if (!comment.from) {
      return false;
    }

    if (!workHours) {
      return true;
    }

    const [workStartHour, workEndHour] = workHours.split("-");
    const commentCreationHour = dayjs(comment.createdAt).utc().hour();

    if (!(commentCreationHour < Number(workStartHour) || commentCreationHour > Number(workEndHour))) {
      return false;
    }

    if (comment.public) {
      if (commentCreationHour >= 0 && commentCreationHour < 8 && Number(workStartHour) < 14) {
        return false;
      }

      return true;
    }

    return false;
  }
}
