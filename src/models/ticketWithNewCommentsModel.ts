import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface TicketComments {
  ticketId: number;
  agentId: number;
  subject: string;
  comments: Comment[];
}

export interface Comment {
  public: boolean;
  message: string;
  from: string;
  createdAt: Date;
}

const TicketsWithNewCommentsSchema = new Schema({
  ticketId: Number,
  agentId: Number,
  subject: String,
  comments: [
    {
      public: Boolean,
      message: String,
      from: String,
      createdAt: Date,
    },
  ],
});

export default mongoose.model<TicketComments & mongoose.Document>("TicketsWithNewComments", TicketsWithNewCommentsSchema);
