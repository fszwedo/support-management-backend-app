import https from 'https';

const makeZendeskRequest = (path, method) => {
    const options = {
        hostname: process.env.URL,
        port: 443,
        path: path,
        method: method,
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${process.env.EMAIL}/token:${process.env.APITOKEN}`).toString('base64') 
         }  
    }

    console.log(options);

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {
            console.log(`response: ${d}`)
          })
    })

    req.on('error', error => {
        console.error(error)
      })
      
    req.end()
}

export default makeZendeskRequest;