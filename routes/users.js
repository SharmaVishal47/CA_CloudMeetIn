const express = require('express');
const router = express.Router();
const fs = require('fs');
const {google} = require('googleapis');
const googleAuth = require('google-auth-library');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const calendarMiddleware = require('../middleware/google-calendar-auth');
const OAuth2 = google.auth.OAuth2;
const config = require('../middleware/config');
const localStorage = require('localStorage');
const cron = require('node-cron');


cron.schedule('*/40 * * * *', () => {
  calendarMiddleware.calCheckToken((calTokenStatus) => {
    if(calTokenStatus === 200) {
      // console.log("Token is refresh AccessToken")
    } else {
      // console.log("Token is not refresh AccessToken")
    }
  });
});

// create auth client
const oauth2Client = new OAuth2(
  config.google_calendar.google_cal_client_id,
  config.google_calendar.google_cal_client_secret,
  config.google_calendar.google_cal_redirect_url
);


let  customEvent = (body, callback) =>{
  /*location: 'Noida',*/
  /* timeZone: body.timeZone*/
  let checkPoint = typeof (body.data.g2mMeetingUrl) === 'string' && body.data.g2mMeetingId !== 'undefined' ? body.data.g2mMeetingId : false;
  let meetingId = localStorage.getItem("meetingId");
  if(checkPoint && meetingId) {
    const event = {
      'summary': body.userName + ' and ' + body.meetIngData.subject,

      description: 'Event Name: ' + body.eventType + '\n'+
        'Location: ' + '\n'+
        body.data.g2mMeetingUrl + '\n'+
        'You can join this meeting from your computer, tablet, or smartphone' + '\n'+'\n'+
        'You can also dial in using your phone' + '\n'+
        body.data.g2mMeetingCallNo + '\n'+'\n'+
        'Contact Number: ' +body.data.schedulerPhone+ '\n'+
        'Contact Description: ' +body.data.schedulerDescription+ '\n'+'\n'+
        'Need to make changes to this event?' + '\n'+
        'Cancel:' +'\n'+
        '/cancellations/'+meetingId + '\n'+
        'Reschedule:' +'\n'+
        '/reschedule/'+meetingId + '\n'+'\n'+
        'Powered by CloudMeetIn.com ',
      start: {
        dateTime: body.meetIngData.starttime
      },
      end: {
        dateTime: body.meetIngData.endtime
      },
      attendees: [{
        responseStatus : "accepted",
        email: body.email
      }, { email: body.inviteeEmail }],
      reminders: {
        useDefault: true,
      }
    };
    localStorage.removeItem("meetingId");
    callback(event);
  } else {
    const event = {
      'summary': body.userName + ' and ' + body.meetIngData.subject,
      description: 'Event Name: ' + body.eventType + '\n'+
        'Contact Number: ' +body.data.schedulerPhone+ '\n'+
        'Contact Description: ' +body.data.schedulerDescription+ '\n'+'\n'+
        'Need to make changes to this event?' + '\n'+
        'Cancel:' +'\n'+
        '/cancellations/'+meetingId + '\n'+
        'Reschedule:' +'\n'+
        '/reschedule/'+meetingId + '\n'+'\n'+
        'Powered by CloudMeetIn.com ',
      start: {
        dateTime: body.meetIngData.starttime,

      },
      end: {
        dateTime: body.meetIngData.endtime
      },
      attendees: [{
        responseStatus : "accepted",
        email: body.email
      }, { email: body.inviteeEmail }],
      reminders: {
        useDefault: true,
      }
    };
    localStorage.removeItem("meetingId");
    callback(event);
  }
};

/* This API used to getting the time slot from the google calendar*/
router.post('/getcalendareventslot',(req,res,next)=>{
  // console.log("BOdy --:", req.body);
  let usernameQuery = "SELECT token_path FROM `calendly` WHERE email = '"+req.body.email+"'";
  // console.log("Query is -->", usernameQuery);
  db.query(usernameQuery, (err, result) => {
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      // console.log('TokenPath === > > >>',result[0].token_path);
      const TOKEN_PATH = result[0].token_path;
      const token = fs.readFileSync(TOKEN_PATH);
      oauth2Client.setCredentials(JSON.parse(token));
      const calendar = google.calendar({version: 'v3'});
      calendar.events.list({
        auth: oauth2Client,
        calendarId: req.body.email,
        timeMax: req.body.timeMax,
        timeMin: req.body.timeMin/*,
        timeZone: req.body.timeZone*/
      }, function(err, resp) {
        // console.log("Response : -->" ,resp.data.items);
        // console.log(resp.data.items);
        res.status(200).json(resp.data.items);
      });
    }
  });
});

