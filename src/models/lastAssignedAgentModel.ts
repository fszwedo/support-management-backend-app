import mongoose from 'mongoose';

export interface LastAssignedAgent {
    _id?: mongoose.ObjectId,
    agentId: string,
    level: string
}

const Schema = mongoose.Schema;

const LastAssignedAgentSchema = new Schema({
    agentId: { type: String, required: true },
    level: { type: String, required: true }
})

export default mongoose.model<LastAssignedAgent & mongoose.Document>('LastAssignedAgent', LastAssignedAgentSchema);
export { LastAssignedAgentSchema };