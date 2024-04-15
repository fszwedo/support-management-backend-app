import dayjs, { Dayjs } from "dayjs";
import { TicketComments } from "src/models/ticketWithNewCommentsModel";
import makeZendeskRequest from "./authenticationService";

export default class TicketDataService {
  constructor() {}
  async getOpenTickets() {
    const openTickets = await makeZendeskRequest("/api/v2/search.json?query=status:open", "GET");
    return openTickets.results;
  }

  async getTicketComments(ticketId: string) {
    const ticketComments = await makeZendeskRequest(`/api/v2/tickets/${ticketId}/comments`, "GET");
    return ticketComments.comments;
  }

  async getTicketsWithNewComments(request: { minutesInThePast: number; currentDateUTC: Dayjs }): Promise<TicketComments[]> {
    const { minutesInThePast, currentDateUTC } = request;

    const openTickets = await this.getOpenTickets();
    const updatedTickets = [];

    for (const openTicket of openTickets) {
      // updated_at, created_at is UTC https://support.zendesk.com/hc/en-us/articles/4408821092762-Which-time-zone-does-Zendesk-use
      const updatedAt = dayjs(openTicket.updated_at);
      const differenceInMinutes = currentDateUTC.diff(updatedAt, "minutes");
      if (differenceInMinutes <= minutesInThePast) {
        const ticketComments = await this.getTicketComments(openTicket.id);
        const newTicketComments = [];

        for (const ticketComment of ticketComments) {
          const createdAt = dayjs(ticketComment.created_at);
          const differenceInMinutes = currentDateUTC.diff(createdAt, "minutes");

          if (differenceInMinutes <= minutesInThePast) {
            newTicketComments.push({
              public: ticketComment.public,
              message: ticketComment.body,
              from: ticketComment.via.source.from.name,
              createdAt: createdAt.toDate(),
            });
          }
        }

        updatedTickets.push({
          ticketId: openTicket.id,
          agentId: openTicket.assignee_id,
          subject: openTicket.subject,
          comments: newTicketComments,
        });
      }
    }

    return updatedTickets;
  }
}