router.post('/checkTokenUserId',(req,res,next)=>{
  const decodedToken = jwt.verify(req.body.token,'secret-code-for-token');
  if(decodedToken.userId === req.body.userId){
    res.status(200).json({
      message: 'Match Successfully.'
    });
  }else{
    res.status(404).json({
      message: 'Invalid Token'
    });
  }
});

router.post('/checkMeetingPlatform',(req,res,next)=>{
  // console.log(req.body);
  let usernameQuery = "SELECT email,go2meeting,salesforce,zoom,userId FROM `calendly` WHERE userId = '" + req.body.userId + "'";
  db.query(usernameQuery, (err, result) => {
    // console.log("result=====",result);
    // console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'Search Successfully.',
        data: result
      });
    }
  });
});

router.post('/getcalendarlist',(req,res,next)=>{
  let usernameQuery = "SELECT token_path FROM `calendly` WHERE email = '"+req.body.email+"'";
  db.query(usernameQuery, (err, result) => {
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      // console.log('TokenPath === > > >>',result[0].token_path);
      const TOKEN_PATH =  result[0].token_path;
      const token = fs.readFileSync(TOKEN_PATH);
      oauth2Client.setCredentials(JSON.parse(token));
      const calendar = google.calendar({version: 'v3'});
      calendar.calendarList.list({ auth: oauth2Client }, function(err, resp) {
        let myCalendarMap = {
          record : resp.data.items
        };
        // console.log(myCalendarMap);
        res.status(200).json(myCalendarMap);
      });
    }
  });
});

// Insert event in google calendar using google calendar api
router.post('/insertevent',(req,res,next)=>{

  // console.log("Body of insert event ", req.body);
  let usernameQuery = "SELECT token_path FROM `calendly` WHERE email = '"+req.body.email+"'";
  db.query(usernameQuery, (err, result) => {
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      const TOKEN_PATH =  result[0].token_path;
      // console.log(TOKEN_PATH);
      const token = fs.readFileSync(TOKEN_PATH);
      oauth2Client.setCredentials(JSON.parse(token));
      const calendar = google.calendar({version: 'v3'});
      customEvent(req.body, (event) => {
        // console.log(event);
        calendar.events.insert({
          auth: oauth2Client,
          calendarId: req.body.email,
          resource: event,
          "sendUpdates": "all",
        }, function(err, event) {
          if (err) {
            // // console.log('There was an error contacting the Calendar service: ' + err);
            res.status(500).json( {
              // message :  'There was an error contacting the Calendar service' +err
            });
          }
          // console.log('Event created==========================>>>', event.data);
          res.status(200).json( {
            message :  'Event is successfully added in google calendar',
            data: event.data
          });
        })
      });
    }
  });
});

// Insert event in google calendar using google calendar api
router.post('/updateEvent',(req,res,next)=>{
  // console.log("updateEVnt", req.body);
  let usernameQuery = "SELECT token_path FROM `calendly` WHERE email = '"+req.body.email+"'";
  db.query(usernameQuery, (err, result) => {
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      const TOKEN_PATH =  result[0].token_path;
      // console.log(TOKEN_PATH);
      const token = fs.readFileSync(TOKEN_PATH);
      oauth2Client.setCredentials(JSON.parse(token));
      const calendar = google.calendar({version: 'v3'});
      const event = {
        'summary': 'A' + ' and ' +  req.body.inviteeEmail,
        location: 'Noida',
        description: 'Event Name: ' + req.body.eventType + '\n'+
          'Need to make changes to this event ?' + '\n'+
          'Cancel:' +'\n'+
          '/' + '\n'+
          'Reschedule:' +'\n'+
          '/' + '\n'+'\n'+
          'Powered by CloudMeetIn.com ',
        start: {
          dateTime: '2019-04-21T09:00:00Z',
          timeZone: req.body.data.timeZone
        },
        end: {
          dateTime: '2019-04-21T09:15:00Z',
          timeZone: req.body.data.timeZone
        },
        attendees: [{ email: req.body.email }, { email: req.body.inviteeEmail }],
        reminders: {
          useDefault: true,
        }
      };
      // console.log(event);
      calendar.events.insert({
        auth: oauth2Client,
        calendarId: req.body.email,
        resource: event,
        "sendUpdates": "all",
      }, function(err, event) {
        if (err) {
          // // console.log('There was an error contacting the Calendar service: ' + err);
          res.status(500).json( {
            // message :  'There was an error contacting the Calendar service' +err
          });

        }
        // console.log("==================================================================");
        // console.log('Event created==========================>>>', event.data);

        // console.log("==================================================================");
        res.status(200).json( {
          message :  'Event is successfully added in google calendar',
          data: event.data
        });
      })
    }
  });
});

