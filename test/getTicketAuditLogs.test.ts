import getTicketAuditLogs from "../src/services/zendesk/getTicketAuditLogs";
import makeZendeskRequest from "../src/services/zendesk/authenticationService";
import { ticketAuditsResponseMockData, ticketAuditsResponseCursorMockData } from './mockData/getTicketAuditLogs.mockData'

jest.mock('../src/services/zendesk/authenticationService');

describe('Test getTicketAuditLogs service', () => {
    it('returns appropriate data when untilDate was not provided', async () => {
        (makeZendeskRequest as jest.Mock).mockResolvedValueOnce(ticketAuditsResponseMockData)
        expect(await getTicketAuditLogs()).toEqual(ticketAuditsResponseMockData.audits);
    });
    it('returns appropriate data when untilDate was provided', async () => {
        (makeZendeskRequest as jest.Mock).mockResolvedValueOnce(ticketAuditsResponseMockData)
            .mockResolvedValueOnce(ticketAuditsResponseCursorMockData);
        expect(await getTicketAuditLogs(new Date("2023-05-01 00:00:00"))).toEqual(expect.arrayContaining([...ticketAuditsResponseMockData.audits, ...ticketAuditsResponseCursorMockData.audits]));
    });
});
