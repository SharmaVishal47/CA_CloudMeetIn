const express = require('express');
const readline = require('readline');
const  moment  = require('moment-timezone');
const router = express.Router();
const fs = require('fs');
const {google} = require('googleapis');
const schedule = require('node-schedule');
const cron = require('node-cron');
const gmailMiddleware = require('../middleware/gmail-auth');
const localStorage = require('localStorage');

let  _email;
let _meetingData ;
let _clientEmail;
let eventType ;
let  adminName;
// scopes
const scopes = ['https://www.googleapis.com/auth/gmail.compose'];
const TOKEN_PATH = 'gmail-credentials.json';


cron.schedule('*/45 * * * *', () => {
  gmailMiddleware.gmailCheckToken((status) => {
    if(status === 200) {
      console.log("Refresh the gmail token");
    }
  });
});

router.post('/sendemail',(req,res,next)=>{
  console.log("Body of email --- >", req.body);
  console.log("Get the ", localStorage.getItem('rescheduleRecord'));
  _email = req.body.email;
  adminName = req.body.userName;
  eventType = req.body.eventType.split('m')[0];
  _meetingData =  req.body.meetingData;
  _clientEmail = req.body.clientEmail;
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), sendMessage);
    res.status(200).json(
      {
        Message :  'Notification send on your email'
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
  console.log('Authorize this app by visiting this url:', authUrl);
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
        // console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function makeBody(to, from, cc,subject, message) {
  console.log("message.userTimeZone=========",message.userTimeZone);
  let checkPoint = typeof (message.cancelBy) === 'string' && message.cancelBy !== 'undefined' ? 'true' : 'false';
  let title ;
  let _sub;
  let scheduleHTML = '';
  let cancelHTML = '';
  if(checkPoint === 'true') {
    title = 'canceled';
    _sub = 'CloudMeetIn Canceled:  Meeting cancel with ' + subject;
    cancelHTML = '<div><label for="Canceled by:" style="color: #666a7a;">Canceled by: </label> \n' +
      '  <h3 id="Canceled by:" style="color: #666a7a;">' + message.cancelBy + '</h3><br>' +
      '    </div>'
  } else {

    console.log("type of  -- > ", typeof (message.rescheduleRecord));
   let reschedule  =  typeof (message.rescheduleRecord) === 'object' && message.rescheduleRecord !== 'undefined' ? true : false;
   if(reschedule) {
     message.rescheduleRecord.g2mMeetingUrl  = typeof (message.rescheduleRecord.g2mMeetingUrl) === 'string' && message.rescheduleRecord.g2mMeetingUrl !== 'undefined' ? 'GoToMeeting Meeting url  ' +'<br>' +message.rescheduleRecord.g2mMeetingUrl :  ' ';
     message.rescheduleRecord.g2mMeetingCallNo  = typeof (message.rescheduleRecord.g2mMeetingCallNo) === 'string' && message.rescheduleRecord.g2mMeetingCallNo !== 'undefined' ? ' and number : '  +'<br>' +message.rescheduleRecord.g2mMeetingCallNo :  ' ';
     let gtmDetails = message.rescheduleRecord.g2mMeetingUrl + message.rescheduleRecord.g2mMeetingCallNo +'';
     title = 'scheduled';
     _sub = 'CloudMeetIn Updated invitation:  Meeting schedule  with ' + subject;
     scheduleHTML = '<div>\n' +
       '        <label for="Location:" style="color: #666a7a;">Location: </label>\n' +
       '        <h3 id="Location:" style="color: #666a7a;">' +gtmDetails + ' </h3><br>' +
       '        <label for="InviteeTimeZone:" style="color: #666a7a;">Invitee Time Zone: </label>\n' +
       '        <h3 id="InviteeTimeZone:" style="color: #666a7a;">' +message.timezonekey+ ' </h3><br>' +
       '        <label for="dateAndTime:" style="color: #666a7a;">Date & Time: </label>\n' +
       '        <h3 id="dateAndTime:" style="color: #666a7a; text-decoration: line-through;">  Former: ' +moment(message.rescheduleRecord.meetingTime).tz(message.userTimeZone).format('LLLL')+ ' to '+ moment(message.rescheduleRecord.meetingEndTime).tz(message.userTimeZone).format('LLLL')+' </h3><br>' +
       '        <h3 id="dateAndTime:" style="color: #666a7a;"> <span style="color: #30bf5b;">Updated: </span>'+ moment(message.starttime).tz(message.userTimeZone).format('LLLL') +' to  '+ moment(message.endtime).tz(message.userTimeZone).format('LLLL') +'</h3><br>' +
       '        <label for="Rescheduledby:" style="color: #e41600;">Rescheduled by '+message.reschedulerName+' </label>\n' +
       '        <h3 id="Rescheduledby:" style="color: #e41600;">Reason:  ' +message.rescheduleReason+ ' </h3><br>' +
       '      </div>'
   } else {
     message.g2mMeetingUrl  = typeof (message.g2mMeetingUrl) === 'string' && message.g2mMeetingUrl !== 'undefined' ? 'GoToMeeting Meeting url  '  +'<br>'+message.g2mMeetingUrl :  ' ';
     message.g2mMeetingCallNo  = typeof (message.g2mMeetingCallNo) === 'string' && message.g2mMeetingCallNo !== 'undefined' ? ' and number : ' +'<br>'+message.g2mMeetingCallNo :  ' ';
     let gtmDetails = message.g2mMeetingUrl + message.g2mMeetingCallNo +'';
     title = 'scheduled';

     _sub = 'CloudMeetIn Invitation:  Meeting schedule  with ' + subject;
     scheduleHTML = '<div>\n' +
       '        <label for="Location:" style="color: #666a7a;">Location: </label>\n' +
       '        <h3 id="Location:" style="color: #666a7a;">' +gtmDetails + ' </h3><br>' +
       '        <label for="InviteeTimeZone:" style="color: #666a7a;">Invitee Time Zone: </label>\n' +
       '        <h3 id="InviteeTimeZone:" style="color: #666a7a;">' +message.timezonekey+ ' </h3><br>' +
       '      </div>'
   }
  }


  /*"cc: ", cc, "\n",*/
  const str = ["Content-Type: text/html; charset=\"UTF-8\"\n",
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "to: ", to, "\n",
    "from: ", from, "\n",
    "subject: ", _sub, "\n\n",
    '<img src="https://cloudanalogy.com/wp-content/uploads/2018/12/CA_logo-120-x-80.png" alt="" width="50" height="40" style="display: block;margin-left: auto;margin-right: auto;margin-bottom: 2%;">'+
    '<div class="container">\n' +
    '  <div class="row">\n' +
    '    <div class="col-sm-5" style="margin: auto;  background-color: white;\n' +
    '    width: 400px;\n' +
    '    padding: 50px;\n' +
    '    min-height: 400px;\n' +
    '    height: auto; color: #666a7a;  border-top: 1px dashed #dadada; border-bottom: 1px dashed #dadada; ">\n' +
    '      <h3 style="color: #666a7a;" ">Hi '+adminName+',</h3><br> '+
    '      <h3 style="color: #666a7a;" >A new event has been '+title+'.</h3><br>'+
    '      <label for="eventType" style="color: #666a7a;">Event Type:</label><br>' +
    '      <h3 id="eventType" style="color: #666a7a; "> '+ eventType +' Minute Meeting</h3><br>'+
    '      <label for="Invitee" style="color: #666a7a; ">Invitee: </label>\n' +
    '      <h3 id="Invitee" style="color: #666a7a; ">' + message.subject + '</h3><br>' +
    '      <label for="InviteeEmail" style="color: #666a7a; ">Invitee Email: </label><br>' +
    '      <a id="InviteeEmail" href="'+cc+'"> '+cc+' </a><br><br>' +
    '      <label for="eventDateTime" style="color: #666a7a; ">Event Date/Time: </label>' +
    '      <h3 id="eventDateTime" style="color: #666a7a; "> '+moment(message.starttime).tz(message.userTimeZone).format('LLLL')+' to  '+ moment(message.endtime).tz(message.userTimeZone).format('LLLL')+'</h3><br>' +
    '      ' +scheduleHTML +'  \n' +
    '     ' + cancelHTML + ' \n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n',
  ].join('');
  const encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
  return encodedMail;
}

function sendMessage(auth) {
  // console.log(_email, _meetingData);
  const gmail = google.gmail({version: 'v1', auth});
  const raw = makeBody(_email, 'sumit.kumar@cloudanalogy.com', _clientEmail,_meetingData.subject, _meetingData,);
  //console.log("Send Email Content  :  == > > > ",raw);
  gmail.users.messages.send({
    auth: auth,
    userId: 'me',
    resource: {
      raw: raw
    }
  });
}
module.exports = router;
