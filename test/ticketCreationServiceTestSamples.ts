import { leadgenFormContent } from '.../../models/leadgenModel';
import { TICKET_CUSTOM_FIELDS } from '../src/CONSTANTS';

//this file contains sample payloads from the support assistant:
//this assistant is located on Orca -> Support Internal account (id 3189) -> "Support" assistant
//you can acquire test samples by copying this assistant, connecting the webhook to e.g. webhook.site and sending a sample leadgen form

export const testGeneralLeadenContent: leadgenFormContent = {
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
};

export const testAccessLeadenContent: leadgenFormContent = {
    "advisorName": "Support",
    "submittedFormData": [
        {
            "questionId": 1589620,
            "questionText": "Please provide YOUR email",
            "answers": [
                "test@test.com"
            ]
        },
        {
            "questionId": 1589621,
            "questionText": "Account link",
            "answers": [
                "test.account"
            ]
        },
        {
            "questionId": 1589622,
            "questionText": "Email of the user that should get access",
            "answers": [
                "testuser@test.com"
            ]
        },
        {
            "questionId": 3186325,
            "questionText": "Please provide an email of <strong>your line manager</strong> to approve your request",
            "answers": [
                "testapprover@test.com"
            ]
        },
        {
            "questionId": 1589623,
            "questionText": "Additional information",
            "answers": [
                "test additional info!"
            ]
        },
        {
            "questionId": 3186326,
            "questionText": "Please, find more information on account access provision in Confluence",
            "answers": []
        }
    ],
    "questionsFlow": [
        {
            "questionId": 1589615,
            "questionText": "How can we help?",
            "answers": [
                "Account access"
            ]
        },
        {
            "questionId": 1589625,
            "questionText": "To which environment do you want to add user?",
            "answers": [
                "Orca"
            ]
        }
    ],
    "recommendations": []
};

export const expectedAccessFollowUpContent = [
    "/api/v2/tickets/123",
    "PUT",
    {
        "ticket": {
            "comment": {
                "html_body": "Hello testapprover@test.com! <br/>User test@test.com reported that you are his/hers line manager. <strong>If that is correct can you please approve this account access request?</strong><br/><br/>Requesting user: test@test.com<br/>Request: assign testuser@test.com to account test.account<br/><br/>The approval is required by the Zoovu access security policies. If you want to know more please visit <a href=\"https://confluence.smartassistant.com/display/ZS/Zoovu+Platform+account+access\">this page</a><br/>In case you have any questions - please respond to this email.",
                "public": true,
            },
            "custom_fields": [
                {
                    "id": TICKET_CUSTOM_FIELDS.LEVEL,
                    "value": "l1",
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.SOURCE,
                    "value": "internal",
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.CATEGORY,
                    "value": [
                        "account_accesses",
                    ],
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.PLATFORM,
                    "value": [
                        "orca",
                    ],
                },],
            "email_ccs": [
                {
                    "action": "put",
                    "user_email": "testapprover@test.com",
                    "user_name": "testapprover@test.com",
                },],
            "type": "task",
        },
    },
];

export const testAdmintoolLeadenContent: leadgenFormContent = {
    "advisorName": "Support",
    "submittedFormData": [
        {
            "questionId": 3186417,
            "questionText": "Please provide YOUR email",
            "answers": [
                "requester@test.com"
            ]
        },
        {
            "questionId": 3186418,
            "questionText": "Please provide an email of your line manager",
            "answers": [
                "manager@test.com"
            ]
        },
        {
            "questionId": 3186419,
            "questionText": "Additional information",
            "answers": [
                "I need admintool access!"
            ]
        },
        {
            "questionId": 3186469,
            "questionText": "Please, find more information on admintool access provision in Confluence",
            "answers": []
        }
    ],
    "questionsFlow": [
        {
            "questionId": 1589615,
            "questionText": "How can we help?",
            "answers": [
                "Admintool access"
            ]
        },
        {
            "questionId": 3186413,
            "questionText": "To which environment do you need admin access?",
            "answers": [
                "Orca"
            ]
        }
    ],
    "recommendations": []
};

