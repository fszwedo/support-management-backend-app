import 'dotenv/config';
import makeZendeskRequest from './src/services/authenticationService.js'


for (let i = 0; i < 10; i++) {
    makeZendeskRequest('/api/v2/tickets', 'POST', {
        "ticket": {
            "comment": {
                "body": `this is ticket ${i+1}`
            },
            "priority": "urgent",
            "subject": `this is ticket ${i+1}`
        }
    })
}

