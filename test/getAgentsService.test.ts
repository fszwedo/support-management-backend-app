import getAgents from "../src/services/zendesk/getAgentsService";

const userInfo = {
    "users": [{
        "id": 223443,
        "name": "Johnny Agent"
    },
    {
        "id": 8678530,
        "name": "James A. Rosen"
    }
    ]
}


describe('Test getAgents service', () => {
    it('returns array of objects', async () => {
        expect(await getAgents(async () => {return userInfo})).toEqual(userInfo.users);
    });
});