export const expectedAdminToolAccessRequestContent = [
    "/api/v2/tickets",
    "POST",
    {
        "ticket": {
            "comment": {
                "html_body": "<h3>Ticket submitted via Support Assistant</h3><br/><h4>Flow answers</h4><br/>&emsp;<strong>How can we help?</strong>: Admintool access<br/>&emsp;<strong>To which environment do you need admin access?</strong>: Orca<br/><br/><h4>Leadgen form content</h4><br/>&emsp;<strong>Please provide YOUR email</strong>: <span>requester@test.com</span><br/>&emsp;<strong>Please provide an email of your line manager</strong>: <span>manager@test.com</span><br/>&emsp;<strong>Additional information</strong>: <span>I need admintool access!</span><br/><br/><br/>As required by the access security policy the manager is CCed in this ticket.",
            },
            "custom_fields": [
                {
                    "id": TICKET_CUSTOM_FIELDS.LEVEL,
                    "value": "l1",
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.SOURCE,
                    "value": "internal",
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.CATEGORY,
                    "value": [
                        "admin_tool_access",
                    ],
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.PLATFORM,
                    "value": [
                        "orca",
                    ],
                },],
            "email_ccs": [
                {
                    "action": "put",
                    "user_email": "manager@test.com",
                    "user_name": "manager@test.com",
                },
            ],
            "requester": {
                "email": "requester@test.com",
                "name": "requester@test.com",
            },
            "subject": "Admintool access",
            "tags": [
                "leadgen",
            ],
            "type": "task",
        },
    },
];

export const testAccountCreationLeadenContent: leadgenFormContent = {
    "advisorName": "Support",
    "submittedFormData": [
      {
        "questionId": 1589632,
        "questionText": "Please provide YOUR email",
        "answers": [
          "requester@test.com"
        ]
      },
      {
        "questionId": 1589627,
        "questionText": "Please provide the link to the Salesforce account",
        "answers": [
          "salesforce.com/test"
        ]
      },
      {
        "questionId": 1589628,
        "questionText": "Zoovu account owner first and last name",
        "answers": [
          "Test"
        ]
      },
      {
        "questionId": 1589629,
        "questionText": "Zoovu account owner email",
        "answers": [
          "test@test.com"
        ]
      },
      {
        "questionId": 1589630,
        "questionText": "Number of seats",
        "answers": [
          "1"
        ]
      },
      {
        "questionId": 1589631,
        "questionText": "What's the support tier of this customer (depending on the contract, e.g. self-service or premium))",
        "answers": [
          "self-service"
        ]
      },
      {
        "questionId": 3186497,
        "questionText": "Should the zoovu branding be removed from the assistants ?",
        "answers": [
          "YES"
        ]
      },
      {
        "questionId": 1589633,
        "questionText": "Additional information",
        "answers": [
          "Create an account!"
        ]
      },
      {
        "questionId": 3186505,
        "questionText": "Please, find more information on account creation in Confluence",
        "answers": []
      }
    ],
    "questionsFlow": [
      {
        "questionId": 1589615,
        "questionText": "How can we help?",
        "answers": [
          "Account creation"
        ]
      },
      {
        "questionId": 1589659,
        "questionText": "Where do you want to create account",
        "answers": [
          "Orca"
        ]
      }
    ],
    "recommendations": []
  };

export const expectedAccountCreationRequestContent = [
    "/api/v2/tickets",
    "POST",
    {
        "ticket": {
            "comment": {
                "html_body": "<h3>Ticket submitted via Support Assistant</h3><br/><h4>Flow answers</h4><br/>&emsp;<strong>How can we help?</strong>: Account creation<br/>&emsp;<strong>Where do you want to create account</strong>: Orca<br/><br/><h4>Leadgen form content</h4><br/>&emsp;<strong>Please provide YOUR email</strong>: <span>requester@test.com</span><br/>&emsp;<strong>Please provide the link to the Salesforce account</strong>: <span><a href='http://salesforce.com/test'>salesforce.com/test</a></span><br/>&emsp;<strong>Zoovu account owner first and last name</strong>: <span>Test</span><br/>&emsp;<strong>Zoovu account owner email</strong>: <span>test@test.com</span><br/>&emsp;<strong>Number of seats</strong>: <span>1</span><br/>&emsp;<strong>What's the support tier of this customer (depending on the contract, e.g. self-service or premium))</strong>: <span>self-service</span><br/>&emsp;<strong>Should the zoovu branding be removed from the assistants ?</strong>: <span>YES</span><br/>&emsp;<strong>Additional information</strong>: <span>Create an account!</span><br/>" },
            "custom_fields": [
                {
                    "id": TICKET_CUSTOM_FIELDS.LEVEL,
                    "value": "l1",
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.SOURCE,
                    "value": "internal",
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.CATEGORY,
                    "value": [
                        "account_-_creation",
                    ],
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.PLATFORM,
                    "value": [
                        "orca",
                    ],
                },],
            "requester": {
                "email": "requester@test.com",
                "name": "requester@test.com",
            },
            "subject": "Account creation",
            "tags": [
                "leadgen",
            ],
            "type": "task",
        },
    },
];

