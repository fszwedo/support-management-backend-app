import mongoose from "mongoose";

export interface ShiftRota {
  _id?: mongoose.ObjectId;
  date: string; //date has to be in format yy-mm-dd!!!!
  agents: string[];
  hours: string[];
  workHours: string[];
  overwatchAssignments: boolean[];
}

const Schema = mongoose.Schema;

const ShiftRotaSchema = new Schema({
  date: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        const dateParts = v.split("-");
        if (dateParts.length === 3 && !dateParts.find((e) => e.length != 2) && !dateParts.find((e) => typeof e != "string")) return true;
        return false;
      },
      message: "Date has to be in format yy-mm-dd!",
    },
  },
  agents: {
    type: [String],
    validate: (v) => Array.isArray(v) && v.length > 0,
  },
  hours: {
    type: [String],
    validate: (v) => Array.isArray(v) && v.length > 0,
  },
  workHours: {
    type: [String],
    validate: (v) => Array.isArray(v) && v.length > 0,
  },
  overwatchAssignments: {
    type: [Boolean],
    validate: (v) => Array.isArray(v) && v.length > 0,
  },
});

export default mongoose.model<ShiftRota & mongoose.Document>("ShiftRota", ShiftRotaSchema);
export { ShiftRotaSchema };
