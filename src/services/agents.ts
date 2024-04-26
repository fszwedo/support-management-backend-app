interface Agent {
  shiftRotaName: string;
  msTeamsName: string;
  msTeamsEmail: string;
  team: "Conversation" | "Search";
}

export const agents: Agent[] = [
  {
    shiftRotaName: "Phil",
    msTeamsName: "Filip Szwedo",
    msTeamsEmail: "f.szwedo@zoovu.com",
    team: "Conversation",
  },
  {
    shiftRotaName: "Konrad",
    msTeamsName: "Konrad Molda",
    msTeamsEmail: "k.molda@zoovu.com",
    team: "Conversation",
  },
  {
    shiftRotaName: "Rajashree",
    msTeamsName: "Rajashree Chakraborty",
    msTeamsEmail: "r.chakraborty@zoovu.com",
    team: "Conversation",
  },
  {
    shiftRotaName: "Michal",
    msTeamsName: "Michał Markiewicz",
    msTeamsEmail: "michal.markiewicz@zoovu.com",
    team: "Conversation",
  },
  {
    shiftRotaName: "Oleksii",
    msTeamsName: "Oleksii Shanovskyi",
    msTeamsEmail: "oleksii.shanovskyi@zoovu.com",
    team: "Conversation",
  },
  {
    shiftRotaName: "Mateusz",
    msTeamsName: "Mateusz Kopko",
    msTeamsEmail: "mateusz.kopko@zoovu.com",
    team: "Conversation",
  },
  {
    shiftRotaName: "Karolina",
    msTeamsName: "Karolina Koślacz",
    msTeamsEmail: "k.koslacz@zoovu.com",
    team: "Conversation",
  },
  {
    shiftRotaName: "Jan",
    msTeamsName: "Jan Sójka",
    msTeamsEmail: "j.sojka@zoovu.com",
    team: "Search",
  },
  {
    shiftRotaName: "Abbie",
    msTeamsName: "Pui Yu Wu-Hartwig",
    msTeamsEmail: "p.wu-hartwig@zoovu.com",
    team: "Search",
  },
  {
    shiftRotaName: "Alexandra",
    msTeamsName: "Alex Anderson",
    msTeamsEmail: "a.anderson@zoovu.com",
    team: "Search",
  },
];
