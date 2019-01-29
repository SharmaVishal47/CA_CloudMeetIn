const express = require('express');
const router = express.Router();


router.post('/getgotomeeting',(req,res,next)=>{
  let integrationQuery = "SELECT id,emailId,password,clientId,userId FROM `g2meetingintegration` WHERE userId = '" + req.body.userId + "'";
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
  let integrationQuery = "SELECT id,emailId,password,clientId,userId FROM `g2meetingintegration` WHERE userId = '" + req.body.userId + "'";
  db.query(integrationQuery, (err, result) => {
    if(result.length>0){
      let query = "UPDATE `g2meetingintegration` SET `emailId` = '" + req.body.emailId + "', `password` = '" + req.body.password +"',`userId` = '" + req.body.userId+ "',"+"`clientId` = '" + req.body.clientId+"' WHERE `g2meetingintegration`.`userId` = '" + req.body.userId + "'";
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
    }else{
      let query = "INSERT INTO `g2meetingintegration` ( emailId,password,userId, clientId) VALUES ('"+req.body.emailId+"','"+req.body.password+"','"+req.body.userId+"', '" + req.body.clientId+"')";
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
    }
  });
});

module.exports = router;
