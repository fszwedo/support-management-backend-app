import sendEmail from "../services/sendEmailService";

const sendEmailstoAgents = async (shiftRotaService, userService) => {
    const todayShifts = await shiftRotaService.getNextWeekShifts();
    type agentShiftData = {
        name: string,
        date: string,
        hours: string
    };
    let agentsNamesInShiftRota: string[] = [];   // unique list of agents
    let shifts: agentShiftData[] = [];

    todayShifts.forEach(day => {
        let date1: string = day.date;
        let agentsListofDay = day.agents;
        let hoursListofAgents = day.hours;

        for (let j = 0; j < agentsListofDay.length; j++) {
            let agentName: string = agentsListofDay[j];
            let agentHours: string = hoursListofAgents[j];
            if (!agentsNamesInShiftRota.find(elem1 => elem1 == agentName)) {
                agentsNamesInShiftRota.push(agentName);
            }

            if (agentHours.length < 3) {
                agentHours = 'no hours set';
            }
            let shiftData: agentShiftData = { name: agentName, date: date1, hours: agentHours };
            shifts.push(shiftData);
        }
    }
    )

    const usersInDatabase = await userService.getAllUsers();

    agentsNamesInShiftRota.forEach(agent => {
        let shiftsToBeSent: agentShiftData[] = shifts.filter(elem1 => elem1.name === agent)
        let emailToAgent = usersInDatabase.find(user => user.name === shiftsToBeSent[0].name);
        sendEmail(shiftsToBeSent, emailToAgent);
    })
}

export default sendEmailstoAgents;