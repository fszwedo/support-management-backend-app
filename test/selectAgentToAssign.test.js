import selectAgentToAssign from "../src/services/zendesk/selectAgentToAssign";

const testShiftRota = [
    {
      date: 'Fri Jan 21 2022 00:00:00 GMT+0100 (Central European Standard Time)',
      agents: [ 'Shehroze', 'Phil', 'Kate', 'Hasan', 'Greg', 'Konrad' ],
      hours: [ '8-16', '', '14-22', '8-14', '8-16', '8-16' ],
    }
  ]

  
const testLastAssignedId = '1';

const testAgentList = [
    {
        id: 1,
        name: 'Konrad',
        email: 'k.molda@zoovu.com',
        role: 'admin',
      },
      {
        id: 2,
        name: 'Greg',
        email: 'test@test.com',
        role: 'admin',
      },
      {
        id: 3,
        name: 'Shehroze',
        email: 'test@test.com',
        role: 'admin',
      },
      {
        id: 5,
        name: 'Kate',
        email: 'test@test.com',
        role: 'admin',
      },
      {
        id: 4,
        name: 'RANDOM',
        email: 'test@test.com',
        role: 'admin',
      }
]

jest
  .useFakeTimers()
  .setSystemTime(new Date('2021-01-21 13:45').getTime());

describe('Test selectAgentToAssign service', () => {    

    //Konrad was already assigned - ticket assignment should start with Greg
    it('returns agent who is working at the current hour', () => {
        expect(selectAgentToAssign(testAgentList, testLastAssignedId, testShiftRota)).toEqual([2, 'Greg']);
    });

    //we assign the first ticket to Greg, then expect shehroze to be assigned
    it('if two agents work at the same time - returns agent who was not assigned to the previous ticket', () => {
        const [id, agent] = selectAgentToAssign(testAgentList, testLastAssignedId, testShiftRota)
        expect(selectAgentToAssign(testAgentList, id, testShiftRota)).toEqual([3, 'Shehroze']);
    });    

    it('if there are no agents working - returns undefined', () => {
        jest.setSystemTime(new Date('2021-01-21 23:45').getTime());
        expect(selectAgentToAssign(testAgentList, testLastAssignedId, testShiftRota)).toEqual([undefined, undefined]);
    });

    it('stops assigning tickets to agents 30 minutes before the shift ends', () => {
        jest.setSystemTime(new Date('2021-01-21 20:25').getTime());
        expect(selectAgentToAssign(testAgentList, testLastAssignedId, testShiftRota)).toEqual([5, 'Kate']);
    });

    
});
