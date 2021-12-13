import mongoose from 'mongoose';

const shiftRotaSchema = new mongoose.Schema({
    date: { type: String, required: true },
    agents: { type: [ String ], required: true },
    hours: { type: [ String ], required: true },
    isWeekend: { Boolean, default: false }
}) 

export default mongoose.model('ShiftRota', shiftRotaSchema);