let  customUpdateEvent = (body, callback) =>{
  let meetingId = localStorage.getItem("meetingId");
  let fullName = localStorage.getItem('fullName');
  let recshduleData =  JSON.parse(body.meetIngData.rescheduleRecord);
  // console.log("recshduleData======================",recshduleData);
  let checkPoint = typeof (recshduleData.g2mMeetingUrl) === 'string' && recshduleData.g2mMeetingId !== 'undefined' ? recshduleData.g2mMeetingId : false;
  if(checkPoint && meetingId) {
    const event = {
      'summary': body.meetIngData.Meeting_owner + ' and ' + body.meetIngData.schedulerName,
      description: 'Event Name: ' + body.meetIngData.eventType + '\n'+
        'Location: ' + '\n'+
        recshduleData.g2mMeetingUrl + '\n'+
        'You can join this meeting from your computer, tablet, or smartphone' + '\n'+'\n'+
        'You can also dial in using your phone' + '\n'+
        recshduleData.g2mMeetingCallNo + '\n'+'\n'+
        'Contact Number: ' +body.meetIngData.schedulerPhone+ '\n'+
        'Reschedule Reason: ' +body.meetIngData.rescheduleReason+ '\n'+'\n'+
        'Need to make changes to this event?' + '\n'+
        'Cancel:' +'\n'+
        '/cancellations/'+meetingId + '\n'+
        'Reschedule:' +'\n'+
        '/reschedule/'+meetingId + '\n'+'\n'+
        'Powered by CloudMeetIn.com ',
      start: {
        dateTime: body.gtmData.starttime
      },
      end: {
        dateTime: body.gtmData.endtime
      },
      attendees: [{
        responseStatus : "accepted",
        email: body.email }, { email: body.meetIngData.schedulerEmail }],
      reminders: {
        useDefault: true,
      }
    };
    localStorage.removeItem("meetingId");
    callback(event);
  } else {

    const event = {
      'summary': body.meetIngData.Meeting_owner + ' and ' + body.meetIngData.schedulerName,
      description: 'Event Name: ' + body.meetIngData.eventType + '\n'+
        'Contact Number: ' +body.meetIngData.schedulerPhone+ '\n'+
        'Reschedule Reason: ' +body.meetIngData.rescheduleReason+ '\n'+'\n'+
        'Need to make changes to this event?' + '\n'+
        'Cancel:' +'\n'+
        '/cancellations/'+meetingId + '\n'+
        'Reschedule:' +'\n'+
        '/reschedule/'+meetingId + '\n'+'\n'+
        'Powered by CloudMeetIn.com ',
      start: {
        dateTime: body.gtmData.starttime,

      },
      end: {
        dateTime: body.gtmData.endtime
      },
      attendees: [{
        responseStatus : "accepted",
        email: body.email
      }, { email: body.meetIngData.schedulerEmail }],
      reminders: {
        useDefault: true,
      }
    };
    localStorage.removeItem("meetingId");
    callback(event);
  }
};
// For update the event in google calendar
router.post('/eventUpdate',(req,res,next)=> {
  let usernameQuery = "SELECT token_path,calendarEvent FROM `calendly` WHERE email = '"+req.body.email+"'";
  db.query(usernameQuery, (err, result) => {
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      const TOKEN_PATH =  result[0].token_path;
      const calendarId =  result[0].calendarEvent;
      // console.log("Calendar ID---------------------", calendarId);
      // console.log(TOKEN_PATH);
      const token = fs.readFileSync(TOKEN_PATH);
      oauth2Client.setCredentials(JSON.parse(token));
      const calendar = google.calendar({version: 'v3'});
      // console.log('Request body======================= ', req.body);
     /* const event = {
        'summary': req.body.meetIngData.schedulerName,
        'start': {
          'dateTime': req.body.meetIngData.starttime,
          'timeZone': '',
        },
        'end': {
          'dateTime': req.body.meetIngData.endtime,
          'timeZone': '',
        },

      };*/
      customUpdateEvent(req.body, (event) => {
        // console.log(event);
        // // console.log(event);
        calendar.events.patch({
          auth: oauth2Client,
          calendarId: calendarId,
          eventId: req.body.eventId,
          resource: event,
          sendNotifications:true
        }, function(err, event) {
          if (err) {
            // console.log('There was an error contacting the Calendar service: ' + err);
            /* res.status(500).json( {
               message :  'There was an error contacting the Calendar service' +err
             });*/
          }
          // console.log("==================================================================");
          // console.log('Event updated ==========================>>>', event.data);
          // console.log("==================================================================");
          res.status(200).json( {
            message :  'Event is successfully updated in google calendar',
            data: event.data
          });
        });
      });
    }
  });
});

