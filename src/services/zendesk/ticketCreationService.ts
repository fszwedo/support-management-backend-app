import makeZendeskRequest from "./authenticationService";
import { newTicket } from "../../models/ticketModel";
import { leadgenFormContent } from '../../models/leadgenModel';
import { TICKET_CUSTOM_FIELDS } from '../../CONSTANTS'

export default class TicketService {
    constructor() { }

    generateTicketBody = (ticketData: leadgenFormContent) => {
        let body = '<h3>Ticket submitted via Support Assistant</h3><br/>';

        body += '<h4>Flow answers</h4><br/>';
        ticketData.questionsFlow.forEach(el => {
            body += `&emsp;<strong>${el.questionText}</strong>: ${el.answers[0]}<br/>`
        })
        body += '<br/><h4>Leadgen form content</h4><br/>';
        ticketData.submittedFormData.forEach(el => {
            let answer = el.answers[0];
            //exclude the Confluence redirection  (e.g. for fingerprint tutorial on bug path)          
            //el.answers checks are to prevent undefined and nulls from causing exceptions
            if (!el.questionText.includes('Confluence') && el.answers.length > 0 && el.answers[0] != null) {

                //wrap links in <a> tag to make them clickable                
                if (!el.questionText.includes('email')) answer = makeLinksClickable(answer);

                //replace \n with <br> for newline handling
                if (answer.includes('\n')) {
                    answer = '<br/>&emsp;&emsp;' + answer;
                    answer = answer.replace(/\n/g, '<br/>&emsp;&emsp;');
                }

                body += `&emsp;<strong>${el.questionText}</strong>: <span>${answer}</span><br/>`
            }
        })

        return body
    }

    createGeneralTicket = async (ticketData: leadgenFormContent, isFallback?: boolean) => {
        //below is a fallback logic for a case when there's no email question in the flow
        let requesterEmail = '';
        let requesterEmailExtractionFailed = false;
        try {
            requesterEmail = ticketData.submittedFormData.find(el => el.questionText.toLowerCase() === "please provide your email").answers[0];
        }
        catch (err) {
            console.log('Fatal error! Requester email cannot be extracted!')
            requesterEmail = 'f.szwedo@zoovu.com';
            requesterEmailExtractionFailed = true;
        }

        let ticket: newTicket = {
            subject: ticketData.questionsFlow[0].answers[0],
            comment: {
                html_body: this.generateTicketBody(ticketData)
            },
            requester: {
                email: requesterEmail,
                name: requesterEmail
            }
        };
        const createdTicket = await sendZendeskTicketCreationRequest(ticket);

        //here a logic that will add a comment if the ticket creation attempt is a fallback due to regular process failure
        if (isFallback === true) {
            let ticketComment = {
                comment: {
                    html_body: `WARNING - there has been a problem during this ticket creation! Some automated actions might not have been taken. <br/> Please contact a person responsible for Support App development to review the problem.`,
                    "public": false
                }
            }
            await sendZendeskTicketUpdateRequest(ticketComment, createdTicket.ticket.id)
        }

        //here's a logic that will add a comment if it was not possible to extract a requester email
        if (requesterEmailExtractionFailed === true) {
            let ticketComment = {
                comment: {
                    html_body: `WARNING - it was not possible to extract the email of the requester automatically. Phil was set as requester, please adjust it accordingly!`,
                    "public": false
                }
            }
            await sendZendeskTicketUpdateRequest(ticketComment, createdTicket.ticket.id)
        }

        return createdTicket
    }

