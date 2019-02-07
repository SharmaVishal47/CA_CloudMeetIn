const express = require('express');
const router = express.Router();

router.post('/addMeetingWithGtm',(req,res,next)=>{
  let query = "INSERT INTO `calendlymeeting` ( g2mMeetingId,g2mMeetingUrl,userId, timeZone, eventType, meetingTime, meetingDate,schedulerName,schedulerEmail,g2mMeetingCallNo) VALUES ('"+req.body.g2mMeetingId+"','"+req.body.g2mMeetingUrl+"','"+req.body.userId+"', '" + req.body.timeZone + "', '" + req.body.eventType + "', '" + req.body.time + "', '" + req.body.date + "', '" + req.body.schedulerName + "','"+req.body.schedulerEmail+"','"+req.body.g2mMeetingCallNo+"')";
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
  let query = "INSERT INTO `calendlymeeting` ( userId, timeZone, eventType, meetingTime, meetingDate,schedulerName,schedulerEmail) VALUES ('"+req.body.userId+"', '" + req.body.timeZone + "','" + req.body.eventType + "', '" + req.body.time + "', '" + req.body.date + "', '" + req.body.schedulerName + "','"+req.body.schedulerEmail+"')";
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
module.exports = router;
