//import getAgents from "../services/zendesk/getAgentsService";
//import selectAgentToAssign from "../services/zendesk/selectAgentToAssign";
import shiftRotaService from "../services/shiftRotaService";
import ShiftRotaRepository from "../repositories/shiftRotaRepository";
import shiftRotaModel from '../models/shiftRotaModel'
//import makeZendeskRequest from "../services/zendesk/authenticationService";
//import sendEmail1 from "../services/sendEmailService";


const sendEmail11 = async () => {

    const shiftRota = new shiftRotaService(new ShiftRotaRepository(shiftRotaModel));
//get the shift data
const todayShifts = await shiftRota.getNextWeekShifts();

console.log(todayShifts);

//if there are new tickets - get agents from Zendesk
//const agents = await getAgents(makeZendeskRequest);

//check which agents are available at the current time
///const isAvailableAgent = await selectAgentToAssign(agents, lastAssignedAgent.getLastAgent, todayShifts,null);
//if there are no agents - stop execution
//if (!isAvailableAgent[0]) {
    //console.log(`no available agents!`);
 //   return;
//}

//sendEmail1(isAvailableAgent);

}

export default sendEmail11;

//getWeekShifts
//wywolujemy service z templatka, przekazujemy template
//sendShiftEmail 
//w controllerze ogarnac HTMLa, ewentualnie w service
//brac maila z user service, metoda getallusers
//stworzyc swojego usera w Mongo, bo na razie jest tylko Phil