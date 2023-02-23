import getNewTickets from "../src/services/zendesk/getNewTicketsService";
import makeZendeskRequest from "../src/services/zendesk/authenticationService";
import filterTicketsByKeyword from "../src/services/zendesk/filterTicketsByKeyword";

jest.mock('../src/services/zendesk/getNewTicketsService');
const ticketsArray = [
    {
      url: 'https://grzegorzabchelp.zendesk.com/api/v2/tickets/4.json',
      id: 4,
      created_at: '2022-05-26T07:58:12Z',
      updated_at: '2022-05-26T07:58:12Z',
      subject: 'access',
      description: 'access'

    },
    {
      url: 'https://grzegorzabchelp.zendesk.com/api/v2/tickets/3.json',
      id: 3,
      created_at: '2022-05-26T07:56:27Z',
      updated_at: '2022-05-26T07:56:27Z',
      subject: 'sql',
      description: 'sql1'
    },
    {
      url: 'https://grzegorzabchelp.zendesk.com/api/v2/tickets/2.json',
      id: 2,
      created_at: '2022-05-26T07:55:13Z',
      updated_at: '2022-05-26T07:55:13Z',
      subject: 'test1',
      description: 'test1'

    },
    {
      url: 'https://grzegorzabchelp.zendesk.com/api/v2/tickets/1.json',
      id: 1,
      created_at: '2022-05-26T07:51:16Z',
      updated_at: '2022-05-26T07:51:16Z',
      subject: 'Sample ticket: Meet the ticket',
      description: 'Hi there,\n' +
        '\n' +
        "I’m sending an email because I’m having a problem setting up your new product. Can you help me troubleshoot?\n" +
        '\n' +
        'Thanks,\n' +
        ' The Customer\n' +
        '\n'
    }
  ]

  const ticketsArrayoneL1 = [
    {
      url: 'https://grzegorzabchelp.zendesk.com/api/v2/tickets/4.json',
      id: 4,
      created_at: '2022-05-26T07:58:12Z',
      updated_at: '2022-05-26T07:58:12Z',
      subject: 'access',
      description: 'access'
    }]

    const expectedArrayoneL1 = [
{
      url: 'https://grzegorzabchelp.zendesk.com/api/v2/tickets/4.json',
      id: 4,
      created_at: '2022-05-26T07:58:12Z',
      updated_at: '2022-05-26T07:58:12Z',
      subject: 'access',
      description: 'access',
      level: 'L1'

}
    ]

const expectedArray = [
  {
    url: 'https://grzegorzabchelp.zendesk.com/api/v2/tickets/4.json',
    id: 4,
    created_at: '2022-05-26T07:58:12Z',
    updated_at: '2022-05-26T07:58:12Z',
    subject: 'access',
    description: 'access',
    level: 'L1'
  },
  {
    url: 'https://grzegorzabchelp.zendesk.com/api/v2/tickets/3.json',
    id: 3,
    created_at: '2022-05-26T07:56:27Z',
    updated_at: '2022-05-26T07:56:27Z',
    subject: 'sql',
    description: 'sql1',
    level: 'L2'
  },
  {
    url: 'https://grzegorzabchelp.zendesk.com/api/v2/tickets/2.json',
    id: 2,
    created_at: '2022-05-26T07:55:13Z',
    updated_at: '2022-05-26T07:55:13Z',
    subject: 'test1',
    description: 'test1',
    level: 'other'
  },
  {
    url: 'https://grzegorzabchelp.zendesk.com/api/v2/tickets/1.json',
    id: 1,
    created_at: '2022-05-26T07:51:16Z',
    updated_at: '2022-05-26T07:51:16Z',
    subject: 'Sample ticket: Meet the ticket',
    description: 'Hi there,\n' +
      '\n' +
      "I’m sending an email because I’m having a problem setting up your new product. Can you help me troubleshoot?\n" +
      '\n' +
      'Thanks,\n' +
      ' The Customer\n' +
      '\n',
    level: 'other'
  }
]

describe('Test filterTicketsByKeyword service', () => { 
   
    it('returns new tickets from the recent tickets', async () => {
       expect(await filterTicketsByKeyword(() => ticketsArray)).toEqual(expectedArray);
    });

   it('if there are no new tickets - nothing is returned', async () => {
      expect(await filterTicketsByKeyword(() => [])).toEqual([]);
    });
    
    it('one L1 ticket', async () => {
     expect(await filterTicketsByKeyword(() => ticketsArrayoneL1)).toEqual(expectedArrayoneL1);
   });
  });