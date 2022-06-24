import ticket from "../../models/ticketModel";
import { L1 } from "../../../src/CONSTANTS";
import { L2 } from "../../../src/CONSTANTS";
//w jednej linijce mozna
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

const filterTicketsByKeyword = async (getTickets:any) => {
  
    let newTickets:ticket[] = await getTickets();
    let keywords1:string[] = L1;
    let keywords2:string[] = L2;
   // let easyTickets:ticket[]= [];
   // let mediumTickets:ticket[] = [];
   // let unknownTickets:ticket[] = [];

    //for (let i:number = 0; i < newTickets.length; i++) {
      newTickets.forEach(function (value) {

            let newTicket:ticket = value;
          //  let ticket1:ticket= <ticket>{};
            
        if (checker(newTicket.subject, keywords1) || checker(newTicket.description, keywords1)) {
           //easyTickets.push(newTicket);   
           newTicket.level = 'L1';      
        }
        else if (checker(newTicket.subject, keywords2) || checker(newTicket.description, keywords2)) {
           // mediumTickets.push(newTicket);
           newTicket.level = 'L2'; 
        }
        else {
           // unknownTickets.push(newTicket);
           newTicket.level = 'other'; 
        }
     });
  //  const returnList:ticketsList = {
  //    easyTickets,
  //    mediumTickets,
  //    unknownTickets
  //  };
   //console.log('przed returnem');
return newTickets;

}
// console.log('a5');
// //wrzucic ponizsze w funkcje
// let results:any = filterTicketsByKeyword(getNewTickets);
// console.log('a6');
// console.log(results.easyTickets);
// console.log('a7');
export default filterTicketsByKeyword;
