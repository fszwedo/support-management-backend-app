import axios from 'axios';

export const enum METHODS {
    GET = "GET",
    PUT = "PUT",
    POST = "POST"
}

if(!process.env.HELPSCOUTURL || !process.env.HELPSCOUTAPPID || !process.env.HELPSCOUTAPPSECRET){console.log("Either HELPSCOUTAPPSECRET, or HELPSCOUTAPPID, or HELPSCOUTURL environment variable is not present!")}

const makeHelpscoutRequest = async (path: string, method: METHODS, payload?) => {
    let res, err;
    let retryCount = 2;
    while (retryCount >= 0) {
        
        const options = {
            headers: {
                'Authorization': 'Bearer ' + global.authorizationToken
            }
        }

        try {
            if (method === METHODS.GET) res = await axios.get(`${process.env.HELPSCOUTURL}${path}`, options);
            if (method === METHODS.PUT) res = await axios.put(`${process.env.HELPSCOUTURL}${path}`, payload, options);
            if (method === METHODS.POST) res = await axios.post(`${process.env.HELPSCOUTURL}${path}`, payload, options);
            retryCount = 0;
            return res.data;
        } catch (error) {
            console.log(`Request failed with error: ${error.response.statusText} ${error.response.status}`)
            err = `${error.response.statusText} ${error.response.status}`;
            if (error.response.status === 401) {
                const tokenAcquisitionPayload = {
                    grant_type: "client_credentials",
                    client_id: process.env.HELPSCOUTAPPID,
                    client_secret: process.env.HELPSCOUTAPPSECRET
                }
                res = await axios.post(`${process.env.HELPSCOUTURL}/oauth2/token`, tokenAcquisitionPayload);
                global.authorizationToken = res.data.access_token;
                retryCount--;
            }
        }        
    }
    return err;
}


export default makeHelpscoutRequest;