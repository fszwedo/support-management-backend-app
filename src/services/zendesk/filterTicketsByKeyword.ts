import ticket from "../../models/ticketModel";
import { categories, L1, L2 } from "../../../src/CONSTANTS";
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

const filterTicketsByKeyword = async (getTickets: any) => {
   // for whatever reason I have to 
   console.log(await getTickets());
   let keywords1: string[] = L1;
   let keywords2: string[] = L2;

   let newTickets: ticket[] = await getTickets();

   newTickets.forEach(function (value) {
      let ticket: ticket = value;
      const ticketContent: string = ticket.subject + ticket.description;
      let results = [];

      //create an array of objects with category and count of category keyword occurences in the subject+description of the new ticket
      for (const [key, value] of Object.entries(categories)) {
         results.push({category: key, value: checker(ticketContent, value)})
      }

      //sort the provided array
      results.sort((a,b) => (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0));

      console.log(results);
      //return the most appropriate category
      if(results[0].value != 0) ticket.category = results[0].category;
      else ticket.category = undefined;
      
   });
   return newTickets;
}

export default filterTicketsByKeyword;
