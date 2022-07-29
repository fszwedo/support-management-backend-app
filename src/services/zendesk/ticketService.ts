import makeZendeskRequest from "./authenticationService";
import getNewTickets from "./getNewTicketsService";
import { newTicket } from "../../models/ticketModel";

export default class TicketService {
    constructor(){}

    createNewTicket = async (ticket) => {
        const newTicket = {
                ticket            
        }
        console.log(ticket)
        return await makeZendeskRequest(`/api/v2/tickets`, 'POST', newTicket);
    }

    generateTicketBody = (ticketData) => {
        let body = '<h3>Ticket submitted via Support Assistant</h3><br/>';
        
        body += '<h4>Flow answers</h4><br/>';
        ticketData.questionsFlow.forEach(el => {
            body += `&emsp;<strong>${el.questionText}</strong>: ${el.answers[0]}<br/>`
        })
        body += '<br/><h4>Leadgen form content</h4><br/>';
        ticketData.submittedFormData.forEach(el => {
            body += `&emsp;<strong>${el.questionText}</strong>: ${el.answers[0]}<br/>`
        })

        return body
    }

    createTicket = async (ticketData) => { 
       // console.log(await makeZendeskRequest(`/api/v2/tickets/33/comments`, 'GET', ticketData))
        
        let ticket: newTicket = {
            subject: ticketData.questionsFlow[0].answers[0],
            comment: {
                html_body: this.generateTicketBody(ticketData)
            },
            requester:{
                email:'customer@example.com'
            }
        };
        return await this.createNewTicket(ticket);
    }

    createAccessRequest = async () => {

    }

    createBugRequest = async () => {

    }
}