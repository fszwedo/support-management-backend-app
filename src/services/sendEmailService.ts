const sendGridMail = require('@sendgrid/mail');

var sendEmailToAgents = async (shifts, emailToAgent) => {
  //return if email for a given agent was not provided
  if (!emailToAgent) return;

  sendGridMail.setApiKey(process.env.SENDGRIDAPIKEY);

  function getMessage() {
    let content = `Hi ${shifts[0].name}!<br/><br/>Your next week ticket assignment hours are listed below.`
    content += '<table style="width:80%; margin:0 auto;"><tr> <th>Date</th><th>Hours (UTC timezone)</th></tr>'
    for (let i = 0; i < 5; i++) {
      content += ' <tr><td style="text-align:center;"> ' + shifts[i].date + ' </td><td style="text-align:center;">' + shifts[i].hours + '  </td></tr>';
    }

    //to be uncommented when shift rota app will be available
    //content += '</table><br /> <br /><button style="width:40%; margin:0 auto;" class="button button2"><a href=\'https://tiger-admin.zoovu.com\'>Check Shift Rota</a></button></body></html>';

    const html = generateHtml(content);

    return {
      to: emailToAgent,
      from: {
        email: process.env.SENDGRIDEMAIL,
        name: 'Support App'
      },
      subject: 'Your next week ticket assignment hours',
      text: 'Your next week ticket assignment hours',
      html: html
    };
  }

  async function sendEmail() {
    const message = getMessage();
    try {
      await sendGridMail.send(message);
      console.log(`Shift email sent successfully to ${message.to}`);
    } catch (error) {
      console.error(`Error sending shift email to ${message.to}`);
      if (error.response) {
        console.error(error.response.body.errors)
      }
    }
  }

  await sendEmail();
}


