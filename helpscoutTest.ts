import makeHelpscoutRequest, { METHODS } from './src/services/helpscout/authenticationService';
import 'dotenv/config';

const test = async () => {
    console.log(await makeHelpscoutRequest('/users/me', METHODS.GET));
}


test();