    createAccountAccessRequest = async (ticketData: leadgenFormContent) => {
        const accountLink = ticketData.submittedFormData.find(el => el.questionText === "Account link").answers[0];
        const requesterEmail = ticketData.submittedFormData.find(el => el.questionText.toLowerCase() === "please provide your email").answers[0];
        const userToBeAssigned = ticketData.submittedFormData.find(el => el.questionText.includes("should get access")).answers[0];
        const approverEmail = ticketData.submittedFormData.find(el => el.questionText.includes('line manager')).answers[0];
        const platform = ticketData.questionsFlow.find(el => el.questionText.includes('which environment')).answers[0];

       const newTicket = await this.createGeneralTicket(ticketData);

        let accessApprovalEmailBody = `Hello ${approverEmail}! <br/>`;
        accessApprovalEmailBody += `User ${requesterEmail} reported that you are his/hers line manager. <strong>If that is correct can you please approve this account access request?</strong><br/><br/>`;
        accessApprovalEmailBody += `Requesting user: ${requesterEmail}<br/>`;
        accessApprovalEmailBody += `Request: assign ${userToBeAssigned} to account ${accountLink}<br/><br/>`;
        accessApprovalEmailBody += `The approval is required by the Zoovu access security policies. If you want to know more please visit <a href="https://confluence.smartassistant.com/display/ZS/Zoovu+Platform+account+access">this page</a><br/>`;
        accessApprovalEmailBody += `In case you have any questions - please respond to this email.`;

        let ticketComment = {
            comment: {
                html_body: accessApprovalEmailBody,
                "public": true
            },
            email_ccs: [
                { "user_email": approverEmail, "user_name": approverEmail, "action": "put" }
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
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.PLATFORM,
                    value: [platform.toLowerCase()]
                }
            ],
            type: 'task'
        }
        return await sendZendeskTicketUpdateRequest(ticketComment, newTicket.ticket.id)
    }

    createAdminAccessRequest = async (ticketData: leadgenFormContent) => {
        const requesterEmail = ticketData.submittedFormData.find(el => el.questionText.toLowerCase() === "please provide your email").answers[0];
        const managerEmail = ticketData.submittedFormData.find(el => el.questionText.includes('line manager')).answers[0];
        const platform = ticketData.questionsFlow.find(el => el.questionText.includes('which environment')).answers[0];

        let requestEmailBody = this.generateTicketBody(ticketData);
        requestEmailBody += `<br/><br/>As required by the access security policy the manager is CCed in this ticket.`

        const ticket: newTicket = {
            subject: ticketData.questionsFlow[0].answers[0],
            comment: {
                html_body: requestEmailBody
            },
            requester: {
                email: requesterEmail,
                name: requesterEmail
            },
            email_ccs: [
                { "user_email": managerEmail, "user_name": managerEmail, "action": "put" }
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
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.PLATFORM,
                    value: [platform.toLowerCase()]
                }
            ],
            type: 'task'
        };

        return await sendZendeskTicketCreationRequest(ticket);
    }

    createAccountCreationRequest = async (ticketData: leadgenFormContent) => {
        const requesterEmail = ticketData.submittedFormData.find(el => el.questionText.toLowerCase() === "please provide your email").answers[0];
        const platform = ticketData.questionsFlow.find(el => el.questionText.includes('Where')).answers[0];

        const ticketBody = this.generateTicketBody(ticketData);

        const ticket: newTicket = {
            subject: ticketData.questionsFlow[0].answers[0],
            comment: {
                html_body: ticketBody
            },
            requester: {
                email: requesterEmail,
                name: requesterEmail
            },
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
                    value: ['account_-_creation']
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.PLATFORM,
                    value: [platform.toLowerCase()]
                }
            ],
            type: 'task'
        };

        return await sendZendeskTicketCreationRequest(ticket);
    }

    createCustomerAccessRequest = async (ticketData: leadgenFormContent) => {
        const requesterEmail = ticketData.submittedFormData.find(el => el.questionText.toLowerCase() === "please provide your email").answers[0];
        const platform = ticketData.questionsFlow.find(el => el.questionText.includes('which environment')).answers[0];

        const ticketBody = this.generateTicketBody(ticketData);

        const ticket: newTicket = {
            subject: ticketData.questionsFlow[0].answers[0],
            comment: {
                html_body: ticketBody
            },
            requester: {
                email: requesterEmail,
                name: requesterEmail
            },
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
                    value: ['customer_onboarding__account_creation_', 'account_accesses']
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.PLATFORM,
                    value: [platform.toLowerCase()]
                }
            ],
            type: 'task'
        };

        return await sendZendeskTicketCreationRequest(ticket);
    }

    createProblemReport = async (ticketData: leadgenFormContent) => {
        const requesterEmail = ticketData.submittedFormData.find(el => el.questionText.toLowerCase() === "please provide your email").answers[0];
        const platform = ticketData.questionsFlow.find(el => el.questionText.includes('which environment')).answers[0];

        const ticketBody = this.generateTicketBody(ticketData);

        //logic below to define which category should be assigned
        const category = ticketData.submittedFormData.find(el => el.questionText.includes('category')).answers[0].toLowerCase();
        let categoryCustomFieldValue = '';

        if (category.includes('configurator')) categoryCustomFieldValue = 'configurators';
        else if (category.includes('experience designer')) categoryCustomFieldValue = 'experience_designer';
        else if (category.includes('semantic studio')) categoryCustomFieldValue = 'semantic_studio';
        else if (category.includes('custom theme')) categoryCustomFieldValue = 'frontend_custom_themes';
        else if (category.includes('feed')) categoryCustomFieldValue = 'platform_automatic_data_feed_';
        else if (category.includes('success tracking')) categoryCustomFieldValue = 'platform_success_tracking_';
        else if (category.includes('css')) categoryCustomFieldValue = 'frontend_css';
        else if (category.includes('login problems')) categoryCustomFieldValue = 'account_access';

        const ticket: newTicket = {
            subject: ticketData.questionsFlow[0].answers[0],
            comment: {
                html_body: ticketBody
            },
            requester: {
                email: requesterEmail,
                name: requesterEmail
            },
            custom_fields: [
                {
                    "id": TICKET_CUSTOM_FIELDS.SOURCE,
                    value: 'internal'
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.CATEGORY,
                    value: [categoryCustomFieldValue]
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.PLATFORM,
                    value: [platform.toLowerCase()]
                }
            ],
            type: 'problem'
        };

        return await sendZendeskTicketCreationRequest(ticket);
    }

    createFTPRequest = async (ticketData: leadgenFormContent) => {
        const requesterEmail = ticketData.submittedFormData.find(el => el.questionText.toLowerCase() === "please provide your email").answers[0];

        const ticketBody = this.generateTicketBody(ticketData);

        const ticketType = ticketData.questionsFlow.find(el => el.questionText.includes('do you need')).answers[0].includes('question') ? 'question' : 'task';
        
        const ticket: newTicket = {
            subject: ticketData.questionsFlow[0].answers[0],
            comment: {
                html_body: ticketBody
            },
            requester: {
                email: requesterEmail,
                name: requesterEmail
            },
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
                    value: ['data_ftp']
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.PLATFORM,
                    value: ['not_platform_issue']
                }
            ],
            type: ticketType
        };

        return await sendZendeskTicketCreationRequest(ticket);
    }

    createReportingRequest = async (ticketData: leadgenFormContent) => {
        const requesterEmail = ticketData.submittedFormData.find(el => el.questionText.toLowerCase() === "please provide your email").answers[0];
        const platform = ticketData.questionsFlow.find(el => el.questionText.includes('environment')).answers[0];
        const type = ticketData.questionsFlow.find(el => el.questionText.includes('What would you like to request')).answers[0];
        const ticketBody = this.generateTicketBody(ticketData);

        const ticket: newTicket = {
            subject: ticketData.questionsFlow[0].answers[0],
            comment: {
                html_body: ticketBody
            },
            requester: {
                email: requesterEmail,
                name: requesterEmail
            }
        };

        //depending on the path - different ticket is created
        if (type.includes('problem')) {
            ticket.subject = 'Reporting issue'
            ticket.type = 'problem';
            ticket.custom_fields = [
                {
                    "id": TICKET_CUSTOM_FIELDS.SOURCE,
                    value: 'internal'
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.CATEGORY,
                    value: ['platform_reporting_dashboard']
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.PLATFORM,
                    value: [platform.toLowerCase()]
                }
            ]
        }
        else {
            ticket.subject = 'Reporting export request'
            ticket.type = 'task';
            ticket.custom_fields = [
                {
                    "id": TICKET_CUSTOM_FIELDS.SOURCE,
                    value: 'internal'
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.CATEGORY,
                    value: ['sql_export']
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.PLATFORM,
                    value: [platform.toLowerCase()]
                }
            ]
        }

        return await sendZendeskTicketCreationRequest(ticket);
    }
}

//utility functions to send Zendesk ticket create and update requests, and to parse/modify ticket content to wrap links in <a> tags
    export const sendZendeskTicketCreationRequest = async (ticket: newTicket) => {
        //add tag to distinguish leadgen-created tickets
        ticket.tags = ['leadgen'];
        const newTicket = {
            ticket
        }
        console.log(`Ticket ${ticket.subject} from ${ticket.requester.email} was created!`)
        return await makeZendeskRequest(`/api/v2/tickets`, 'POST', newTicket);
    }

    export const sendZendeskTicketUpdateRequest = async (ticket, id: number) => {
        const updatedTicket = {
            ticket
        }
        return await makeZendeskRequest(`/api/v2/tickets/${id}`, 'PUT', updatedTicket);
    }

    export const makeLinksClickable = (text: string) => {
        var urlRegex = /(https?:\/\/|www\.)?([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g
        return text.replace(urlRegex, function (url) {
            let href = url;
            if (!url.startsWith("http")) {
                href = "http://" + url;
            }
            return "<a href='" + href + "'>" + url + "</a>";
        });
    }