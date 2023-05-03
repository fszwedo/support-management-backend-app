import getTicketsToReassign from "../services/zendesk/getTicketsToReassign"
import getAgentsInGroup from "../services/zendesk/getAgentsInGroup";

export default async (logger?) => {
    //get tickets assigned to a group (group_id not null) but not assigned to an agent
    const ticketsToReassign = await getTicketsToReassign();

    //for each extracted ticket        
    ticketsToReassign.forEach(ticket => {
        //get agents assigned to this ticket's group
        const agentsInTicketsGroup = getAgentsInGroup(ticket.group_id);

        //check who's available for ticket assignment
        
    })

        //select the agent that should be assigned (group-specific queue)

        //generate a comment with info
            //who dispatched the reassignment operation (get this from /api/v2/tickets/3/audits, event where assignee_id was set to null)
            //what group was selected
            //who was selected to be assigned by the app
            //some additional info (that in case of doubts the agents should discuss the case, alternatively contact overwatch/manager)

        //assign the ticket to the selected agent

        //if no SME is available --> assign to general group, back to the agent that dispatched the operation, leave a comment that no SME is available and initial agent should handle the investigation
}