import express from 'express';
import 'dotenv/config';
import { CronJob } from 'cron';
import assignNewTicket from './src/controllers/ticketAssignmentController.js';
import shiftRota from './src/routes/shiftRota.js';
import mongoose from 'mongoose';


const app = express();
app.use(express.json());
app.use('/api/shiftRota', shiftRota);

await mongoose.connect(`mongodb+srv://${process.env.MONGOLOGIN}:${process.env.MONGOPW}@cluster0.mgkhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(error => console.error('Could not connect to MongoDB!', error))

console.log('App started at '+ new Date().toLocaleString())

let lastAssignedUserId = 0;

app.listen(process.env.PORT, () => {
     console.log(`listening on ${process.env.PORT}`)
})

async function createShiftRota () {
    const shiftRotaSchema = new mongoose.Schema({
        date: Date,
        agents: [ String ],
        hours: [ String ],
        isWeekend: {Boolean, default: false}
    }) 
    
    const ShiftRota = mongoose.model('ShiftRota', shiftRotaSchema);
    const shiftRota = new ShiftRota({
        date: new Date,
        agents: [ 'phil', 'shehroze' ],
        hours: [ '9-17', '14-22' ]
    })
    
    const result = await shiftRota.save();  
    console.log(result)
}

//createShiftRota();


// const job = new CronJob('1/10 * 7-22 * * *',  async function () {
//     lastAssignedUserId = await assignNewTicket('./src/lastAssignmentTimestamps.csv', lastAssignedUserId);
// });
// job.start();
