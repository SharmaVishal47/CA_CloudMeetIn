const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../middleware/config');
let middleware = require('../middleware/zoom-auth');
let middleware1 = require('../middleware/google-calendar-auth');

router.post('/zoomcallback', function(req, res) {
  if (req.body.code) {
    const auth = "Basic " + new Buffer(config.zoom_client_id + ':' +config.zoom_client_secret).toString('base64');
    const url = config.zoomTokenEp + '?grant_type=authorization_code&code=' + req.body.code + '&redirect_uri=' + config.zoom_redirect_url;
    request.post({
      url: url,
      headers: {
        "Authorization": auth
      }
    }, function (error, response, body) {
      if (error) {
        console.log("Error when getting Zoom token = " + error);
        return;
      }
      body = JSON.parse(body);
      console.log(body);
      if (body.access_token) {
        let integrationStatus =  true;
        let query = "INSERT INTO `zoommeetigintegration` (user_id, access_token, token_type, refresh_token, expires_in, scope, integrationStatus) " +
          "VALUES ('"+req.body.user_id+"', '" + body.access_token + "', '" + body.token_type + "', '" + body.refresh_token + "', '" +body.expires_in + "','" +body.scope + "', '" + integrationStatus + "')";
        db.query(query, (err, result) => {
          if (err!==null) {
            return res.status(500).send(err);
          }else {
            let query = "UPDATE `calendly` SET  `zoom` = '"+true+"' WHERE `calendly`.`userId` = '" + req.body.user_id + "'";
            db.query(query, (err, result) => {
              console.log("result=====",result);
              console.log("err=====",err);
              if (err!==null) {
                return res.status(500).send(err);
              }else {
                res.status(200).json({
                  message: 'Zoom integration successfully.',
                  data: result
                });
              }
            });
          }
        });
      } else {
        console.log("FATAL - could not get zoom token");
      }
      return;
    });

  } else {
    console.log("Missing code from Zoom");
  }
});

router.post('/checkintegrationstatus', function(req, res) {
  let query = "SELECT * FROM `zoommeetigintegration` WHERE user_id= '"+req.body.user_id+"'";
  console.log("query---", query)
  db.query(query, (err, result) => {
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      res.status(200).json({
        message: 'zoom integration status get successfully.',
        data : result
      });
    }
  });
});

router.post('/disconnectzoomintegration', function(req, res) {
  let query = "DELETE FROM `zoommeetigintegration` WHERE user_id= '"+req.body.user_id+"'";
  db.query(query, (err, result) => {
    if (err!==null) {
      return res.status(500).send(err);
    } else {
      let query = "UPDATE `calendly` SET  `zoom` = '"+false+"' WHERE `calendly`.`userId` = '" + req.body.user_id + "'";
      db.query(query, (err, result) => {
        console.log("result=====",result);
        console.log("err=====",err);
        if (err!==null) {
          return res.status(500).send(err);
        }else {
          res.status(200).json({
            message: 'Zoom integration disconnect successfully.',
            data: result
          });
        }
      });
    }
  });
});

router.post('/insert',middleware.checkToken, function(req, res) {
  res.status(200).json({
    message: 'Zoom integration token have refresh',
  });
});

module.exports = router;
