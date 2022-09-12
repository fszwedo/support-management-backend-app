import 'dotenv/config';
import makeZendeskRequest from '../src/services/zendesk/authenticationService'


const getZendeskTicketFields = async () => {
    const fields = await makeZendeskRequest('/api/v2/ticket_fields.json', 'GET')
    console.log(fields)
}

const getZendeskTicketField = async () => {
    const field = await makeZendeskRequest('/api/v2/ticket_fields/360016765134', 'GET')
    console.log(field)    
    console.log(field.ticket_field.custom_field_options)
}

//getZendeskTicketFields();
getZendeskTicketField();
