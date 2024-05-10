export interface TicketComments {
  ticketId: number;
  agentId: number;
  subject: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  public: boolean;
  message: string;
  from: string | undefined;
  createdAt: Date;
}

export interface NotificationLog {
  currentDateUTC: string;
  lastTicketUpdatesCheck: null | string;
  tickets: any[];
  comments: any[];
}
