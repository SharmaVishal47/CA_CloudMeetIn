const express = require('express');
const router = express.Router();
const schedule = require('node-schedule');

let startTime = new Date(Date.now());
let j = schedule.scheduleJob({ start: startTime, rule: '*/60*30 * * * * *' }, function(){

  /*let j = schedule.scheduleJob({hour: 0, minute: 0, dayOfWeek: 0}, function(){//run every sunday at 12am*/
  let usernameQuery = "SELECT * FROM `g2meetingintegration`";
  db.query(usernameQuery, (err, result) => {
    if (err!==null) {
      return;
    }else {
      if(result.length>0){
        for(let i=0;i<result.length;i++){
          let refreshToken = result[i].refresh_token;
          let userId = result[i].userId;
          if(refreshToken != null && refreshToken != undefined){
            let data = "nQK9NcecyeyuXtnY4dM9OvJ3yI5uhVxH"+':'+"qnAAlqfUmAwNOPpc";
            let buff = new Buffer(data);
            let client_id_client_secret64 = buff.toString('base64');
            const url = 'https://api.getgo.com/oauth/v2/token?grant_type=refresh_token&refresh_token='+refreshToken;
            request.post({
              url: url,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': 'Basic '+client_id_client_secret64
              }
            }, function (error, response, body) {
              if (error) {
              }else{
                body = JSON.parse(body);
                console.log("GTM body=====",body);
                if (body.access_token) {
                  let access_token = body.access_token;
                  let email = body.email;
                  let account_key = body.account_key;
                  let firstName = body.firstName;
                  let lastName = body.lastName;
                  let organizer_key = body.organizer_key;
                  let refresh_token = body.refresh_token;

                  let query = "UPDATE `g2meetingintegration` SET  `access_token` = '"+access_token+"',`email` = '"+email+"',`account_key` = '"+account_key+"',`firstName` = '"+firstName+"',`lastName` = '"+lastName+"',`organizer_key` = '"+organizer_key+"',`refresh_token` = '"+refresh_token+"' WHERE `userId` = '" + userId + "'";
                  db.query(query, (err, result) => {

                  });
                } else {

                }
              }
            });
          }
        }
      }
    }
  });
});

/* This function use to get the access_token of GTM*/
router.post('/getAccessToken', function(req, res) {
  let usernameQuery = "SELECT * FROM `g2meetingintegration` WHERE userId = '" + req.body.userId+ "'";
  db.query(usernameQuery, (err, result) => {
    if (err!==null) {
      return res.status(500).send("Internal Server Error");
    }else {
      if(result.length>0){
        let access_token = result[0].access_token;
        res.status(200).json({
          message: 'Get Token Successfully.',
          data: access_token
        });
      }else {
        return res.status(500).send("Internal Server Error");
      }
    }
  });
});

router.post('/addMeetingWithGtm',(req,res,next)=>{
  let query = "INSERT INTO `calendlymeeting` ( g2mMeetingId,g2mMeetingUrl,userId, timeZone, eventType, meetingTime, meetingDate,schedulerName,schedulerEmail,schedulerPhone,schedulerDescription, g2mMeetingCallNo) VALUES ('"+req.body.g2mMeetingId+"','"+req.body.g2mMeetingUrl+"','"+req.body.userId+"', '" + req.body.timeZone + "', '" + req.body.eventType + "', '" + req.body.time + "', '" + req.body.date + "', '" + req.body.schedulerName + "','"+req.body.schedulerEmail+"','"+req.body.schedulerPhone+"','"+req.body.schedulerDescription+"','"+req.body.g2mMeetingCallNo+"')";
  db.query(query, (err, result) => {
    console.log("result=====",result);
    console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'Meeting Add Successfully.',
        data: result
      });
    }
  });
});
router.post('/addMeeting',(req,res,next)=>{
  let query = "INSERT INTO `calendlymeeting` ( userId, timeZone, eventType, meetingTime, meetingDate,schedulerName,schedulerEmail,schedulerPhone,schedulerDescription) VALUES ('"+req.body.userId+"', '" + req.body.timeZone + "','" + req.body.eventType + "', '" + req.body.time + "', '" + req.body.date + "', '" + req.body.schedulerName + "','"+req.body.schedulerEmail+"','"+req.body.schedulerPhone+"','"+req.body.schedulerDescription+"')";
  db.query(query, (err, result) => {
    console.log("result=====",result);
    console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'Meeting Add Successfully.',
        data: result
      });
    }
  });
});

// Update meeting record when user select reschedule meetings
router.post('/rescheduleMeeting',(req,res,next)=>{
  console.log("req..................", req.body);
  let query =
    "UPDATE `calendlymeeting` SET  `timeZone` = '"+req.body.timeZone+"',`meetingTime` = '"+req.body.time+"',`meetingDate` = '"+req.body.date+"',`schedulerName` = '"+req.body.schedulerName+"',`schedulerEmail` = '"+req.body.schedulerEmail+"',`reschedulerName` = '"+req.body.reschedulerName+"',`rescheduleReason` = '"+req.body.rescheduleReason+"' WHERE `userId` = '" + req.body.userId + "' AND `eventId` = '"+req.body.eventId+"'";
  console.log("Update -------------------> ",query);
  db.query(query, (err, result) => {
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'Meeting Reschedule Successfully.',
        data: result
      });
    }
  });
});
router.post('/addEventID',(req,res,next)=>{
  let query = "UPDATE `calendlymeeting` SET  `eventId` = '"+req.body.eventId+"' WHERE `userId` = '" + req.body.userID + "' AND `id` = '"+ req.body.insertId+"'";

  db.query(query, (err, result) => {
    console.log("result=====",result);
    console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'Event Id  Add Successfully.',
        data: result
      });
    }
  });
});
router.post('/getMeetingRecord',(req,res,next)=>{
  console.log(req.body);
   let usernameQuery = "SELECT * FROM `calendlymeeting` WHERE userId = '" + req.body.userId+ "'";
  db.query(usernameQuery, (err, result) => {
    console.log("result=====",result);
    console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'Get Records Successfully.',
        data: result
      });
    }
  });
});

router.post('/disconnectgtmintegration', function(req, res) {
  let query = "DELETE FROM `g2meetingintegration` WHERE userId='"+req.body.userId+"'";
  console.log("query---", query)
  db.query(query, (err, result) => {
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      let query = "UPDATE `calendly` SET `go2meeting` = '"+false+"' WHERE `calendly`.`userId`='" + req.body.userId + "'";
      db.query(query, (err, result) => {
        console.log("result=====",result);
        console.log("err=====",err);
        if (err!==null) {
          return res.status(500).send(err);
        }else {
          res.status(200).json({
            message: 'GTM integration disconnect successfully.',
          });
        }
      });
    }
  });
});
module.exports = router;
