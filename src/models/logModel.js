import mongoose from 'mongoose';


const logSchema = new mongoose.Schema({
    timestamp: { type: String, default: new Date().toUTCString() },
    type: { type: String, required: true },
    message: { type: String, required: true },
    origin: { type: String,  required: true }
}) 

logSchema.index({
    type: 'text',
    message: 'text',
    origin: 'text'
})

export default mongoose.model('Log', logSchema);