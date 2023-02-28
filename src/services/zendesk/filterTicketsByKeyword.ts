import ticket from "../../models/ticketModel";
import { categories, L1, L2 } from "../../../src/CONSTANTS";

function checker(text: string, keywords: string[]): number {
   let totalCount = 0;
   for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i];
      const regex = new RegExp(keyword, "gi"); // create a regular expression for the keyword, using "gi" to match globally and case-insensitively
      const matches = text.match(regex); // find all matches of the keyword in the string
      const count = matches ? matches.length : 0; // count the number of matches, or set it to 0 if there are none
      totalCount += count; // add the count for this keyword to the overall count
   }
   return totalCount;
}

const filterTicketsByKeyword = async (getTickets: any) => {

   let newTickets: ticket[] = await getTickets();
   let keywords1: string[] = L1;
   let keywords2: string[] = L2;

   newTickets.forEach(function (value) {
      let ticket: ticket = value;
      const ticketContent: string = ticket.subject + ticket.description;
      let results = [];

      //create an array of objects with category and count of category keyword occurences in the subject+description of the new ticket
      for (const [key, value] of Object.entries(categories)) {
         results.push({category: key, value: checker(ticketContent, value)})
      }

      //sort the provided array
      results.sort((a,b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));

      //return the most appropriate category
      ticket.category = results[0].category
   });

   return newTickets;
}

export default filterTicketsByKeyword;