function removeEvents(auth, calendar, calendarId, eventID, body, callback){
  /*  calendar.events.delete({
      auth: auth,
      calendarId: calendarId,
      eventId: eventID,
      "sendUpdates": "all",

    }, function(err) {
      if (err) {
        // console.log('Error: ' + err);
       callback(err);
      }
       callback("200");
    });*/
  const event = {
    'summary': 'Canceled: ' +body.invitee + ' and ' + body.cancelBy,
    description: 'Event Name: ' + body.eventType + ' Minute Meeting'+ '\n'+ '\n'+
      'Cancellation Reason ' + body.cancelMessage + '\n'+ '\n'+
      'Powered by CloudMeetIn.com ',
    attendees: [
      {
        responseStatus : "declined",
        email: calendarId
      }
      , {
        responseStatus : "declined",
        email: body.schedulerEmail}
    ],
    conferenceData: {
      status: {
        statusCode: 'failure'
      },
    },

    reminders: {
      useDefault: true,
    }
  };

  // console.log("EVENT --- > ", event);
  calendar.events.patch({
    auth: auth,
    calendarId: calendarId,
    eventId: eventID,
    resource: event,
    "sendUpdates": "all",

  }, function(err) {
    if (err) {
      // console.log('Error: ' + err);
      callback(err);
    }
    callback("200");
  });
}

// For delete the event in google calendar
router.post('/delete',(req,res,next)=>{
  // console.log("req==========> ", req.body);
  let calendarID = req.body.email;
  let eventId = req.body.meetingDetail.eventID;
  let usernameQuery = "SELECT token_path FROM `calendly` WHERE email = '"+req.body.email+"'";
  db.query(usernameQuery, (err, result) => {
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      const TOKEN_PATH =  result[0].token_path;
      // console.log(TOKEN_PATH);
      const token = fs.readFileSync(TOKEN_PATH);
      oauth2Client.setCredentials(JSON.parse(token));
      const calendar = google.calendar({version: 'v3'});
      removeEvents(oauth2Client, calendar, calendarID, eventId,req.body.meetingDetail,  (response) =>{
        if(response === "200") {
          // console.log("EVENT --- > ", response);
          let updateUserQuery = "UPDATE `calendlymeeting` SET  `cancel` = 'true' ,`cancelMessage` = '"+req.body.meetingDetail.cancelMessage+"', `cancelBy` = '"+req.body.meetingDetail.cancelBy+"' WHERE `calendlymeeting`.`id` = '" + req.body.meetingDetail.id + "'";
          db.query(updateUserQuery, (err, result) => {
            if (err !== null) {
              // console.log('Req', req.body.id);
              res.status(500).json(err);
            } else {
              res.status(200).json({
                message: 'Event remove from gmail calendar',
              });
            }
          });
        } else {
          res.status(500).json(err);
        }
      });
    }
  });
});

