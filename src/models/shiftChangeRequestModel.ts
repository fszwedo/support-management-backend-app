import * as mongoose from 'mongoose';

export interface ShiftChangeRequest {
    _id: mongoose.ObjectId,
    agent: string
    requestedChanges: [{date: Date,
            hours: string
        }]
};

const ShiftChangeRequestSchema = new mongoose.Schema({
    agent: { type: String },
    requestedChanges: {
        type: [{date: Date,
            hours: String
        }],
        validate:   v => Array.isArray(v) 
                    && v.length > 0
                    && v.forEach(el => el.hours.split('-').forEach(el => typeof el === 'number'))
    }
  }, {timestamps: true});

  export default mongoose.model<ShiftChangeRequest & mongoose.Document>('ShiftChangeRequest', ShiftChangeRequestSchema);