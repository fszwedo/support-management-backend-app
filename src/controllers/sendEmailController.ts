import shiftRotaService from "../services/shiftRotaService";
import ShiftRotaRepository from "../repositories/shiftRotaRepository";
import shiftRotaModel from '../models/shiftRotaModel'
import sendEmail1 from "../services/sendEmailService";


const sendEmailstoAgents = async (shiftRota) => {

    const todayShifts = await shiftRota.getNextWeekShifts();
    type agentShiftData = {
        name: string,
        date: string,
        hours: string
    };
    let agents: string[] = [];   // unique list of agents
    let shifts: agentShiftData[] = [];

    todayShifts.forEach(day => {
        let date1: string = day.date;
        let agentsListofDay = day.agents;
        let hoursListofAgents = day.hours;
        
        for (let j = 0; j < agentsListofDay.length; j++) {
            let agentName: string = agentsListofDay[j];
            let agentHours: string = hoursListofAgents[j];
           // let shiftData: agentShiftData = { name: agentsListofDay[j], date: date1, hours: hoursListofAgents[j] };
            if (!agents.find(elem1 => elem1 == agentName)) {
                agents.push(agentName);
            }

            if (agentHours.length < 3) {
                agentHours = 'day off';
            }
            let shiftData: agentShiftData = { name: agentName, date: date1, hours: agentHours };
            shifts.push(shiftData);
        }
    }
    )

    agents.forEach(agent1 => {
        let shifts1: agentShiftData[] = shifts.filter(elem1 => elem1.name == agent1)
        console.log(shifts1[0].name);
        let emailToAgent = '';
        switch (shifts1[0].name) {
            case 'Anna':
                emailToAgent = 'a.karpalova@zoovu.com'
                break;
            case 'Phil':
                emailToAgent = 'f.szwedo@zoovu.com'
                break;
            case 'Greg':
                emailToAgent = 'g.bochniak@zoovu.com'
                break;
            case 'Shehroze':
                emailToAgent = 's.khan@zoovu.com'
                break;
            case 'Hasan':
                emailToAgent = 'h.bhati@zoovu.com'
                break;
            case 'Konrad':
                emailToAgent = 'k.molda@zoovu.com'
                break;
            case 'Kate':
                emailToAgent = 'k.lukianova@zoovu.com'
                break;
            case 'Adam':
                emailToAgent = 'a.kielinski@zoovu.com'
                break;
            default:
                emailToAgent = 'g.bochniak@zoovu.com'
                break;
        }

        sendEmail1(shifts1, emailToAgent);
    })

}

export default sendEmailstoAgents;



