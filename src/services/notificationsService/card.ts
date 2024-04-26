import { agents } from "../agents";
import { TeamsNotificationRequest } from "./notificationsService";

// https://learn.microsoft.com/en-us/adaptive-cards/authoring-cards/getting-started

export const createCard = (request: TeamsNotificationRequest) => {
  const { ticketId, agentName, subject, message, from, agentToBeNotified } = request;
  const agent = agents.find((agent) => agent.shiftRotaName === agentToBeNotified);

  if (!agent) {
    console.log(`Cannot find ${agentToBeNotified} in agents.ts`);
  }

  return {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        contentUrl: null,
        content: {
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.2",
          msteams: {
            entities: [
              {
                type: "mention",
                text: `<at>${agent.msTeamsName}</at>`,
                mentioned: {
                  id: agent.msTeamsEmail,
                  name: agent.msTeamsName,
                },
              },
            ],
          },
          body: [
            {
              type: "TextBlock",
              weight: "lighter",
              text: `Update: New Comment (Agent is OOO), FYI <at>${agent.msTeamsName}</at>`,
              size: "small",
              color: "light",
            },
            {
              type: "TextBlock",
              weight: "Bolder",
              size: "large",
              text: subject,
            },
            {
              type: "TextBlock",
              text: `**Agent**: ${agentName}, **Commenter**: ${from}`,
            },
          ],
          actions: [
            {
              type: "Action.OpenUrl",
              title: "Go to ticket",
              url: `https://zoovu.zendesk.com/agent/tickets/${ticketId}`,
            },
            {
              type: "Action.ShowCard",
              title: "Show message",
              card: {
                type: "AdaptiveCard",
                body: [
                  {
                    type: "TextBlock",
                    text: message,
                    wrap: true,
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };
};