export const testBugReportContent: leadgenFormContent = {
    "advisorName": "Support",
    "submittedFormData": [
      {
        "questionId": 1589645,
        "questionText": "Please provide YOUR email",
        "answers": [
          "requester@test.com"
        ]
      },
      {
        "questionId": 1589641,
        "questionText": "Account link",
        "answers": [
          "https://orca-admin.zoovu.com/accounts/3189"
        ]
      },
      {
        "questionId": 1589642,
        "questionText": "Assistant name",
        "answers": [
          "Support"
        ]
      },
      {
        "questionId": 250119038,
        "questionText": "CD Epic link of the affected project",
        "answers": [
          "none"
        ]
      },
      {
        "questionId": 1589643,
        "questionText": "Reproduction path (e.g. which answers to select to see the bug e.g \"Q1A1 - Q2A3 -Q3A1A2\")",
        "answers": [
          "- go here\n- do this\n- see that"
        ]
      },
      {
        "questionId": 1589644,
        "questionText": "Problem description:",
        "answers": [
          "I have a major problem!"
        ]
      },
      {
        "questionId": 1589646,
        "questionText": "Screenshots of the issue",
        "answers": [
          "https://tiger-leadgen-fileupload.s3.amazonaws.com/-68698/eed0a288-a27c-4848-b7d4-7646832d806f.png"
        ]
      },
      {
        "questionId": 1620288,
        "questionText": "What's the urgency (if you have some deadlines for having this done - let us know)",
        "answers": [
          "super urgent"
        ]
      },
      {
        "questionId": 3187196,
        "questionText": "Choose the issue category",
        "answers": [
          "Experience designer"
        ]
      },
      {
        "questionId": 3187195,
        "questionText": "Please provide a fingerprint of an error (if applicable, explanation below)",
        "answers": [
          "none"
        ]
      },
      {
        "questionId": 3187398,
        "questionText": "Additional information",
        "answers": [
          "none"
        ]
      },
      {
        "questionId": 3187400,
        "questionText": "Please, find more information on finding FINGERPRINT in Confluence",
        "answers": []
      }
    ],
    "questionsFlow": [
      {
        "questionId": 1589615,
        "questionText": "How can we help?",
        "answers": [
          "Platform issue"
        ]
      },
      {
        "questionId": 1589637,
        "questionText": "On which environment is the account with problematic assistant located",
        "answers": [
          "Orca"
        ]
      },
      {
        "questionId": 1589638,
        "questionText": "How was the issue discovered",
        "answers": [
          "Internally (by you or your colleagues)"
        ]
      }
    ],
    "recommendations": []
  };

  export const expectedBugReportContent = [
    "/api/v2/tickets",
    "POST",
    {
        "ticket": {
            "comment": {
                "html_body": "<h3>Ticket submitted via Support Assistant</h3><br/><h4>Flow answers</h4><br/>&emsp;<strong>How can we help?</strong>: Platform issue<br/>&emsp;<strong>On which environment is the account with problematic assistant located</strong>: Orca<br/>&emsp;<strong>How was the issue discovered</strong>: Internally (by you or your colleagues)<br/><br/><h4>Leadgen form content</h4><br/>&emsp;<strong>Please provide YOUR email</strong>: <span>requester@test.com</span><br/>&emsp;<strong>Account link</strong>: <span><a href='https://orca-admin.zoovu.com/accounts/3189'>https://orca-admin.zoovu.com/accounts/3189</a></span><br/>&emsp;<strong>Assistant name</strong>: <span>Support</span><br/>&emsp;<strong>CD Epic link of the affected project</strong>: <span>none</span><br/>&emsp;<strong>Reproduction path (e.g. which answers to select to see the bug e.g \"Q1A1 - Q2A3 -Q3A1A2\")</strong>: <span><br/>&emsp;&emsp;- go here<br/>&emsp;&emsp;- do this<br/>&emsp;&emsp;- see that</span><br/>&emsp;<strong>Problem description:</strong>: <span>I have a major problem!</span><br/>&emsp;<strong>Screenshots of the issue</strong>: <span><a href='https://tiger-leadgen-fileupload.s3.amazonaws.com/-68698/eed0a288-a27c-4848-b7d4-7646832d806f.png'>https://tiger-leadgen-fileupload.s3.amazonaws.com/-68698/eed0a288-a27c-4848-b7d4-7646832d806f.png</a></span><br/>&emsp;<strong>What's the urgency (if you have some deadlines for having this done - let us know)</strong>: <span>super urgent</span><br/>&emsp;<strong>Choose the issue category</strong>: <span>Experience designer</span><br/>&emsp;<strong>Please provide a fingerprint of an error (if applicable, explanation below)</strong>: <span>none</span><br/>&emsp;<strong>Additional information</strong>: <span>none</span><br/>" },
            "custom_fields": [
                {
                    "id": TICKET_CUSTOM_FIELDS.SOURCE,
                    "value": "internal",
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.CATEGORY,
                    "value": [
                        "experience_designer",
                    ],
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.PLATFORM,
                    "value": [
                        "orca",
                    ],
                },],
            "requester": {
                "email": "requester@test.com",
                "name": "requester@test.com",
            },
            "subject": "experience designer problem report",
            "tags": [
                "leadgen",
            ],
            "type": "problem",
        },
    },
];