const generateHtml = (content) => {
  return `    <html xmlns="http://www.w3.org/1999/xhtml">    <head>        <meta http-equiv="content-type" content="text/html; charset=utf-8">        <meta name="viewport" content="width=device-width, initial-scale=1.0;">        <meta name="format-detection" content="telephone=no" />        <style>            /* Reset styles */            body {                margin: 0;                padding: 0;                min-width: 100%;                width: 100% !important;                height: 100% !important;            }            td {                background-color: white;            }            body,            table,            td,            div,            p,            a {                -webkit-font-smoothing: antialiased;                text-size-adjust: 100%;                -ms-text-size-adjust: 100%;                -webkit-text-size-adjust: 100%;                line-height: 100%;            }            table,            td {                mso-table-lspace: 0pt;                mso-table-rspace: 0pt;                border-collapse: collapse !important;                border-spacing: 0;            }            img {                border: 0;                line-height: 100%;                outline: none;                text-decoration: none;                max-width: 100%;                max-height: 100%;                height: auto;                width: auto;                -ms-interpolation-mode: bicubic;            }            #outlook a {                padding: 0;            }            .ReadMsgBody {                width: 100%;            }            .ExternalClass {                width: 100%;            }            .ExternalClass,            .ExternalClass p,            .ExternalClass span,            .ExternalClass font,            .ExternalClass td,            .ExternalClass div {                line-height: 100%;            }            /* Rounded corners for advanced mail clients only */            @media all and (min-width: 560px) {                .container {                    border-radius: 8px;                    -webkit-border-radius: 8px;                    -moz-border-radius: 8px;                    -khtml-border-radius: 8px;                    border: 1px solid #E0E0E0;                }            }            /* Set color for auto links (addresses, dates, etc.) */            a,            a:hover {                color: #127DB3;            }            .footer a,            .footer a:hover {                color: #999999;            }        </style> <!-- MESSAGE SUBJECT -->        <title>Zoovu support</title>    </head><!-- BODY -->    <!-- Set message background color (twice) and text color (twice) -->    <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%"        style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;	background-color: #fff;	color: #000000;"        bgcolor="#FFF" text="#000000">        <!-- SECTION / BACKGROUND -->        <!-- Set message background color one again -->        <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0"            style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;"            class="background">            <tr>                <td align="center" valign="top"                    style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;" bgcolor="#fff">                    <!-- WRAPPER -->                    <!-- Set wrapper width (twice) -->                    <table border="0" cellpadding="0" cellspacing="0" align="center" width="560"                        style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;	max-width: 560px;"                        class="wrapper">                        <tr>                            <td align="center" valign="top"                                style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;			padding-top: 20px;			padding-bottom: 20px;">                                <!-- PREHEADER -->                                <!-- Set text color to background color -->                                <div style="display: none; visibility: hidden; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; height: 0; max-height: 0; max-width: 0;			color: #fff;"                                    class="preheader"> </div> <!-- LOGO -->                                <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2. URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content=logo&utm_campaign={{Campaign-Name}} -->                                <a target="_blank" style="text-decoration: none;" href="https://zoovu.com/"><img                                        border="0" vspace="0" hspace="0" src="https://i.imgur.com/suExZBx.jpg"                                        width="100px" alt="zoovu" title="Logo"                                        style="				color: #000000;				font-size: 10px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;" /></a>                            </td>                        </tr> <!-- End of WRAPPER -->                    </table> <!-- WRAPPER / CONTEINER -->                    <!-- Set conteiner background color -->                    <table cellpadding="0" cellspacing="0" align="center" bgcolor="#fff"                         style="border-collapse: collapse; border-spacing: 0; padding: 0;  width=80%"                    class="container">                                            <!-- HERO IMAGE -->                        <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 (wrapper x2). Do not set height for flexible images (including "auto"). URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content={{Ìmage-Name}}&utm_campaign={{Campaign-Name}} -->                        <!-- PARAGRAPH -->                        <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->                        <tr>                            <td align="left" valign="top"                                style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 5%; padding-right: 5%; width: 100%; font-size: 15px; font-weight: 400; line-height: 160%;			padding-top: 5px;			color: #000000;			font-family: sans-serif;"                                class="paragraph"> ${content} </td>                        </tr> <!-- BUTTON -->                        <!-- Set button background color at TD, link/text color at A and TD, font family ("sans-serif" or "Georgia, serif") at TD. For verification codes add "letter-spacing: 5px;". Link format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content={{Button-Name}}&utm_campaign={{Campaign-Name}} -->                        <!-- Here we can add a support app link once it will be available                            <tr>                            <td align="center" valign="top"                                style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;			padding-top: 25px;			padding-bottom: 5px;"                                class="button"><a href="https://zoovu.zendesk.com/hc/en-us" target="_blank"                                    style="text-decoration: none;">                                    <table border="0" cellpadding="0" cellspacing="0" align="center"                                        style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;">                                        <tr>                                            <td align="center" valign="middle"                                                style="padding: 12px 24px; margin: 0; text-decoration: none; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"                                                bgcolor="#1F3A54"><a target="_blank"                                                    style="text-decoration: none;					color: #000000; font-family: sans-serif; font-size: 14px; font-weight: 700; line-height: 120%;"                                                    href="https://zoovu.zendesk.com/hc/en-us"> Visit our Knowledge Base                                                </a> </td>                                        </tr> -->                                    </table>                                </a> </td>                        </tr> <!-- LINE -->                        <!-- Set line color -->                        <tr>                            <td align="center" valign="top"                                style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;			padding-top: 25px;"                                class="line">                                <hr color="#E0E0E0" align="center" width="100%" size="1" noshade                                    style="margin: 0; padding: 0;" />                            </td>                        </tr> <!-- PARAGRAPH -->                        <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->                    </table> <!-- WRAPPER -->                    <!-- Set wrapper width (twice) -->                    <table border="0" cellpadding="0" cellspacing="0" align="center" width="560"                        style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;	max-width: 560px;"                        class="wrapper">                        <!-- SOCIAL NETWORKS -->                        <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 -->                        <tr>                            <td align="center" valign="top"                                style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;			padding-top: 25px;"                                class="social-icons">                                <table width="256" border="0" cellpadding="0" cellspacing="0" align="center"                                    style="border-collapse: collapse; border-spacing: 0; padding: 0;">                                    <tr>                                        <!-- ICON 1 -->                                        <td align="center" valign="middle"                                            style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;">                                            <a target="_blank" href="https://www.facebook.com/zoovu.company"                                                style="text-decoration: none;"><img border="0" vspace="0" hspace="0"                                                    style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;					color: #000000;"                                                    alt="F" title="Facebook" width="16px" height="auto"                                                    src="https://i.imgur.com/B78fLqD.png"></a></td> <!-- ICON 2 -->                                        <td align="center" valign="middle"                                            style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;">                                            <a target="_blank" href="https://twitter.com/zoovu"                                                style="text-decoration: none;"><img border="0" vspace="0" hspace="0"                                                    style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;					color: #000000;"                                                    alt="T" title="Twitter" width="16px" height="auto"                                                    src="https://i.imgur.com/szxyehA.png"></a></td> <!-- ICON 3 -->                                        <td align="center" valign="middle"                                            style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;">                                            <a target="_blank" href="https://www.linkedin.com/company/zoovu"                                                style="text-decoration: none;"><img border="0" vspace="0" hspace="0"                                                    style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;					color: #000000;"                                                    alt="linkedin" title="Linkedin" width="16px" height="auto"                                                    src="https://i.imgur.com/NnZJvYJ.png"></a></td> <!-- ICON 4 -->                                        <td align="center" valign="middle"                                            style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;">                                            <a target="_blank"                                                href="https://www.youtube.com/channel/UCGkH-TW9uk0xvkoQmvNN8oA"                                                style="text-decoration: none;"><img border="0" vspace="0" hspace="0"                                                    style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;					color: #000000;"                                                    alt="I" title="YouTube" width="16px" height="auto"                                                    src="https://i.imgur.com/HVNPfpn.png"></a></td>                                    </tr>                                </table>                            </td>                        </tr> <!-- FOOTER -->                        <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->                        <tr>                            <td align="center" valign="top"                                style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 13px; font-weight: 400; line-height: 150%;			padding-top: 20px;			padding-bottom: 20px;			color: #999999;			font-family: sans-serif;"                                class="footer"> Zoovu Inc. 1 Beacon Street 02108 Boston United States<br> <a                                    href="https://zoovu.com/">www.zoovu.com</a> <!-- ANALYTICS -->                                <!-- https://www.google-analytics.com/collect?v=1&tid={{UA-Tracking-ID}}&cid={{Client-ID}}&t=event&ec=email&ea=open&cs={{Campaign-Source}}&cm=email&cn={{Campaign-Name}} -->                                <img width="1" height="1" border="0" vspace="0" hspace="0"                                    style="margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;"                                    src="" /> </td>                        </tr> <!-- End of WRAPPER -->                    </table> <!-- End of SECTION / BACKGROUND -->                </td>            </tr>        </table>    </body>    </html>`;
}


function getReportingMessage(attachment,email) {
  let content = `Hi ${email}! Please find your report in the attachment.`

  return {
    to: email,
    from: {
      email: 'supportinternal@mail.zoovu.io',
      name: 'Support App'
    },
    subject: 'Your purchase events report',
    text: content,
    attachments: [
      {
        content: attachment,
        filename: "purchaseReport.csv",
        type: "text/csv",
        disposition: "attachment"
      }
    ]
  };
}

async function sendReportingEmail(attachment,email) {
  const message = getReportingMessage(attachment,email);
  try {
    await sendGridMail.send(message);
    console.log(`Reporting email sent successfully to ${message.to}`);
  } catch (error) {
    console.error(`Error sending reporting email to ${message.to}`);
    if (error.response) {
      console.error(error.response.body.errors)
    }
  }
}

var sendReporting = async (rowsCSV, email) => {
  //return if email for a given agent was not provided
  if (!email) return;

  sendGridMail.setApiKey(process.env.SENDGRIDAPIKEY);

  const fs = require('fs');
  let attachment = Buffer.from(rowsCSV).toString('base64');
  await sendReportingEmail(attachment,email);
}

export default sendEmailToAgents;
export {
  sendReporting
}