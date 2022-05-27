import getNewTickets from "./getNewTicketsService";
import ticket from "../../models/ticketModel";
require('dotenv').config();

function checker(subject:string,keywords:string[]) {
    
    for (let i:number = 0; i < keywords.length; i++) {
      if (subject.indexOf(keywords[i]) > -1) {
        return true;
      }
    }
    return false;
  }

const filterTicketsByKeyword = async () => {
    let newTickets:ticket[] = await getNewTickets();
    let keywords1 = ['access','ftp','sds', 'pds'];
    let keywords2 = ['st','sql','css','js'];
    
    let easyTickets:ticket[]= [];
    let mediumTickets:ticket[] = [];
    let unknownTickets:ticket[] = [];

    for (let i:number = 0; i < newTickets.length; i++) {

            let newTicket:ticket = newTickets[i];
            let ticket1:ticket= <ticket>{};
         
            ticket1["id"] = newTicket.id; 
            ticket1.subject = newTicket.subject;
            ticket1.type = newTicket.type;
            ticket1.description = newTicket.description;
            
        if (checker(newTicket.subject, keywords1)) {
            easyTickets.push(ticket1);         
        }
        else if (checker(newTicket.subject, keywords2)) {
            mediumTickets.push(ticket1);
        }
        else {
            unknownTickets.push(ticket1);
        }
     }
return [easyTickets,mediumTickets,unknownTickets];

}

filterTicketsByKeyword();

export default filterTicketsByKeyword;