export const testReportingLeadgenContent: leadgenFormContent = {
    "advisorName": "Support",
    "submittedFormData": [
      {
        "questionId": 3187419,
        "questionText": "Please provide YOUR email",
        "answers": [
          "requester@test.com"
        ]
      },
      {
        "questionId": 3187428,
        "questionText": "Account link",
        "answers": [
          "test.link"
        ]
      },
      {
        "questionId": 3187429,
        "questionText": "Assistant name",
        "answers": [
          "test"
        ]
      },
      {
        "questionId": 3187431,
        "questionText": "Report period",
        "answers": [
          "today till tomorrow"
        ]
      },
      {
        "questionId": 3187430,
        "questionText": "Report description (what columns should be exported, what is the use-case for the data)",
        "answers": [
          "none"
        ]
      },
      {
        "questionId": 3187434,
        "questionText": "Please, find more information on reports in Confluence",
        "answers": []
      }
    ],
    "questionsFlow": [
      {
        "questionId": 1589615,
        "questionText": "How can we help?",
        "answers": [
          "Reporting"
        ]
      },
      {
        "questionId": 3187417,
        "questionText": "What is the customer's environment?",
        "answers": [
          "Orca"
        ]
      },
      {
        "questionId": 3237332,
        "questionText": "What would you like to request?",
        "answers": [
          "I would like to request a reporting data export"
        ]
      }
    ],
    "recommendations": []
  };

  export const expectedReportingRequestContent = [
    "/api/v2/tickets",
    "POST",
    {
        "ticket": {
            "comment": {
                "html_body": "<h3>Ticket submitted via Support Assistant</h3><br/><h4>Flow answers</h4><br/>&emsp;<strong>How can we help?</strong>: Reporting<br/>&emsp;<strong>What is the customer's environment?</strong>: Orca<br/>&emsp;<strong>What would you like to request?</strong>: I would like to request a reporting data export<br/><br/><h4>Leadgen form content</h4><br/>&emsp;<strong>Please provide YOUR email</strong>: <span>requester@test.com</span><br/>&emsp;<strong>Account link</strong>: <span><a href='http://test.link'>test.link</a></span><br/>&emsp;<strong>Assistant name</strong>: <span>test</span><br/>&emsp;<strong>Report period</strong>: <span>today till tomorrow</span><br/>&emsp;<strong>Report description (what columns should be exported, what is the use-case for the data)</strong>: <span>none</span><br/>" },
            "custom_fields": [
                {
                    "id": TICKET_CUSTOM_FIELDS.SOURCE,
                    "value": "internal",
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.CATEGORY,
                    "value": [
                        "sql_export",
                    ],
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.PLATFORM,
                    "value": [
                        "orca",
                    ],
                },],
            "requester": {
                "email": "requester@test.com",
                "name": "requester@test.com",
            },
            "subject": "Reporting export request",
            "tags": [
                "leadgen",
            ],
            "type": "task",
        },
    },
];

