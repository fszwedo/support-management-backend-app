const sendGridMail = require('@sendgrid/mail');

import sendEmail11 from "src/controllers/sendEmailController";

 var sendEmail1 = async (shifts,emailToAgent) => {

sendGridMail.setApiKey('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');

function getMessage() {
  const body = 'Your next week ticket assignment hours';

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
    to: emailToAgent,
    from: 'g.bochniak@zoovu.com',
    subject: 'Your next week ticket assignment hours',
    text: 'Your next week ticket assignment hours',
    html: html

  };
}

async function sendEmail() {
  try {
    await sendGridMail.send(getMessage());
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Error sending test email');
    console.error(error);
    if (error.response) {
      console.error(error.response.body)
    }
  }
}

(async () => {
  console.log('Sending test email');
  await sendEmail();
})();
  
} 

export default sendEmail1;