import filterTicketsByKeyword from '../src/services/zendesk/filterTicketsByKeyword';

async function filter() {
    let results:any = await filterTicketsByKeyword(() => {return ticketsArray});
    //console.log(results);
}

filter();

const ticketsArray = [
    {
      url: 'https://grzegorzabchelp.zendesk.com/api/v2/tickets/4.json',
      id: 4,
      created_at: '2022-05-26T07:58:12Z',
      updated_at: '2022-05-26T07:58:12Z',
      subject: 'Semantic Studio switch projects switching issue.',
      description: 'Team,     I am no longer able to switch between projects in Semantic Studio by typing in the project name at the top of the screen.  When I try to enter any text I receive a note that says “No Results.”  This is happening for multiple members of the solutions team.  The only known work around is to use the “Accounts” button in the left navigation panel.   Let me know if any other information is needed. '
    },
    {
      url: 'https://grzegorzabchelp.zendesk.com/api/v2/tickets/3.json',
      id: 3,
      created_at: '2022-05-26T07:56:27Z',
      updated_at: '2022-05-26T07:56:27Z',
      subject: 'Slider Question ExD',
      description: 'Hi Team,Customer: XXXLutz // Möbelix Theme: Möbelix Theme (New 2023) Issue: We sometimes use the slider question for price question but when we use it, the “Next button” does not show when the slider is activated. Next Button should only appear once an answer is selected If you have any questions please refer Erik.'
    },
    {
      url: 'https://grzegorzabchelp.zendesk.com/api/v2/tickets/2.json',
      id: 2,
      created_at: '2022-05-26T07:55:13Z',
      updated_at: '2022-05-26T07:55:13Z',
      subject: 'customer statistics report',
      description: 'Hi,     Can you please run a report with all of the active accounts on tiger and barracuda and include the following:     Account name  Number of starts  Revenue referred  Number of leads generated  SFDC ID     For the last 12 months (summarized by month):  Count of assistant edits  Count of total assistants  Count of assistant publish events  Number of logins into the account that are not by a zoovu employee     If any of these statistics are not available you can skip     It would be great this can be provided by morning US time.     Thanks,  -Andrew'

    },
    {
      url: 'https://grzegorzabchelp.zendesk.com/api/v2/tickets/1.json',
      id: 1,
      created_at: '2022-05-26T07:51:16Z',
      updated_at: '2022-05-26T07:51:16Z',
      subject: 'Straumann - Jumpy Configurator Behaviour',
      description: "Hi,  Straumann have integrated one of the configurators into their test environment. We've spotted that sometimes, when selecting the 'Add to Cart' button, then it jumps back to the top of the page. Auto-scroll is not enabled here, nor do I believe it works for configurators. Note, the behaviour is not always replicable, so may need a few navigation/clicks before it is seen.  Can we see if it is our configurator or website related issue?  Test Link - https://test-shop.straumann.com/us/en_us/zoovu  Demo of issue - screencast-bpconcjcammlapcogcnnelfmaeghhagj-2023.02.23-12_08_25 (online-video-cutter.com) (1).mp4  For add to cart to work, you must be logged in. Please contact me on Teams for login details once ticket is assigned.  Thanks"
    },
    {
        url: 'https://grzegorzabchelp.zendesk.com/api/v2/tickets/1.json',
        id: 1,
        created_at: '2022-05-26T07:51:16Z',
        updated_at: '2022-05-26T07:51:16Z',
        subject: 'Sales Tracking - Customer Bergzeit',
        description: "Hi guys,  Could you please be so kind and check the Integration of Sales Tracking for Customer Bergzeit.  In the overview I see a very high spike in sales, which seems a bit odd to me – especially since starts have actually declined.     Customer: Bergzeit https://orca-admin.zoovu.com/accounts/3229  Assistant: Reporting of alle assistants"
      }
  ];