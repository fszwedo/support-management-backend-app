import getNewTickets from "../src/services/zendesk/getNewTicketsService";
import makeZendeskRequest from "../src/services/zendesk/authenticationService";

jest.mock('../src/services/zendesk/authenticationService');
const ticketsArray = [{
    "assignee_id": 235323,
    "status": "open",
    "tags": [
        "enterprise",
        "other_tag"
    ],
    "type": "incident",
    "updated_at": "2011-05-05T10:38:52Z",
    "url": "https://company.zendesk.com/api/v2/tickets/35436.json",
    "via": {
        "channel": "web"
    }
},
{
    "assignee_id": 235323,
    "status": "new",
    "tags": [
        "enterprise",
        "other_tag"
    ],
    "type": "incident",
    "updated_at": "2011-05-05T10:38:52Z",
    "url": "https://company.zendesk.com/api/v2/tickets/35436.json",
    "via": {
        "channel": "web"
    }
},
{
    "assignee_id": 235323,
    "status": "closed",
    "tags": [
        "enterprise",
        "other_tag"
    ],
    "type": "incident",
    "updated_at": "2011-05-05T10:38:52Z",
    "url": "https://company.zendesk.com/api/v2/tickets/35436.json",
    "via": {
        "channel": "web"
    }
},
]

const ticketsArrayWithoutNew = [{
    "status": "open",
},
{
    "status": "solved",
},
{
    "status": "closed",
},
]

const expectedTicketsArray = [
    {
        "assignee_id": 235323,
        "status": "new",
        "tags": [
            "enterprise",
            "other_tag"
        ],
        "type": "incident",
        "updated_at": "2011-05-05T10:38:52Z",
        "url": "https://company.zendesk.com/api/v2/tickets/35436.json",
        "via": {
            "channel": "web"
        }
    }
]

describe('Test getNewTickets service', () => {
    makeZendeskRequest.mockResolvedValueOnce({
        tickets: ticketsArray
    })
    .mockResolvedValueOnce({
        tickets: ticketsArrayWithoutNew
    })
    
    it('returns new tickets from the recent tickets', async () => {
        expect(await getNewTickets(makeZendeskRequest)).toEqual(expectedTicketsArray);
    });

    it('if there are no new tickets - nothing is returned', async () => {
        expect(await getNewTickets(makeZendeskRequest)).toEqual([]);
    });
});

