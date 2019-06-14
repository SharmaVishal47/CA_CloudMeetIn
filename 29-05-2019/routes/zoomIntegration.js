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
/*middleware.checkToken*/
router.get('/getuserlist', function(req, res) {
  request.get({
    url: 'https://api.zoom.us/v2/users',
    headers: {
      "Authorization": 'Bearer' + 'eyJhbGciOiJIUzUxMiJ9.eyJ2ZXIiOiI0IiwiY2xpZW50SWQiOiJkdlJzTFA1Y1NPRm9zcmNHNERmMXciLCJpc3MiOiJ1cm46em9vbTpjb25uZWN0OmNsaWVudGlkOmR2UnNMUDVjU09Gb3NyY0c0RGYxdyIsImF1dGhlbnRpY2F0aW9uSWQiOiIxZWY3NzhlMmNlNzhiMDY5ZWQ5YTdmNDM3NDU3MTBlNiIsImVudiI6W251bGxdLCJ1c2VySWQiOiJGOVdQTU9mNFJadU9GX3gwbFFZX01RIiwiYXVkIjoiaHR0cHM6Ly9vYXV0aC56b29tLnVzIiwiYWNjb3VudElkIjoieVQ0Z2tNWTNRTjJCUndfNkFUUXNodyIsIm5iZiI6MTU1NzUwOTk2OSwiZXhwIjoxNTU3NTEzNTY5LCJ0b2tlblR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJpYXQiOjE1NTc1MDk5NjksImp0aSI6IjgwOTZkZmY4LWE2MmYtNDRmMC05MDAyLTVjNDM5MmRhYWZkMCIsInRvbGVyYW5jZUlkIjowfQ.43jePd4WlkNYzECmRVcEf_9VMm_fGWPltIPUYPYSOb8_5uwLaYJgDpEK1tWzzggikcs1jtK1aWA6iYMDbBUNBg'
    }
  }, function (error, response, body) {
    if (error) {
      console.log("Error when getting Zoom token = " + error);
      return;
    } else {
      let _body = JSON.parse(body);
      console.log("Get the user list from Zoom",  _body)
      res.status(200).json({
      message: _body
    });
    }
  });
});
router.post('/insertMeeting', function(req, res) {
  console.log("=============================================================================================================================");
  console.log("Insert meeting in zoom");
  console.log("=============================================================================================================================");
  let userId = 'sumit.kumar@cloudanalogy.com';
  let acces_token = 'eyJhbGciOiJIUzUxMiJ9.eyJ2ZXIiOiI0IiwiY2xpZW50SWQiOiJkdlJzTFA1Y1NPRm9zcmNHNERmMXciLCJpc3MiOiJ1cm46em9vbTpjb25uZWN0OmNsaWVudGlkOmR2UnNMUDVjU09Gb3NyY0c0RGYxdyIsImF1dGhlbnRpY2F0aW9uSWQiOiJmMjE1YWUyYThmY2E0Mzc0OWM3Mjg5ZjJkODliYTczNCIsImVudiI6W251bGxdLCJ1c2VySWQiOiJGOVdQTU9mNFJadU9GX3gwbFFZX01RIiwiYXVkIjoiaHR0cHM6Ly9vYXV0aC56b29tLnVzIiwiYWNjb3VudElkIjoieVQ0Z2tNWTNRTjJCUndfNkFUUXNodyIsIm5iZiI6MTU1NzU3MzIwOCwiZXhwIjoxNTU3NTc2ODA4LCJ0b2tlblR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJpYXQiOjE1NTc1NzMyMDgsImp0aSI6ImY0ZjNjM2Q0LTI2MjktNDI2ZS1hNzQzLWM3YjQyYWMzM2FmZSIsInRvbGVyYW5jZUlkIjowfQ.r8BMV78uiI39krPUDbgFAriiYVbEsq2S5Met-bYUc0-fLb6PrTGE_SBOq8hkj7mdIuFVNlmd-xerR_RV18YJnQ';
  request.post({
    url: 'https://api.zoom.us/v2/users/'+userId+'/meetings',
    headers: {
      "Authorization": 'Bearer' + acces_token
    },
    json: true,
    body: {
      "topic": "First Meeting with Zoom2",
      "start_time": "2019-05-12T18:30:00.678Z",
      "duration": "60",
      "timezone": "Asia/kolkata"
    }
  }, function (error, response, body) {
    if (error) {
      console.log("Error when getting Zoom token = " + error);
      return;
    } else {
      let _body = body;
      console.log("Get the user list from Zoom",  _body)
      res.status(200).send(_body);
    }
  });
});
module.exports = router;
