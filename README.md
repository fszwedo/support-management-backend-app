# zendesk-ticket-management
Application to manage the tickets in the Zendesk ticketing system - the main goal is to establish the automatic ticket assignment procedure

## General work principles
- application gets the list of all unassigned tickets
- application gets the list of all agents
- application gets the agent availability sheet from the exposed Sharepoint Excel file
- application stores the information about the last assignment timestamp for each agent
- application assigns the ticket to the agent with the oldest assignment timestamp from the agents who are available at the moment (based on the availability sheet)
- application exposes the logs in a txt file (optional)


## Application logic/requirements
# UI
- there is a control panel with authentication based on Zoovu SSO
- support team members have agent role and can
    - preview the shift rota
    - propose changes to the shift rota (only for himself)
    - see the shift rota changelog
- support team lead has admin role and can
    - preview the shift rota
    - change the shift rota entries (days, working hours) per person
    - accept proposed shift rota changes
# backend
- application assigns the tickets to the agents according to the established shift rota
- application manages the ticket load in daily/weekly distribution
- application can receive the data from the Zoovu Support Assistant and create a ticket based on the content (apply correct ticket fields, tags etc.)
- application stores the usage data (logs) in internal csv file
    - ticket assignment action with timestamp
    - ticket from the assistant creation timestamp and subject
- application can send followup messages based on the tags from the open tickets
    - if the tag is added application adds an internal note/reminder


