import filterTicketsByKeyword from './filterTicketsByKeyword';
import getNewTickets from './getNewTicketsService';

async function filter1() {
    console.log('a5');

    let results:any = await filterTicketsByKeyword(getNewTickets);
    console.log('easy');

    // for (let i=0; i< results.unknownTickets.length; i++) {

    //     console.log(results.unknownTickets[i].subject);
    // }
//    console.log(results.easyTickets);
//    console.log('medium');  
//     console.log(results.mediumTickets);
//    console.log('unknown');  
//     console.log(results.unknownTickets);

    console.log(results.length);
 //  console.log(results.mediumTickets.length);
  //  console.log(results.unknownTickets.length);
}
console.log('b1');  
let results1 = filter1();
console.log('b2'); 
//console.log(results1);
//console.log('b3'); 