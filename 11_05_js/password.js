const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/validateUser', (req, res, next) => {

  console.log(req.body);
  let uservalidityQuery = "SELECT email, userId FROM `calendly` WHERE email = '" + req.body.emailId + "' ";
  db.query(uservalidityQuery, (err, result) => {
    console.log("result uservalidityQuery-----> ", result);
    console.log("err-- uservalidityQuery-- ", err);
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      if (result.length > 0) {
        let email = result[0].email;
        console.log("UserId=====", email);
        const token = jwt.sign({
          email: email,
          expires:Date.now()+3600000
        },'secret-code-for-token',{expiresIn: '1h'});
        ///////////////////////////////////////////////////////////
        res.status(200).json({
          message: 'Authorized user id',
          data: result,
          token:token
        });
      } else {
        res.status(200).json({
          message: 'Invalid user id',
          data: result
        });
      }
    }
  });
});
router.post('/checkTokenData',(req,res,next)=> {
  let flag = false;
  try {
    const decodedToken = jwt.verify(req.body.token,'secret-code-for-token');
    console.log('Token data ',decodedToken);
    console.log('Email id-- ',req.body.email);
    let exp =parseInt(decodedToken.expires);
    let loadTimeInMS = Date.now();
    console.log('Token exp ',exp);
    console.log('Token loadTimeInMS ',loadTimeInMS);
    if(loadTimeInMS < exp && req.body.email===decodedToken.email){
      console.log('Token valid');
      res.status(200).json({
        message: 'Valid token',
        valid:true
      });
  } else {
        console.log('Token Expired');
        res.status(404).json({
          message: 'Invalid Token',
          valid:false
        });

      }
    } catch(error) {
      console.log('Token Expired in Catch block');
      flag = true;
     /* res.status(404).json({
        message: 'Invalid Token',
        valid:false
      });*/
    }
    if(flag) {
      res.status(201).json({
        message: 'Invalid Token',
        valid:false
      });
    }
});


router.post('/updatePassword',(req,res,next)=>{
  console.log("password ------------------->", req.body.password);
  console.log("Email ------------------->", req.body.email);
  let updatePasswordQuery ="UPDATE `calendly` SET `password` = '" + req.body.password + "'   WHERE `calendly`.`email` = '" + req.body.email + "'";
  db.query(updatePasswordQuery, (err, result) => {
    if (err!==null) {
      console.log('Req',req.body.userID);
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'userData Get Successfully.',
        data: result
      });
    }
  });
});


router.post('/checkTokenDataEmail',(req,res,next)=>{
  const decodedToken = jwt.verify(req.body.token,'secret-code-for-token');
  console.log('Token data ',decodedToken);
  console.log('Email id-- ',req.body.email);
  console.log('decodedToken email-->', decodedToken.oldEmail);
  let exp =parseInt(decodedToken.expires);
  let loadTimeInMS = Date.now();
  console.log('Token exp ',exp);
  console.log('Token loadTimeInMS ',loadTimeInMS);
  /*---------------------------------------------------------------------*/
  let query = "SELECT email FROM `calendly` WHERE email = '" + decodedToken.oldEmail + "'";
  db.query(query, (err, result) => {
    console.log("result=====", result);
    console.log("err=====", err);
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      try{
        let userEmail =result[0].email;
        console.log('userEmail', userEmail);
        if(loadTimeInMS<exp && decodedToken.oldEmail===userEmail){
          let query = "UPDATE `calendly` SET `email` = '" + req.body.email + "'  WHERE email = '" + decodedToken.oldEmail + "' ";
          db.query(query, (err, result) => {
            console.log("result=====", result);
            console.log("err=====", err);
            if (err !== null) {
              return res.status(500).send(err);
            } else {
              res.status(200).json({
                message: 'Valid token',
                valid:true
              });
            }
          });
        }else{
          console.log('Token Expired');
          res.status(404).json({
            message: 'Invalid Token',
            valid:false
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
});

//Send email using nodemailer
/*function sendMail(email, subject,  text) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.googleMail.userName,
      pass: config.googleMail.password,
    }
  });

  let mailOptions = {
    from: config.googleMail.userName,
    to: email,
    subject: subject,
    if (error) {
      console.log('error sending mail', error);
    text: text
  };

  transporter.sendMail(mailOptions, function (error, info) {
      error.status(500).json({
        message: 'Some error sent INfo.response: ',
        data: JSON.parse(error),
      });
    } else {
      console.log('Email sent INfo.response: ' + JSON.parse(info.response));
      info.status(200).json({
        message: 'Email sent INfo.response: ',
        data: JSON.parse(info.response),
      });
    }
  });
}*/
module.exports = router;

