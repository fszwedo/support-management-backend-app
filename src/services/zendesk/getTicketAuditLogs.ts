import makeZendeskRequest from "./authenticationService";
import { auditLog } from "../../models/zendeskAuditLogModel";

const getTicketAuditLogs = async (untilDate?: Date): Promise<auditLog[]> => {
    try {
        let ticketAuditsResponse = await makeZendeskRequest('/api/v2/ticket_audits', 'GET');
        const audits = ticketAuditsResponse.audits;

        if (untilDate) {
            while (untilDate < new Date(ticketAuditsResponse.audits.at(-1).created_at)) {
                ticketAuditsResponse = await makeZendeskRequest(`/api/v2/ticket_audits.json?cursor=${ticketAuditsResponse.before_cursor}`, 'GET');
                audits.push(...ticketAuditsResponse.audits);
            }
        }
        return audits;
    } catch (error) {
        console.log('Cannot get the ticket audit logs from Zendesk!');
        return null;
    }
}

export default getTicketAuditLogs;


