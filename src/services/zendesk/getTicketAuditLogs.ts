import makeZendeskRequest from "./authenticationService";
import { auditLog } from "../../models/zendeskAuditLogModel";

const getTicketAuditLogs = async (): Promise<auditLog[]> => {
    const ticketAuditsResponse = await makeZendeskRequest('/api/v2/ticket_audits', 'GET');
    return ticketAuditsResponse.audits;
}

export default getTicketAuditLogs;


