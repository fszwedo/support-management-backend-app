import mongoose from 'mongoose';

export interface TimeTrackingEvent {
    _id?: mongoose.ObjectId,
    created_at: Date,
    zendeskEventId: Number,
    zendeskAuditLogId: Number,
    userId: Number,
    userName: string
    ticketId: Number
    timeSpent: Number,
    totalTimeSpent: Number,
}

const Schema = mongoose.Schema;

const TimeTrackingEventSchema = new Schema({
    created_at: { type: Date, required: true },
    zendeskEventId: { type: Number, required: true },
    zendeskAuditLogId: { type: Number, required: true },
    userId: { type: Number, required: true },
    userName: { type: String, required: true },
    ticketId: { type: Number, required: true },
    timeSpent: { type: Number, required: true },
    totalTimeSpent: { type: Number, required: true },
})

export default mongoose.model<TimeTrackingEvent & mongoose.Document>('TimeTrackingEvent', TimeTrackingEventSchema);
export { TimeTrackingEventSchema };