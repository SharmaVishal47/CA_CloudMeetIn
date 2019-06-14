const express = require('express');
const router = express.Router();


/*router.post('/getgotomeeting',(req,res,next)=>{
  let integrationQuery = "SELECT  * FROM `g2meetingintegration` WHERE userId = '" + req.body.userId + "'";
  db.query(integrationQuery, (err, result) => {
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'Go2Meeting Get Successfully.',
        data: result
      });
    }
  });
});*/

router.post('/getgotomeeting',(req,res,next)=>{
  let integrationQuery = "SELECT  * FROM `g2meetingintegration` WHERE userId = '" + req.body.userId + "'";
  db.query(integrationQuery, (err, result) => {
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'Go2Meeting Get Successfully.',
        data: result
      });
    }
  });
});

router.post('/gotomeetingAdd',(req,res,next)=>{
  let query = "INSERT INTO `g2meetingintegration` ( email,access_token,account_key, firstName,lastName,organizer_key,refresh_token,userId,expires_in) VALUES ('"+req.body.email+"','"+req.body.access_token+"','"+req.body.account_key+"', '" + req.body.firstName+"', '" + req.body.lastName+"', '" + req.body.organizer_key+"','"+req.body.refresh_token+"','"+req.body.userId+"','"+req.body.expires_in+"' )";
  db.query(query, (err, result) => {
    console.log("result=====",result);
    console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      let query = "UPDATE `calendly` SET  `go2meeting` = '"+true+"' WHERE `calendly`.`userId` = '" + req.body.userId + "'";
      db.query(query, (err, result) => {
        console.log("result=====",result);
        console.log("err=====",err);
        if (err!==null) {
          return res.status(500).send(err);
        }else {
          res.status(200).json({
            message: 'Go2Meeting Add Successfully.',
            data: result
          });
        }
      });
    }
  });
});


// This api use for get the go to meeting credentials from the database table
router.post('/gotoMeetingCredentials', (req,res,next) => {
  let integrationQuery = "SELECT * FROM `g2meetingintegration` WHERE userId = '" + req.body.userId + "'";
  console.log("-------integrationQuery--- >> ", integrationQuery);
  db.query(integrationQuery, (err, result) => {
    if (err!==null) {
      /*return res.status(500).send(JSON.stringify(err));*/
      res.status(500).json({
        message: 'GoTo meeting credentials get Successfully.',
        data: []
      });
    }else {
      res.status(200).json({
        message: 'GoTo meeting credentials get Successfully.',
        data: result
      });
    }
  });
});
module.exports = router;
