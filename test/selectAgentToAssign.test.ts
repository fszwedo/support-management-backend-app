import selectAgentToAssign from "../src/services/zendesk/selectAgentToAssign";

const testShiftRota = 
    {
      date: '22-01-21',
      agents: [ 'Shehroze', 'Phil', 'Kate', 'Hasan', 'Greg', 'Konrad' ],
      hours: [ '8-16', '', '14-22', '8-14', '8-16', '8-16' ],
    }
  
const mockLastAssignedId = () => {return {agentId: '1'}};

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

//allow jest to use fake timers
jest.useFakeTimers();

describe('Test selectAgentToAssign service', () => {   

    //Konrad was already assigned - ticket assignment should start with Greg
    it('returns agent who is working at the current hour', async() => {
        jest.setSystemTime(new Date('2021-01-21 13:00').getTime());
        expect(await selectAgentToAssign(testAgentList, mockLastAssignedId, testShiftRota)).toEqual([2, 'Greg']);
    });

    // //we assign the first ticket to Greg, then expect shehroze to be assigned
    it('if two agents work at the same time - returns agent who was not assigned to the previous ticket', async() => {
        const arr = await selectAgentToAssign(testAgentList, mockLastAssignedId, testShiftRota);
        expect(await selectAgentToAssign(testAgentList, () => {return {agentId: arr[0]}}, testShiftRota)).toEqual([3, 'Shehroze']);
    });    

    it('if there are no agents working - returns undefined', async() => {
        jest.setSystemTime(new Date('2021-01-21 00:45').getTime());
        expect(await selectAgentToAssign(testAgentList, mockLastAssignedId, testShiftRota)).toEqual([undefined, undefined]);
    });

    it('stops assigning tickets to agents 30 minutes before the shift ends', async() => {
        jest.setSystemTime(new Date('2021-01-21 15:30').getTime());
        expect(await selectAgentToAssign(testAgentList, mockLastAssignedId, testShiftRota)).toEqual([5, 'Kate']);
    });

    //the below is to be enabled once the selectAgentToAssign funtion will be cleared out of all the dumb workrounds for CET/UTC/daylight saving

  //   it('2nd shift agent is assigned with the tickets till the end of the shift', async() => {
  //     jest.setSystemTime(new Date('2021-01-21 21:59').getTime());
  //     expect(await selectAgentToAssign(testAgentList, mockLastAssignedId, testShiftRota)).toEqual([5, 'Kate']);
  // });
});
