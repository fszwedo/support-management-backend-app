import TicketService from "../src/services/zendesk/ticketService";
import makeZendeskRequest from '../src/services/zendesk/authenticationService'
import { mocked } from 'jest-mock'
import { leadgenFormContent } from '.../../models/leadgenModel';

jest.mock('../src/services/zendesk/authenticationService');
const mockedZendeskRequest = mocked(makeZendeskRequest, true)

describe('Test ticket service', () => {
    const ticketService = new TicketService;

    it('creates new ticket', async () => {
        await ticketService.createNewTicket({testData: '123'});
        expect(mockedZendeskRequest).toHaveBeenCalled();
        expect(mockedZendeskRequest.mock.lastCall).toEqual([ 
            '/api/v2/tickets', 
            'POST', 
            { ticket: {testData: '123', tags: ['leadgen']} } 
        ]);
    });

    it('updates ticket (adds comment etc.)', async () => {
        const ticketId = 123;
        await ticketService.updateTicket({testData: '123'}, ticketId);
        expect(mockedZendeskRequest).toHaveBeenCalled();
        expect(mockedZendeskRequest.mock.lastCall).toEqual([ 
            `/api/v2/tickets/${ticketId}`, 
            'PUT', 
            { ticket: {testData: '123'} }
        ]);
    });

    it('generates ticket body from leadgen form content', async () => {
        const leadGenContent: leadgenFormContent = {
            advisorName: '123',
            submittedFormData: [{
                questionId: 123,
                questionText: 'testQUestionFromLeadgenForm',
                answers: ['testAnswer']
            }],
            questionsFlow:[{
                questionId: 321,
                questionText: 'testQuestionFromQuestionnaire',
                answers: ['testAnswer']
            }]
        }

        //snapshot of expected ticket body - has to be regenerated if ticket body changes will be introduced
        const expectedTicketBody = '<h3>Ticket submitted via Support Assistant</h3><br/><h4>Flow answers</h4><br/>&emsp;<strong>testQuestionFromQuestionnaire</strong>: testAnswer<br/><br/><h4>Leadgen form content</h4><br/>&emsp;<strong>testQUestionFromLeadgenForm</strong>: testAnswer<br/>'

        const ticketBody = ticketService.generateTicketBody(leadGenContent);
        expect(ticketBody).toEqual(expectedTicketBody);
    });

    // it('creates ticket on Zendesk from leadgen form', async () => {
    //     const ticketId = 123;
    //     await ticketService.updateTicket({testData: '123'}, ticketId);
    //     expect(mockedZendeskRequest).toHaveBeenCalled();
    //     expect(mockedZendeskRequest.mock.lastCall).toEqual([ 
    //         `/api/v2/tickets/${ticketId}`, 
    //         'PUT', 
    //         { ticket: {testData: '123', } 
    //     ]);
    // });
});