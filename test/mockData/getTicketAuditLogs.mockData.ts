import { TICKET_CUSTOM_FIELDS } from "../../src/CONSTANTS";

export const ticketAuditsResponseMockData = {
    audits: [
        {
            id: 123,
            ticket_id: 1,
            created_at: '2023-05-29T10:58:47Z',
            author_id: 1,
            events: [{
                id: 16014667317777,
                type: 'Change',
                value: '2',
                field_name: TICKET_CUSTOM_FIELDS.TIME_SPENT.toString(),
                previous_value: '1'
            },
            {
                id: 16014667317649,
                type: 'Change',
                value: '32103',
                field_name: TICKET_CUSTOM_FIELDS.TOTAL_TIME_SPENT.toString(),
                previous_value: '31203'
            }]
        },
        {
            id: 321,
            ticket_id: 1,
            created_at: '2023-05-27T10:49:01Z',
            author_id: 1,
            events: [
                {
                    id: 16014667317777,
                    type: 'Change',
                    value: '1',
                    field_name: TICKET_CUSTOM_FIELDS.TIME_SPENT.toString(),
                    previous_value: '0'
                },
                {
                    id: 16014667317649,
                    type: 'Change',
                    value: '32103',
                    field_name: TICKET_CUSTOM_FIELDS.TOTAL_TIME_SPENT.toString(),
                    previous_value: '31203'
                },
            ]
        }
    ],
    before_cursor: '1234'
}

export const ticketAuditsResponseCursorMockData = {
    audits: [
        {
            id: 123,
            ticket_id: 1,
            created_at: '2023-04-29T10:58:47Z',
            author_id: 1,
            events: [{
                id: 16014667317777,
                type: 'Change',
                value: '2',
                field_name: TICKET_CUSTOM_FIELDS.TIME_SPENT.toString(),
                previous_value: '1'
            },
            {
                id: 16014667317649,
                type: 'Change',
                value: '32103',
                field_name: TICKET_CUSTOM_FIELDS.TOTAL_TIME_SPENT.toString(),
                previous_value: '31203'
            }]
        }
    ],
    before_cursor: '12432134'
}