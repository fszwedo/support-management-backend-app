import shiftRotaService from "../services/shiftRotaService";
import ShiftRotaRepository from "../repositories/shiftRotaRepository";
import shiftRotaModel from '../models/shiftRotaModel'
import sendEmail1 from "../services/sendEmailService";


const sendEmailtoAgent= async () => { //email112 powinien przyjmowac jako atrybut shift rota z linijki 12

const shiftRota = new shiftRotaService(new ShiftRotaRepository(shiftRotaModel));
const todayShifts = await shiftRota.getNextWeekShifts();
type agent = {

    name: string,
    date: string,
    hours: string
    
};
let agents:string[] = [];   // unique list of agents
let shifts:agent[] = [];

todayShifts.forEach(day1=>{
    let date1:string= day1.date;
    let agents1 = day1.agents;
    let hours1 = day1.hours;

    for(let j =0; j<agents1.length;j++){
        let name:string = agents1[j];
        let hours2:string = hours1[j];

        if(!agents.find(elem1 => elem1 == name)){
            agents.push(name);
        }

        if (hours2.length < 3) { 
            hours2 = 'day off';
        }
            let shift:agent = { name: name, date: date1, hours: hours2};
            shifts.push(shift);       
    }
}
)

agents.forEach(agent1 => {
    let shifts1:agent[] = shifts.filter(elem1 => elem1.name == agent1)
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
        default:
        emailToAgent = 'g.bochniak@zoovu.com'
        break;
      }
   
    sendEmail1(shifts1,emailToAgent);
})

}

export default sendEmailtoAgent;



