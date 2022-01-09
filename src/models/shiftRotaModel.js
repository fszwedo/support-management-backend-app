import mongoose from 'mongoose';

const shiftRotaSchema = new mongoose.Schema({
    date: { type: String, required: true },
    agents: { type: [ String ],
        validate: v => Array.isArray(v) && v.length > 0},
    hours: { type: [ String ], 
        validate: v => Array.isArray(v) && v.length > 0},
    isWeekend: { Boolean, default: false }
}) 

export default mongoose.model('ShiftRota', shiftRotaSchema);