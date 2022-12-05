require('dotenv').config()
const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRIDAPIKEY);

 const sendEmail = async (shifts,emailToAgent) => {

function getMessage() {


  let html = '<!DOCTYPE html><html><head><style>table, th, td { border: 1px solid black;border-collapse: collapse;}.button { border: none; color: white;padding: 15px 32px;text-align: center;text-decoration: none; display: inline-block;font-size: 16px;margin: 4px 2px; }.button1 {background-color: #4CAF50;} /* Green */.button2 {background-color: #008CBA;} /* Blue */</style></head><body>  '+
  '<strong>Dear '+ shifts[0].name+  ' </strong><br /><br />'+
  'your next week hours are as follows:<br /><br />'+
  '<table><tr> <th>Date</th><th>Hours</th></tr>'

for(let i =0; i<5; i++) {

 const html1 =' <tr><td> '+ shifts[i].date+' </td><td>'+shifts[i].hours+' </td></tr>';
 html+=html1;
}

html+='</table><br /> <br /><a href=\'https://tiger-admin.zoovu.com\'><button class="button button2">Check Shift Rota</button></a></body></html>';
  
  return {
    to: 'g.bochniak@zoovu.com',
 //   to: emailToAgent,
    from: 'g.bochniak@zoovu.com',
    subject: 'Your next week ticket assignment hours',
    text: 'Your next week ticket assignment hours',
    html: html
  };
}

  try {
    await sendGridMail.send(getMessage());
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body)
    }
  }

}

export default sendEmail;