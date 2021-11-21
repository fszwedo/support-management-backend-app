import axios from 'axios';

const makeZendeskRequest = async (path, method, payload) => {
    const options = {
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${process.env.EMAIL}/token:${process.env.APITOKEN}`).toString('base64')
        }
    }

    let res;
    if (method === 'GET')  res = await axios.get(`${process.env.URL}${path}`, options);
    if (method === 'PUT')  res = await axios.put(`${process.env.URL}${path}`, payload, options);
    if (method === 'POST')  res = await axios.post(`${process.env.URL}${path}`, payload, options);
    return res.data;
}

export default makeZendeskRequest;