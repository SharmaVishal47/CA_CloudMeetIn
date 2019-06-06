const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const config = require("../middleware/config");
const fs = require('fs');

// create auth client
const oauth2Client = new OAuth2(
  config.google_calendar.google_cal_client_id,
  config.google_calendar.google_cal_client_secret,
  config.google_calendar.google_cal_redirect_url
);

exports.calCheckToken = (callback) => {
 /* let usernameQuery = "SELECT token_path FROM `calendly` WHERE userId = '"+user_id+"'";*/
  let usernameQuery = "SELECT token_path FROM `calendly`";
  db.query(usernameQuery, (err, result) => {
    if (err !== null) {
      callback(err);
    } else {
      if(result.length>0){
        for(let i=0;i<result.length;i++){
          const TOKEN_PATH = result[i].token_path;
          // console.log("Token path --- ", TOKEN_PATH);
          fs.readFile(TOKEN_PATH, (err, content) => {
            if (err) // console.log('Error loading client secret file:', err);

            let token = JSON.parse(content);
            // console.log('1');
            // set the current users access and refresh token
            oauth2Client.setCredentials({
              access_token: token.access_token,
              refresh_token: token.refresh_token
            });

            // request a new token
            oauth2Client.refreshAccessToken(function (err, tokens) {
              if (err) {
                // console.log('erro refreshAccessToken');
                callback(err);
              }
              //save the new token and expiry_date
              // console.log("Token" , tokens);
              // console.log("Token" , typeof (tokens));
              let checkPoint = typeof (tokens) === 'object' ? true : false;
              if(checkPoint) {
                fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), (err) => {
                  if (err) {
                    // console.log('err', err);
                    callback(err);
                  } else {
                    // console.log('Token stored to', TOKEN_PATH);
                    callback(200);
                  }
                });
              }

            });
          });
        }
      }
    }
  });
};

