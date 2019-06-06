const express = require('express');
const readline = require('readline');
const router = express.Router();
const fs = require('fs');
const {google} = require('googleapis');
const schedule = require('node-schedule');
const gmailMiddleware = require('../middleware/gmail-auth');

let _email;
let _message;
// scopes
const scopes = ['https://www.googleapis.com/auth/gmail.compose'];
const TOKEN_PATH = 'gmail-credentials.json';

/*let startTime = new Date(Date.now());
let j = schedule.scheduleJob({ start: startTime, rule: '*!/60 * * * * *' }, function(){
  gmailMiddleware.gmailCheckToken((status) => {
    if(status === 200) {
      // console.log("Refresh the gmail token");
    }
  })
});*/

router.post('/sendResetPasswordEmail',(req,res,next)=>{
  _email = req.body.email;
  _message =  req.body.message;
  fs.readFile('credentials.json', (err, content) => {
    if (err) return // console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), sendMessage);
    res.status(200).json(
      {
        Message :  'Notification send on your email',
        email : _email
      }
    );
  });
});

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

// Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  // console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        // // console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function makeBody(to, from,subject, message) {
  const str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "to: ", to, "\n",
    "from: ", from, "\n",
    "subject: ", subject, "\n\n",
    "Message: ", message, "\n",
  ].join('');
  const encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
  return encodedMail;
}

function sendMessage(auth) {
  // // console.log(_email, _meetingData);
  const gmail = google.gmail({version: 'v1', auth});
  const raw = makeBody(_email, '','CloudMeetIn Reset Password',_message);
  //// console.log("Send Email Content  :  == > > > ",raw);
  gmail.users.messages.send({
    auth: auth,
    userId: 'me',
    resource: {
      raw: raw
    }
  });
}
module.exports = router;