// For delete the event in google calendar
router.post('/deletebymeetingid',(req,res,next)=>{
  // console.log("req==========> ", req.body);
  const TOKEN_PATH =  req.body.meetingDetail.tokenPath;
  // console.log("Token path -- > ",TOKEN_PATH);
  const token = fs.readFileSync(TOKEN_PATH);
  oauth2Client.setCredentials(JSON.parse(token));
  const calendar = google.calendar({version: 'v3'});
  removeEvents(oauth2Client, calendar,
    req.body.meetingDetail.calendarID, req.body.meetingDetail.eventId, req.body.meetingDetail,
    (response) =>{
      if(response === "200") {
        let updateUserQuery = "UPDATE `calendlymeeting` SET  `cancel` = 'true' ,`cancelMessage` = '"+req.body.meetingDetail.cancelMessage+"', `cancelBy` = '"+req.body.meetingDetail.cancelBy+"' WHERE `calendlymeeting`.`meetingId` = '" + req.body.meetingId + "'";
        db.query(updateUserQuery, (err, result) => {
          if (err !== null) {
            // console.log('Req', req.body.id);
            res.status(500).json(err);
          } else {
            res.status(200).json({
              message: 'Event remove from gmail calendar',
            });
          }
        });
      } else {
        res.status(500).json(err);
      }
    });
});

router.post('/signinwithgoogle',(req,res,next)=>{
  // console.log("req.body====",req.body);
  const TOKEN_PATH = './Token/calendar-nodejs-quickstart.json';
  const googleSecrets = JSON.parse(fs.readFileSync('credentials.json')).installed;
  const oauth2Client = new googleAuth.OAuth2Client(
    googleSecrets.client_id,
    googleSecrets.client_secret,
    googleSecrets.redirect_uris[0]
  );
  const token = fs.readFileSync(TOKEN_PATH);
  let tokenObject = JSON.parse(token);
  let refresh_token = tokenObject.refresh_token;
  let access_token = tokenObject.access_token;
  let scope = tokenObject.scope;
  let token_type = tokenObject.token_type;
  let expiry_date = tokenObject.expiry_date;

  let query = "UPDATE `calendly` SET  `accessToken` = '"+access_token+"' ,`refreshToken` = '"+refresh_token+"', `scope` = '"+scope+"', `tokenType` = '"+token_type+"' ,`expiryDate` = '"+expiry_date+"' WHERE `calendly`.`email` = '" + req.body.email + "'";
  db.query(query, (err, result) => {
    // console.log("result=====",result);
    // console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'Login Successfully.',
        data: JSON.parse(token)
      });
    }
  });
//// console.log("token===========",JSON.parse(token));
  /* const calendar = google.calendar({version: 'v3'});
   // console.log("calendar",calendar);*/


  /* oauth2Client.setCredentials(JSON.parse(token));
  const calendar = google.calendar({version: 'v3'});
  calendar.calendarList.list({ auth: oauth2Client }, function(err, resp) {
  let calc = [];
  resp.data.items.forEach(function(cal) {
  // // console.log(cal.summary + " - " + cal.id);
  calc.push(cal);
  });
  res.status(500).json({
  message: 'Sign Up.',
  data: token
  });
  });*/
});

router.post('/updateRole',(req,res,next)=>{
  // console.log(req.body);
  let query = "UPDATE `calendly` SET `role` = '" + req.body.role + "' WHERE `calendly`.`email` = '" + req.body.email + "'";
  db.query(query, (err, result) => {
    // console.log("result=====",result);
    // console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'updated Successfully.',
        data: result
      });
    }
  });
});

router.post('/updateConfiguration',(req,res,next)=>{
  // console.log(req.body);
  let query = "UPDATE `calendly` SET `startTime` = '" + req.body.inTime + "', `endTime` = '" + req.body.outTime +"',`availableDays` = '" + req.body.selectedOption+ "' WHERE `calendly`.`email` = '" + req.body.email + "'";
  db.query(query, (err, result) => {
    // console.log("result=====",result);
    // console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'updated Successfully.',
        data: result
      });
    }
  });
});

router.post('/checkuseremail',(req,res,next)=>{
  // console.log(req.body);
  let usernameQuery = "SELECT * FROM `calendly` WHERE email = '" + req.body.email + "'";
  db.query(usernameQuery, (err, result) => {
    // console.log("result=====",result);
    // console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'Search Successfully.',
        data: result
      });
    }
  });
});

