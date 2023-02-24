import selectAgentToAssign from "../src/services/zendesk/selectAgentToAssign";

const testShiftRota =
{
  date: '22-01-21',
  agents: ['Shehroze', 'Phil', 'Kate', 'Hasan', 'Greg', 'Konrad'],
  hours: ['8-16', '', '14-22', '8-14', '8-10;11-16', '8-16'],
}

const mockLastAssignedId = () => { return { agentId: '1' } };
const mockLastAssignedIdL1 = () => { return { agentId: '2' } };
const mockLastAssignedIdOther = () => { return { agentId: '2' } };

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
  .setSystemTime(new Date('2021-01-21 13:00').getTime());

describe('Test selectAgentToAssign service', () => {

  //Konrad was already assigned - ticket assignment should start with Greg
  it('returns agent who is working at the current hour', async () => {
    jest.setSystemTime(new Date('2021-01-21 12:45').getTime());
    expect(await selectAgentToAssign(testAgentList, mockLastAssignedId, testShiftRota)).toEqual([2, 'Greg']);
  });

  // //we assign the first ticket to Greg, then expect shehroze to be assigned
  it('if two agents work at the same time - returns agent who was not assigned to the previous ticket', async () => {
    const arr = await selectAgentToAssign(testAgentList, mockLastAssignedId, testShiftRota);
    expect(await selectAgentToAssign(testAgentList, () => { return { agentId: arr[0] } }, testShiftRota)).toEqual([3, 'Shehroze']);
  });

  it('if there are no agents working - returns undefined', async () => {
    jest.setSystemTime(new Date('2021-01-21 00:45').getTime());
    expect(await selectAgentToAssign(testAgentList, mockLastAssignedId, testShiftRota)).toEqual([undefined, undefined]);
  });

  it('stops assigning tickets to agents 30 minutes before the shift ends', async () => {
    jest.setSystemTime(new Date('2021-01-21 16:30').getTime());
    expect(await selectAgentToAssign(testAgentList, mockLastAssignedId, testShiftRota)).toEqual([5, 'Kate']);
  });

  //Greg was already assigned to L1 - ticket assignment should start with Shehroze
  it('returns agent who is working at the current hour', async () => {
    jest.setSystemTime(new Date('2021-01-21 12:45').getTime());
    expect(await selectAgentToAssign(testAgentList, mockLastAssignedIdL1, testShiftRota, 'L1')).toEqual([3, 'Shehroze']);
  });

  //we assign the first L1 ticket to Shehroze, then expect Konrad to be assigned (because Kate is working 14-22)
  it('if two agents work at the same time - returns agent who was not assigned to the previous ticket', async () => {
    jest.setSystemTime(new Date('2021-01-21 12:45').getTime());
    const arr = await selectAgentToAssign(testAgentList, mockLastAssignedIdL1, testShiftRota, 'L1');
    expect(await selectAgentToAssign(testAgentList, () => { return { agentId: arr[0] } }, testShiftRota, 'L1')).toEqual([1, 'Konrad']);
  });

  //Greg was already assigned to other - ticket assignment should start with Shehroze
  it('returns agent who is working at the current hour', async () => {
    jest.setSystemTime(new Date('2021-01-21 12:45').getTime());
    expect(await selectAgentToAssign(testAgentList, mockLastAssignedIdOther, testShiftRota, 'L1')).toEqual([3, 'Shehroze']);
  });

  // //we assign the first other ticket to Shehroze, then expect Konrad to be assigned (because Kate is working 14-22)
  it('if two agents work at the same time - returns agent who was not assigned to the previous ticket', async () => {
    jest.setSystemTime(new Date('2021-01-21 12:45').getTime());
    const arr = await selectAgentToAssign(testAgentList, mockLastAssignedIdOther, testShiftRota, 'other');
    expect(await selectAgentToAssign(testAgentList, () => { return { agentId: arr[0] } }, testShiftRota, 'other')).toEqual([1, 'Konrad']);
  });

  it('if there are no agents working - returns undefined', async () => {
    jest.setSystemTime(new Date('2021-01-21 00:45').getTime());
    expect(await selectAgentToAssign(testAgentList, mockLastAssignedIdL1, testShiftRota)).toEqual([undefined, undefined]);
  });

  it('stops assigning tickets to agents 30 minutes before the shift ends', async () => {
    jest.setSystemTime(new Date('2021-01-21 16:30').getTime());
    expect(await selectAgentToAssign(testAgentList, mockLastAssignedIdL1, testShiftRota)).toEqual([5, 'Kate']);
  });

  it('if there are no agents working - returns undefined', async () => {
    jest.setSystemTime(new Date('2021-01-21 00:45').getTime());
    expect(await selectAgentToAssign(testAgentList, mockLastAssignedIdOther, testShiftRota)).toEqual([undefined, undefined]);
  });

  it('stops assigning tickets to agents 30 minutes before the shift ends', async () => {
    jest.setSystemTime(new Date('2021-01-21 16:30').getTime());
    expect(await selectAgentToAssign(testAgentList, mockLastAssignedIdOther, testShiftRota)).toEqual([5, 'Kate']);
  });

});
