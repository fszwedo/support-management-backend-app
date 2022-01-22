import getAgents from "../src/services/zendesk/getAgentsService.js";

const userInfo = [{
    "id": 223443,
    "name": "Johnny Agent"
},
{
    "id": 8678530,
    "name": "James A. Rosen"
}
]

const mockZendeskRequest = () => {
    return {
        "users": userInfo
    }
};


describe('Test getAgents service', () => {
    it('returns array of objects', async () => {
        expect(await getAgents(mockZendeskRequest)).toEqual(userInfo);
    });
});
