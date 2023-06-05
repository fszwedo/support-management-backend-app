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

const getTicketMetricEvents = async () => {
    const field = await makeZendeskRequest('/api/v2/incremental/ticket_metric_events.json?start_time=1684597057', 'GET')
    console.log(field.ticket_metric_events.filter(e => e.type="breach"))    
    //console.log(field.ticket_field.custom_field_options)
}

const getTicketAuditEvents = async () => {
    const audit = await makeZendeskRequest('/api/v2/ticket_audits', 'GET')
    const results = [];
    audit.audits.forEach(a => {
        results.push(a.events)
    })
    console.log(results)    
    //console.log(field.ticket_field.custom_field_options)
}


//getZendeskTicketFields();
//getZendeskTicketField();

getTicketAuditEvents();
