import mongoose from "mongoose";

export interface LastTicketUpdatesCheck {
  _id?: mongoose.ObjectId;
  utcDateString: string;
}

const Schema = mongoose.Schema;

const LastTicketUpdatesCheckSchema = new Schema({
  utcDateString: { type: String, required: true },
});

export default mongoose.model<LastTicketUpdatesCheck & mongoose.Document>("LastTicketUpdatesCheck", LastTicketUpdatesCheckSchema);
export { LastTicketUpdatesCheckSchema };
