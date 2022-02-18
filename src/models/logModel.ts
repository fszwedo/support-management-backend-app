import mongoose from 'mongoose';

export interface Log {
    timestamp?: String,
    type: String,
    message: String,
    additionalInfo?: String,
    origin?: String
}

const LogSchema = new mongoose.Schema({
    timestamp: { type: String, required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    additionalInfo: { type: String },
    origin: { type: String }
}) 

LogSchema.index({
    type: 'text',
    message: 'text',
    origin: 'text',
    additionalInfo: 'text'
})

export default mongoose.model<Log & mongoose.Document>('Log', LogSchema);