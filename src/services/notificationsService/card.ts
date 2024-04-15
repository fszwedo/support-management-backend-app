import { TeamsNotificationRequest } from "./notificationsService";

// https://learn.microsoft.com/en-us/adaptive-cards/authoring-cards/getting-started

export const createCard = (request: TeamsNotificationRequest) => {
  const { ticketId, agentName, subject, message, from } = request;
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
                text: "<at>Michał Markiewicz</at>",
                mentioned: {
                  id: "michal.markiewicz@zoovu.com",
                  name: "Michał Markiewicz",
                },
              },
            ],
          },
          body: [
            {
              type: "TextBlock",
              weight: "lighter",
              text: "Update: New Comment (Agent is OOO), FYI <at>Michał Markiewicz</at>",
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
