import makeZendeskRequest from "./authenticationService";
import { newTicket } from "../../models/ticketModel";

export default class TicketService {
    constructor(){}

    createNewTicket = async (ticket) => {
        const newTicket = {
                ticket            
        }
        return await makeZendeskRequest(`/api/v2/tickets`, 'POST', newTicket);
    }

    updateTicket = async (ticket, id) => {
        const newTicket = {
                ticket            
        }
        return await makeZendeskRequest(`/api/v2/tickets/${id}`, 'PUT', newTicket);
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

    createAccessRequest = async (ticketData) => {
        let ticket: newTicket = {
            subject: ticketData.questionsFlow[0].answers[0],
            comment: {
                html_body: this.generateTicketBody(ticketData)
            },
            requester:{
                email: 'test@pies.kot',
                name: 'test@pies.kot'
            }
        };
        const newTicket = await this.createNewTicket(ticket);

        let ticketComment = {
            comment:{
                "body": "Hello, can you please approve the request?",
                "public": true
            },
            email_ccs: [
                {"user_email": "f.szwedo@zoovu.com", "user_name": "f.szwedo@zoovu.com", "action": "put"}
            ]
        }
       console.log(await makeZendeskRequest(`/api/v2/ticket_fields`, 'GET', ticketData))
       return await this.updateTicket(ticketComment, newTicket.ticket.id)
    }

    createBugRequest = async () => {

    }
}