export const testFTPLeadgenContent: leadgenFormContent= {
    "advisorName": "Support",
    "submittedFormData": [
      {
        "questionId": 1589679,
        "questionText": "Please provide YOUR email",
        "answers": [
          "requester@test.com"
        ]
      },
      {
        "questionId": 1589675,
        "questionText": "Customer's name (Salesforce account name)",
        "answers": [
          "salesforcename"
        ]
      },
      {
        "questionId": 1589676,
        "questionText": "Will the customer send the input files to our FTP or are we getting them from their server?",
        "answers": [
          "send"
        ]
      },
      {
        "questionId": 1589678,
        "questionText": "Does the customer need to access the output files?",
        "answers": [
          "NO"
        ]
      },
      {
        "questionId": 1589677,
        "questionText": "If the customer sends the input files to our FTP, please provide customer name and email address:",
        "answers": [
          "-"
        ]
      },
      {
        "questionId": 3186947,
        "questionText": "Do you need access to the INPUT catalog for your personal email?",
        "answers": [
          "YES"
        ]
      },
      {
        "questionId": 1589680,
        "questionText": "Do you need access to the OUTPUT catalog for your personal email?",
        "answers": [
          "YES"
        ]
      },
      {
        "questionId": 3186950,
        "questionText": "Additional information",
        "answers": [
          "none"
        ]
      },
      {
        "questionId": 3186951,
        "questionText": "Please, find more information on FTP creation in Confluence",
        "answers": []
      }
    ],
    "questionsFlow": [
      {
        "questionId": 1589615,
        "questionText": "How can we help?",
        "answers": [
          "FTP"
        ]
      },
      {
        "questionId": 1589669,
        "questionText": "What do you need?",
        "answers": [
          "Create new FTP account"
        ]
      }
    ],
    "recommendations": []
  };

  export const expectedFTPRequestContent = [
    "/api/v2/tickets",
    "POST",
    {
        "ticket": {
            "comment": {
                "html_body": "<h3>Ticket submitted via Support Assistant</h3><br/><h4>Flow answers</h4><br/>&emsp;<strong>How can we help?</strong>: FTP<br/>&emsp;<strong>What do you need?</strong>: Create new FTP account<br/><br/><h4>Leadgen form content</h4><br/>&emsp;<strong>Please provide YOUR email</strong>: <span>requester@test.com</span><br/>&emsp;<strong>Customer's name (Salesforce account name)</strong>: <span>salesforcename</span><br/>&emsp;<strong>Will the customer send the input files to our FTP or are we getting them from their server?</strong>: <span>send</span><br/>&emsp;<strong>Does the customer need to access the output files?</strong>: <span>NO</span><br/>&emsp;<strong>If the customer sends the input files to our FTP, please provide customer name and email address:</strong>: <span>-</span><br/>&emsp;<strong>Do you need access to the INPUT catalog for your personal email?</strong>: <span>YES</span><br/>&emsp;<strong>Do you need access to the OUTPUT catalog for your personal email?</strong>: <span>YES</span><br/>&emsp;<strong>Additional information</strong>: <span>none</span><br/>" },
            "custom_fields": [
                {
                    "id": TICKET_CUSTOM_FIELDS.LEVEL,
                    "value": "l1",
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.SOURCE,
                    "value": "internal",
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.CATEGORY,
                    "value": [
                        "data_ftp",
                    ],
                },
                {
                    "id": TICKET_CUSTOM_FIELDS.PLATFORM,
                    "value": [
                        "not_platform_issue",
                    ],
                },],
            "requester": {
                "email": "requester@test.com",
                "name": "requester@test.com",
            },
            "subject": "Create new FTP account",
            "tags": [
                "leadgen",
            ],
            "type": "task",
        },
    },
];
