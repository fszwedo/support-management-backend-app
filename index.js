import express from 'express';
import 'dotenv/config';

import makeZendeskRequest from './src/services/authenticationService.js'

const app = express();

makeZendeskRequest('/api/v2/users.json','GET');

app.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`)
})