router.post('/checkemailpassword',(req,res,next)=>{

  // console.log(req.body);
  let usernameQuery = "SELECT * FROM `calendly` WHERE email = '" + req.body.emailID + "' AND password = '"+ req.body.password+"'";
  db.query(usernameQuery, (err, result) => {
    // console.log("result=====",result);
    // console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      if(result.length > 0){
          let userId = result[0].userId;
          // console.log("UserId=====",userId);
       /*  calendarMiddleware.calCheckToken(userId,(calTokenStatus) => {
           if(calTokenStatus === 200) {
             const token = jwt.sign({
               userId: userId
             },'secret-code-for-token',{expiresIn: '1h'});

             res.status(200).json({
               message: 'Login Successfully.',
               data: result,
               token: token,
               expiresIn: 3600
             });
           }
         });*/
        const token = jwt.sign({
          userId: userId
        },'secret-code-for-token',{expiresIn: '1h'});

        res.status(200).json({
          message: 'Login Successfully.',
          data: result,
          token: token,
          expiresIn: 3600
        });

      }else{
        res.status(200).json({
          message: 'Invalid Credentials',
          data: result
        });
      }
    }
  });
});

router.post('/checkuser',(req,res,next)=>{
  // console.log(req.body);
  let usernameQuery = "SELECT id,email,userId,fullName,welcomeMessage,profilePic,calendarEvent,token_path FROM `calendly` WHERE userId = '" + req.body.userId + "'";
  db.query(usernameQuery, (err, result) => {
    // console.log("result=====",result);
    // console.log("err=====",err);
    if (err!==null) {
      return res.status(500).json({
        message: 'Internal Server Error.',
        data: err
      });
    }else {
      res.status(200).json({
        message: 'Sign Up Successfully.',
        data: result
      });
    }
  });
});

router.post('/updateCalendarEvent',(req,res,next)=>{
  // console.log(req.body);
  let query = "UPDATE `calendly` SET `calanderId` = '" + req.body.calnedarOption + "', `calendarEvent` = '" + req.body.eventType +"' WHERE `calendly`.`email` = '" + req.body.email + "'";
  db.query(query, (err, result) => {
    // console.log("result=====",result);
    // console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'updated Successfully.',
        data: result
      });
    }
  });
});


router.post('/updateUserProfile',(req,res,next)=>{
  // console.log(req.body);
  let query = "UPDATE `calendly` SET `fullName` = '" + req.body.fullName + "', `password` = '" + req.body.password +"',`welcomeMessage` = 'Welcome to my scheduling page.Please follow the instructions to add an event to my calendar' WHERE `calendly`.`email` = '" + req.body.emailID + "'";

  db.query(query, (err, result) => {
    // console.log("result=====",result);
    // console.log("err=====",err);
    if (err!==null) {
      return res.status(500).json({
        message: 'Internal Server Error.',
        data: err
      });
    }else {
      res.status(200).json({
        message: 'userId updated Successfully.',
        data: result
      });
    }
  });
});

router.post('/updateUser',(req,res,next)=>{
  // console.log(req.body);
  let query = "UPDATE `calendly` SET `userId` = '" + req.body.userId + "', `timeZone` = '" + req.body.timeZone + "' WHERE `calendly`.`email` = '" + req.body.email + "'";
  db.query(query, (err, result) => {
    // console.log("result=====",result);
    // console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'userId updated Successfully.',
        data: result
      });
    }
  });
});

router.post('/signup',(req,res,next)=>{
  // console.log("req.body====",req.body);
  const TOKEN_PATH = './Token/calendar-nodejs-quickstart.json';
  const googleSecrets = JSON.parse(fs.readFileSync('credentials.json')).installed;
  const oauth2Client = new googleAuth.OAuth2Client(
    googleSecrets.client_id,
    googleSecrets.client_secret,
    googleSecrets.redirect_uris[0]
  );
  const token = fs.readFileSync(TOKEN_PATH);
  let tokenObject = JSON.parse(token);
  let refresh_token = tokenObject.refresh_token;
  let access_token = tokenObject.access_token;
  let scope = tokenObject.scope;
  let token_type = tokenObject.token_type;
  let expiry_date = tokenObject.expiry_date;

  let query = "INSERT INTO `calendly` ( email, accessToken, refreshToken, tokenType, scope,expiryDate) VALUES ('"+req.body.email+"', '" + access_token + "', '" + refresh_token + "', '" + token_type + "', '" + scope + "', '" + expiry_date + "')";
  db.query(query, (err, result) => {
    // console.log("result=====",result);
    // console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'Sign Up Successfully.',
        data: JSON.parse(token)
      });
    }
  });





