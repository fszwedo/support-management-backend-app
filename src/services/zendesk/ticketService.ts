import makeZendeskRequest from "./authenticationService";
import { newTicket } from "../../models/ticketModel";
import { leadgenFormContent } from '../../models/leadgenModel';
import { TICKET_CUSTOM_FIELDS } from '../../CONSTANTS'

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

    generateTicketBody = (ticketData: leadgenFormContent) => {
        let body = '<h3>Ticket submitted via Support Assistant</h3><br/>';
        
        body += '<h4>Flow answers</h4><br/>';
        ticketData.questionsFlow.forEach(el => {
            body += `&emsp;<strong>${el.questionText}</strong>: ${el.answers[0]}<br/>`
        })
        body += '<br/><h4>Leadgen form content</h4><br/>';
        ticketData.submittedFormData.forEach(el => {
            //exclude the Confluence redirection
            if(!el.questionText.includes('Confluence'))  body += `&emsp;<strong>${el.questionText}</strong>: ${el.answers[0]}<br/>`
        })

        return body
    }

    createTicket = async (ticketData: leadgenFormContent, tags?) => {  
        const requesterEmail = ticketData.submittedFormData.find(el => el.questionText === "Please provide YOUR email").answers[0];     
       
        let ticket: newTicket = {
            subject: ticketData.questionsFlow[0].answers[0],
            comment: {
                html_body: this.generateTicketBody(ticketData)
            },
            requester:{
                email: requesterEmail,
                name: requesterEmail
            }
        };
        return await this.createNewTicket(ticket);
    }

    createAccountAccessRequest = async (ticketData: leadgenFormContent) => {
        const accountLink = ticketData.submittedFormData.find(el => el.questionText === "Account link").answers[0];
        const requesterEmail = ticketData.submittedFormData.find(el => el.questionText === "Please provide YOUR email").answers[0];
        const approverEmail = ticketData.submittedFormData.find(el => el.questionText.includes('line manager')).answers[0];

        const ticket: newTicket = await this.createTicket(ticketData);

        let accessApprovalEmailBody = `Hello ${approverEmail}! <br/>`;
        accessApprovalEmailBody += `User ${requesterEmail} reported that you are his/hers line manager. If that is correct can you please approve this customer's account access request?<br/><br/>`;
        accessApprovalEmailBody += `Requesting user: ${requesterEmail}<br/>`;
        accessApprovalEmailBody += `Target account: ${accountLink}<br/><br/>`;
        accessApprovalEmailBody += `The approval is required by the access security policies Zoovu has in place.`;

        let ticketComment = {
            comment:{
                html_body: accessApprovalEmailBody,
                "public": true
            },
            email_ccs: [
                {"user_email": approverEmail, "user_name": approverEmail, "action": "put"}
            ],
            custom_fields: [
                {
                    "id": TICKET_CUSTOM_FIELDS.LEVEL,
                    value: 'l1'
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.SOURCE,
                    value: 'internal'
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.CATEGORY,
                    value: ['account_accesses']
                }            
            ],
            type: 'task'
        }
       return await this.updateTicket(ticketComment, ticket.id)
    }

    createAdminAccessRequest = async (ticketData: leadgenFormContent) => {
        const requesterEmail = ticketData.submittedFormData.find(el => el.questionText === "Please provide YOUR email").answers[0];     
        const managerEmail = ticketData.submittedFormData.find(el => el.questionText.includes('line manager')).answers[0];
       
        let requestEmailBody = this.generateTicketBody(ticketData);
        requestEmailBody += `<br/><br/>As required by the access security policy the manager is CCed in this ticket.`

        const ticket: newTicket = {
            subject: ticketData.questionsFlow[0].answers[0],
            comment: {
                html_body: requestEmailBody
            },
            requester:{
                email: requesterEmail,
                name: requesterEmail
            },
            email_ccs: [
                {"user_email": managerEmail, "user_name": managerEmail, "action": "put"}
            ],
            custom_fields: [
                {
                    "id": TICKET_CUSTOM_FIELDS.LEVEL,
                    value: 'l1'
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.SOURCE,
                    value: 'internal'
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.CATEGORY,
                    value: ['admin_tool_access']
                }            
            ],
            type: 'task'
        };

        return await this.createNewTicket(ticket);         
    } 

    createBugRequest = async () => {

    }
}