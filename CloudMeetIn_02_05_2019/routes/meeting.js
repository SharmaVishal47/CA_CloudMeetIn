const express = require('express');
const router = express.Router();
const schedule = require('node-schedule');
const ULID = require('ulid');
const localStorage = require('localStorage');
const request = require('request');
const cron = require('node-cron');

cron.schedule('*/30 * * * *', () => {
  let gtmQuery = "SELECT * FROM `g2meetingintegration`";
  console.log("gtmQuery===========",gtmQuery);
  db.query(gtmQuery, (err, result) => {
    if (err!==null) {
      return;
    } else {
      console.log("GTM DataBAse===========",result);
      if(result.length>0){
        for(let i=0;i<result.length;i++){
          let refreshToken = result[i].refresh_token;
          let userId = result[i].userId;
          if(refreshToken != null && refreshToken != undefined){
            //let data = "nQK9NcecyeyuXtnY4dM9OvJ3yI5uhVxH"+':'+"qnAAlqfUmAwNOPpc";
            let data = "2dWCGOZLt9Y28Rmc0xfWNz84kPGkEpfA"+':'+"9uFMfxwb5tG1zK0O";
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
                console.log("GTM error=====",error);
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

/*router.post('/addMeetingWithGtm',(req,res,next)=>{
  let meetingUniqueId  = ULID.ulid();
  localStorage.setItem("meetingId",meetingUniqueId );
  let query = "INSERT INTO `calendlymeeting` (meetingId,g2mMeetingId,g2mMeetingUrl,userId, timeZone, eventType, meetingTime, meetingDate,schedulerName,schedulerEmail,schedulerPhone,schedulerDescription, g2mMeetingCallNo,meetingEndTime) VALUES ('"+meetingUniqueId+"','"+req.body.g2mMeetingId+"','"+req.body.g2mMeetingUrl+"','"+req.body.userId+"', '" + req.body.timeZone + "', '" + req.body.eventType + "', '" + req.body.starttime + "', '" + req.body.date + "', '" + req.body.schedulerName + "','"+req.body.schedulerEmail+"','"+req.body.schedulerPhone+"','"+req.body.schedulerDescription+"','"+req.body.g2mMeetingCallNo+"','"+req.body.endtime+"')";

  console.log("addMeetingWithGtm query=====",query);
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
  let meetingUniqueId  = ULID.ulid();
  localStorage.setItem("meetingId",meetingUniqueId );
  let query = "INSERT INTO `calendlymeeting` ( userId, meetingId, timeZone, eventType, meetingTime, meetingEndTime,meetingDate,schedulerName,schedulerEmail,schedulerPhone,schedulerDescription) VALUES ('"+req.body.userId+"', '" + meetingUniqueId + "', '" + req.body.timeZone + "','" + req.body.eventType + "', '" + req.body.starttime+ "', '"+  req.body.endtime+ "', '" + req.body.date + "', '" + req.body.schedulerName + "','"+req.body.schedulerEmail+"','"+req.body.schedulerPhone+"','"+req.body.schedulerDescription+"')";
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
});*/

router.post('/addMeetingWithGtm',(req,res,next)=>{
  let meetingUniqueId  = ULID.ulid();
  localStorage.setItem("meetingId",meetingUniqueId );
  let query = "INSERT INTO `calendlymeeting` (meetingId,g2mMeetingId,g2mMeetingUrl,userId, timeZone, eventType, meetingTime, meetingDate,schedulerName,schedulerEmail,schedulerPhone,schedulerDescription, g2mMeetingCallNo,meetingEndTime,createdDate) VALUES ('"+meetingUniqueId+"','"+req.body.g2mMeetingId+"','"+req.body.g2mMeetingUrl+"','"+req.body.userId+"', '" + req.body.timeZone + "', '" + req.body.eventType + "', '" + req.body.starttime + "', '" + req.body.date + "', '" + req.body.schedulerName + "','"+req.body.schedulerEmail+"','"+req.body.schedulerPhone+"','"+req.body.schedulerDescription+"','"+req.body.g2mMeetingCallNo+"','"+req.body.endtime+"','"+req.body.createdDate+"')";

  console.log("addMeetingWithGtm query=====",query);
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
  let meetingUniqueId  = ULID.ulid();
  localStorage.setItem("meetingId",meetingUniqueId );
  let query = "INSERT INTO `calendlymeeting` ( userId, meetingId, timeZone, eventType, meetingTime, meetingEndTime,meetingDate,schedulerName,schedulerEmail,schedulerPhone,schedulerDescription,createdDate) VALUES ('"+req.body.userId+"', '" + meetingUniqueId + "', '" + req.body.timeZone + "','" + req.body.eventType + "', '" + req.body.starttime+ "', '"+  req.body.endtime+ "', '" + req.body.date + "', '" + req.body.schedulerName + "','"+req.body.schedulerEmail+"','"+req.body.schedulerPhone+"','"+req.body.schedulerDescription+"','"+req.body.createdDate+"')";
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
  let meetingUniqueId  = ULID.ulid();
  localStorage.setItem("meetingId",meetingUniqueId );
  let query = "UPDATE `calendlymeeting` SET `meetingId` = '"+meetingUniqueId+"', `timeZone` = '"+req.body.timeZone+"',`meetingTime` = '"+req.body.starttime+"', `meetingEndTime` = '"+req.body.endtime+"',`meetingDate` = '"+req.body.date+"',`schedulerName` = '"+req.body.schedulerName+"',`schedulerEmail` = '"+req.body.schedulerEmail+"',`reschedulerName` = '"+req.body.reschedulerName+"',`rescheduleReason` = '"+req.body.rescheduleReason+"' WHERE `userId` = '" + req.body.userId + "' AND `eventId` = '"+req.body.eventId+"'";
  console.log("Update -------------------> ",query);
  db.query(query, (err, result) => {
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'Meeting Reschedule Successfully.',
        data: result,
        meetingUniqueId: meetingUniqueId
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


router.get('/getmeetingrecords:meetingUID', (req, res, next) => {
  let query = "SELECT * FROM `calendlymeeting` WHERE meetingId ='" + req.params.meetingUID + "'";
  console.log("-----------meetingUID Query  ", query);
  db.query(query, (err, result) => {
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      res.status(200).json({
        message: 'One meeting records get successfully.',
        data: result
      });
    }
  });
});
module.exports = router;
