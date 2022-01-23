import makeHelpscoutRequest from "src/services/helpscout/authenticationService";
import axios from 'axios';
import { METHODS } from 'src/services/helpscout/authenticationService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Test helpscout connection component", () => {    
    test("should return the data once connected", async () => {
        mockedAxios.get.mockResolvedValue({ data: {
            kot: 'kot'
        } });

        expect(makeHelpscoutRequest('/test', METHODS.GET)).toEqual({kot: 'kot'})
    })

    // test("should try to reconnect if error occured", async () => {
    // })

    // test("should return an error if connection was not possible", async () => {
    // })

});