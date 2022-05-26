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
    //funkcja powinna przyjmowac tablice ticketow, a nie zwracane tickety z getNewTickets
    //przekazywanie funkcji getNewTickets w parametrze
  //  console.log(newTickets);
    //console.log(typeof(newTickets));
    //console.log(newTickets);

    let keywords1 = ['access','ftp','sds', 'pds'];
    let keywords2 = ['st','sql','css','js'];
    
    let easyTickets:ticket[]= [];
    let mediumTickets:ticket[] = [];
    let unknownTickets:ticket[] = [];

    for (let i:number = 0; i < newTickets.length; i++) {

        let newTicket:ticket = newTickets[i];
        //console.log(newTicket.description);
            // console.log('bb');
            // console.log(newTicket);
            // console.log('cc');
            let ticket1:ticket= <ticket>{};
         
            ticket1["id"] = newTicket.id; 
            ticket1.subject = newTicket.subject;
            ticket1.type = newTicket.type;
            ticket1.description = newTicket.description;
            
        if (checker(newTicket.subject, keywords1)) {
            easyTickets.push(ticket1);         
        }
        else if (checker(newTicket.subject, keywords2)) {
            //console.log(newTicket);
            mediumTickets.push(ticket1);
        }
        else {
            //console.log(newTicket);
            unknownTickets.push(ticket1);
        }
     }
    console.log("EASY\n");
    for (let i:number =0; i<easyTickets.length;i++){
     // console.log(easyTickets[i]);
    }

   console.log("MEDIUM\n");
   for (let i:number =0; i<mediumTickets.length;i++){
      // console.log(mediumTickets[i]);
   }

   console.log("UNKNOWN\n");
   for (let i:number =0; i<unknownTickets.length;i++){
      // console.log(unknownTickets[i]);
   }

console.log([easyTickets,mediumTickets,unknownTickets]);
return [easyTickets,mediumTickets,unknownTickets];

  //zwracac obiekt a nie tablice?
  //model obiektu ktory zwracam w folderze models
    //const ticketsResponse = await makeZendeskRequest('/api/v2/tickets.json?page[size]=100&sort=-id', 'GET');
    
    //if (ticketsResponse.tickets) {
     //   const tickets = ticketsResponse.tickets; 
     //   console.log(tickets.length);
     //   newTickets = tickets.filter(ticket => ticket.status === 'new');
   // }    
   // return newTickets;
}

filterTicketsByKeyword();

export default filterTicketsByKeyword;
