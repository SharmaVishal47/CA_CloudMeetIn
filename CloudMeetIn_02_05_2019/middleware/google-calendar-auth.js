const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const config = require("../middleware/config");
const fs = require('fs');
let path = require("path");

// create auth client
const oauth2Client = new OAuth2(
  config.google_calendar.google_cal_client_id,
  config.google_calendar.google_cal_client_secret,
  config.google_calendar.google_cal_redirect_url
);
let _TOKEN_PATH = [];
let count = 0;
let lengthOfresult ;





exports.calCheckToken = () => {
 /* let usernameQuery = "SELECT token_path FROM `calendly` WHERE userId = '"+user_id+"'";*/
  let usernameQuery = "SELECT token_path FROM `calendly`";
  db.query(usernameQuery, (err, result) => {
    if (err !== null) {
      callback(err);
    } else {
      lengthOfresult = 0;
      _TOKEN_PATH = [];
      count = 0;
      lengthOfresult = result.length;

      if(result.length>0){
        for(let i=0;i<result.length;i++){

          _TOKEN_PATH.push(result[i].token_path);

          if(i == result.length-1) {
            console.log("Token path ---->> ", _TOKEN_PATH);
            refershToken(_TOKEN_PATH [count])
          }
        }
      }
    }
  });
};

function refershToken (TOKEN_PATH) {
  console.log("_TOKEN_PATH ==== > ", TOKEN_PATH)
  let checkPoint = typeof (TOKEN_PATH) === 'string' && TOKEN_PATH !== undefined ? true : false;
  if(checkPoint) {
    fs.readFile(TOKEN_PATH, (err, content) => {
      if (err) {
        console.log('Error loading client secret file:', err);
        return;
      }
      let token = JSON.parse(content);
      console.log("Token ============== > ", token);

      // set the current users access and refresh token
      oauth2Client.setCredentials({
        access_token: token.access_token,
        refresh_token: token.refresh_token
      });

      // request a new token
      oauth2Client.refreshAccessToken(function (err, tokens) {
        if (err) {
          console.log('erro refreshAccessToken');
        }
        //save the new token and expiry_date
        console.log("TOKEN_PATH ===============================>>>> ", TOKEN_PATH);
        console.log("NEW Token ===============================>>>> ", tokens);
        let checkPoint = typeof (tokens) === 'object' ? true : false;
        if (checkPoint) {
          fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), (err) => {
            if (err) {
              console.log('err', err);
            } else {
              console.log("The count is  === > ", count)
              if (count < lengthOfresult - 1) {
                count++;
                console.log("_TOKEN_PATH [count ++]", _TOKEN_PATH[count])
                refershToken(_TOKEN_PATH[count])
              }
            }
          });
        }
      });
    });
  } else {
    console.log("Error : Token is undefined");
  }
}

