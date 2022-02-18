import mongoose from 'mongoose';

export interface ShiftRota {
    _id?: mongoose.ObjectId,
    date:  string,
    agents: string[],
    hours: string[]
}

const Schema = mongoose.Schema;

const ShiftRotaSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    date: { type: String, required: true },
    agents: { type: [ String ],
        validate: v => Array.isArray(v) && v.length > 0},
    hours: { type: [ String ], 
        validate: v => Array.isArray(v) && v.length > 0}
}) 

export default mongoose.model<ShiftRota & mongoose.Document>('ShiftRota', ShiftRotaSchema);
export { ShiftRotaSchema };