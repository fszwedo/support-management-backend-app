const sendGridMail = require('@sendgrid/mail');

async function sendEmail (emailTo, senderEmail, senderName, title, content, attachment = null, filename = null, attachmentType = "text/csv") {

  const message = {
    to: emailTo,
    from: {
      //email: 'supportinternal@mail.zoovu.io',
      email: senderEmail,
      name: senderName
    },
    subject: title,
    text: content,
    attachments: [
      {
        content: attachment,
        filename: filename,
        type: attachmentType,
        disposition: "attachment"
      }
    ]
  };

  try {
    sendGridMail.setApiKey(process.env.SENDGRIDAPIKEY);
    await sendGridMail.send(message);
    console.log(`Email sent successfully to ${message.to}`);
  } catch (error) {
    console.error(`Error sending  email to ${message.to}`);
    if (error.response) {
      console.error(error.response.body.errors)
    }
  }
}


export { sendEmail }