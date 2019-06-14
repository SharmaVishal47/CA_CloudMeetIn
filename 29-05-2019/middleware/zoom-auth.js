const config = require('./config.js');
const request = require('request');

let checkToken = (req, res, next) => {
  const auth = "Basic " + new Buffer(config.zoom_client_id + ':' + config.zoom_client_secret).toString('base64');
  // const url = config.zoomTokenEp + '?grant_type=refresh_token&refresh_token= n&refreshToken &refresh_token=' + req.body.refreshToken + '&redirect_uri=' + config.zoom_redirect_url;
  // console.log("Token=-------------- ",url);
  const url= config.zoomTokenEp + '?grant_type=refresh_token&refresh_token='+req.body.refreshToken;
  request.post( {
    url: url,
    headers : {
      "Authorization" : auth
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error when getting Zoom token = " + error);
    }
    body = JSON.parse(body);
    if (body.access_token) {
      console.log("Got new access and refresh tokens", body);
      let query = "UPDATE `zoommeetigintegration` SET  `access_token` = '"+body.access_token+"',`token_type` = '"+body.token_type+"',`refresh_token` = '"+body.refresh_token+"',`expires_in` = '"+body.expires_in+"',`scope` = '"+body.scope+"' WHERE `user_id` = '" + req.body.user_id + "'";
      db.query(query, (err, result) => {
        if (err!==null) {
          return res.status(500).send(err);
        }else {

          next();
        }
      });
    } else {
      console.log("FATAL - could not refresh access token");
    }
  });
};

module.exports = {
  checkToken: checkToken
};


