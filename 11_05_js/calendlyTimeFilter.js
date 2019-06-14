
const express = require('express');
const router = express.Router();

router.post('/meetingTime',(req,res,next)=>{

   let usernameQuery = "SELECT * FROM `calendlytimefilter` WHERE userId = '"+req.body.userId+"' AND meetingDate = '"+req.body.meetingDate+"'";
  console.log("usernameQuery===========",usernameQuery);
  db.query(usernameQuery, (err, result) => {
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      if(result.length === 0 ) {
        res.status(200).json({
          "message" : "Sorry!, No record found on this userID",
          "data" :  result
        });
      } else {
        res.status(200).json({
          "message" : "Records successfully get",
          "data" :  result
        });
      }
    }
  });
});
router.post('/insertMeetingRecords',(req,res,next)=>{
  let query = "INSERT INTO `calendlytimefilter` ( userId, meetingDate, meetingTimeList) VALUES ('"+req.body.userId+"', '" + req.body.meetingDate + "','" + req.body.meetingTimeList + "')";
  db.query(query, (err, result) => {
    console.log("result=====",result);
    console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'Meeting Records Add Successfully.',
        data: result
      });
    }
  });
});

router.post('/updateMeetingRecords',(req,res,next)=>{
  let query = "UPDATE `calendlytimefilter` SET `meetingTimeList` = '" + req.body.meetingTimeList + "' WHERE userId = '"+req.body.userId+"' AND meetingDate = '"+req.body.meetingDate+"'";
  console.log("Query Data===========================", query);
  db.query(query, (err, result) => {
    console.log("result=====",result);
    console.log("err=====",err);
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
module.exports = router;
