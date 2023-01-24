import TicketService, { sendZendeskTicketCreationRequest, sendZendeskTicketUpdateRequest, makeLinksClickable } from "../src/services/zendesk/ticketCreationService";
import makeZendeskRequest from '../src/services/zendesk/authenticationService'
import { mocked } from 'jest-mock'
import { leadgenFormContent } from '.../../models/leadgenModel';
import { newTicket } from '.../../models/ticketModel';

jest.mock('../src/services/zendesk/authenticationService');
const mockedZendeskRequest = mocked(makeZendeskRequest, true)

const testLeadGenContent: leadgenFormContent = {
    advisorName: '123',
    submittedFormData: [{
        questionId: 123,
        questionText: 'Please provide YOUR email',
        answers: ['testAnswer']
    }],
    questionsFlow: [{
        questionId: 321,
        questionText: 'testQuestionFromQuestionnaire',
        answers: ['testAnswer']
    }]
}

const mockTicket: newTicket = {
      subject: 'test subject',
      comment: {
        html_body: 'test comment'
      },
      requester:{
        email: 'email@test.com'
      }
}

describe('Test ticket service', () => {
    const ticketService = new TicketService;

    it('creates new ticket', async () => {
        await sendZendeskTicketCreationRequest(mockTicket);
        expect(mockedZendeskRequest).toHaveBeenCalled();
        expect(mockedZendeskRequest.mock.lastCall).toEqual([
            '/api/v2/tickets',
            'POST',
            { ticket: { ...mockTicket, tags: ['leadgen'] } }
        ]);
    });

    it('updates ticket (adds comment etc.)', async () => {
        const ticketId = 123;
        await sendZendeskTicketUpdateRequest({ tags: ['123'] }, ticketId);
        expect(mockedZendeskRequest).toHaveBeenCalled();
        expect(mockedZendeskRequest.mock.lastCall).toEqual([
            `/api/v2/tickets/${ticketId}`,
            'PUT',
            { ticket: { tags: ['123'] } }
        ]);
    });

    it('wraps links in text in <a> tags', () => {
        const sample1: string = "https://tiger-leadgen-fileupload.s3.amazonaws.com/-1001388/63a17123-1d74-4780-80b2-4c73f0f0e0a9.png";
        const expectedResultSample1: string = "<a href='https://tiger-leadgen-fileupload.s3.amazonaws.com/-1001388/63a17123-1d74-4780-80b2-4c73f0f0e0a9.png'>https://tiger-leadgen-fileupload.s3.amazonaws.com/-1001388/63a17123-1d74-4780-80b2-4c73f0f0e0a9.png</a>";
        const sample2: string = "www.google.com";
        const expectedResultSample2: string = "<a href='https://tiger-leadgen-fileupload.s3.amazonaws.com/-1001388/63a17123-1d74-4780-80b2-4c73f0f0e0a9.png'>https://tiger-leadgen-fileupload.s3.amazonaws.com/-1001388/63a17123-1d74-4780-80b2-4c73f0f0e0a9.png</a>";
        const sample3: string = "google.com";
        const expectedResultSample3: string = "<a href='https://tiger-leadgen-fileupload.s3.amazonaws.com/-1001388/63a17123-1d74-4780-80b2-4c73f0f0e0a9.png'>https://tiger-leadgen-fileupload.s3.amazonaws.com/-1001388/63a17123-1d74-4780-80b2-4c73f0f0e0a9.png</a>";
        const sample4: string = "http://google.com";
        const expectedResultSample4: string = "<a href='https://tiger-leadgen-fileupload.s3.amazonaws.com/-1001388/63a17123-1d74-4780-80b2-4c73f0f0e0a9.png'>https://tiger-leadgen-fileupload.s3.amazonaws.com/-1001388/63a17123-1d74-4780-80b2-4c73f0f0e0a9.png</a>";

        const sampleTextWithoutLink: string = 'link link link. link linklinklink <div> \n \r \r <a>'
       
        expect(makeLinksClickable(sample1)).toEqual(expectedResultSample1);
        expect(makeLinksClickable(sample2 )).toEqual(expectedResultSample1);
        expect(makeLinksClickable(sample1)).toEqual(expectedResultSample1);
        expect(makeLinksClickable(sample1)).toEqual(expectedResultSample1);
        expect(makeLinksClickable(sampleTextWithoutLink)).toEqual(sampleTextWithoutLink);
    });

    it('generates ticket body from leadgen form content', async () => {
        //snapshot of expected ticket body - has to be regenerated if ticket body changes will be introduced
        //if this test fails you can simply replace the below string with the 'received' value returned by jest 
        //of course you should first validate if the error is thrown because of the planned changes, not a bug :)
        const expectedTicketBody = "<h3>Ticket submitted via Support Assistant</h3><br/><h4>Flow answers</h4><br/>&emsp;<strong>testQuestionFromQuestionnaire</strong>: testAnswer<br/><br/><h4>Leadgen form content</h4><br/>&emsp;<strong>Please provide YOUR email</strong>: <span>testAnswer</span><br/>";

        const ticketBody = ticketService.generateTicketBody(testLeadGenContent);
        expect(ticketBody).toEqual(expectedTicketBody);
    });

    it('creates ticket on Zendesk from leadgen form', async () => {
        await ticketService.createGeneralTicket(testLeadGenContent);
        expect(mockedZendeskRequest).toHaveBeenCalled();
        console.log(mockedZendeskRequest.mock.lastCall)
    });
});