//// console.log("token===========",JSON.parse(token));
 /* const calendar = google.calendar({version: 'v3'});
  // console.log("calendar",calendar);*/


  /* oauth2Client.setCredentials(JSON.parse(token));
  const calendar = google.calendar({version: 'v3'});
  calendar.calendarList.list({ auth: oauth2Client }, function(err, resp) {
  let calc = [];
  resp.data.items.forEach(function(cal) {
  // // console.log(cal.summary + " - " + cal.id);
  calc.push(cal);
  });
  res.status(500).json({
  message: 'Sign Up.',
  data: token
  });
  });*/
});
router.get('/signup/calendar',(req,res,next)=>{
  const TOKEN_PATH = './Token/calendar-nodejs-quickstart.json';
  const googleSecrets = JSON.parse(fs.readFileSync('credentials.json')).installed;
  const oauth2Client = new googleAuth.OAuth2Client(
    googleSecrets.client_id,
    googleSecrets.client_secret,
    googleSecrets.redirect_uris[0]
  );
  const token = fs.readFileSync(TOKEN_PATH);
//// console.log("token===========",JSON.parse(token));
  const calendar = google.calendar({version: 'v3'});
  // console.log("calendar",calendar);

  res.status(500).json({
    message: 'Sign Up Successfully.',
    data: JSON.parse(token)
  });
  /* oauth2Client.setCredentials(JSON.parse(token));
  const calendar = google.calendar({version: 'v3'});
  calendar.calendarList.list({ auth: oauth2Client }, function(err, resp) {
  let calc = [];
  resp.data.items.forEach(function(cal) {
  // // console.log(cal.summary + " - " + cal.id);
  calc.push(cal);
  });
  res.status(500).json({
  message: 'Sign Up.',
  data: token
  });
  });*/
});



/*router.post('/login',(req,res,next)=>{
  let fetchUser;
  User.findOne({
    email:req.body.email
  }).then(user=>{
    if(!user){

      return res.status(401).json({
        message: 'Auth Faild User does not exists.'
      });
    }
    fetchUser = user;
    return bcrypt.compare(req.body.password,user.password);
  }).then(result => {
    if(!result){

      res.status(401).json({
        message: 'Auth Faild User Password Wrong.'
      });
      return;
    }

    const token = jwt.sign({
      email:fetchUser.email,
      userId: fetchUser._id
    },'secret-code-for-token',{expiresIn: '1h'});

    res.status(200).json({
      userId: fetchUser._id,
      token: token,
      expiresIn: 3600
    })
  }).catch(err =>{
    // console.log(err);
  });
});*/

// Get the start time and end time from database
router.post('/gettime',(req,res,next)=>{
  // console.log(req.body.email);
  let usernameQuery = "SELECT startTime, endTime, availableDays  FROM `calendly` WHERE email = '" + req.body.email + "'";
  db.query(usernameQuery, (err, result) => {
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      // console.log(result);
      res.status(200).json({
        message: 'Time is get successfully!',
        data: result
      });
    }
  });
});

// Get Available day api
router.post('/getAvailableDays',(req,res,next)=>{

  let usernameQuery = "SELECT availableDays,timeZone,fullName,profilePic,welcomeMessage,email FROM `calendly` WHERE userId = '"+req.body.userId+"'";
  db.query(usernameQuery, (err, result) => {
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({data: result});
    }
  });
});
// update start and end time by after the sign up

router.post('/updateUserConfiguration',(req,res,next)=>{
  // console.log(req.body);
  let query = "UPDATE `calendly` SET `startTime` = '" + req.body.inTime + "', `endTime` = '" + req.body.outTime +"',`availableDays` = '" + req.body.selectedOption+ "' WHERE `calendly`.`userId` = '" + req.body.userId + "'";
  db.query(query, (err, result) => {
    // console.log("result=====",result);
    // console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'updated Successfully.',
        data: result
      });
    }
  });
});


router.post('/getTimeAvailability',(req,res,next)=>{
  // console.log(req.body);
  let query =  "SELECT startTime , endTime , availableDays FROM `calendly` WHERE userId = '" + req.body.userId + "'";
  db.query(query, (err, result) => {
    // console.log("result=====",result);
    // console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'get time successfully.',
        data: result
      });
    }
  });
});
module.exports = router;
