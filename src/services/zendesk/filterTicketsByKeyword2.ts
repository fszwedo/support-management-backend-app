import ticket from "../../models/ticketModel";
import { L1 } from "../../CONSTANTS";
import { L2 } from "../../CONSTANTS";
import ticketsList from "../../models/ticketsList";

require('dotenv').config();



function checker(subject:string,keywords:string[]) {
    
    for (let i:number = 0; i < keywords.length; i++) {
      if (subject.toLowerCase().indexOf(keywords[i]) > -1) {
        return true;
      }
    }
    return false;
  }

const filterTicketsByKeyword2 = async (tickets:any) => {
  
    let newTickets:ticket[] = tickets;
   //let newTickets:ticket[] = ticketsArray;
    let keywords1:string[] = L1;
    let keywords2:string[] = L2;

    newTickets.forEach(function (value) {

            let newTicket:ticket = value;
            
        if (checker(newTicket.subject, keywords1) || checker(newTicket.description, keywords1)) { 
           newTicket.level = 'L1';      
        }
        else if (checker(newTicket.subject, keywords2) || checker(newTicket.description, keywords2)) {
           newTicket.level = 'L2'; 
        }
        else {
           newTicket.level = 'other'; 
        }
     });

return newTickets;
}

export default filterTicketsByKeyword2;
