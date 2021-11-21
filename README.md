# zendesk-ticket-management
Application to manage the tickets in the Zendesk ticketing system - the main goal is to establish the automatic ticket assignment procedure

## General work principles
- application gets the list of all unassigned tickets
- application gets the list of all agents
- application gets the agent availability sheet from the exposed Sharepoint Excel file
- application stores the information about the last assignment timestamp for each agent
- application assigns the ticket to the agent with the oldest assignment timestamp from the agents who are available at the moment (based on the availability sheet)
- application exposes the logs in a txt file (optional)
