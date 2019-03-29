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

exports.gmailCheckToken = (callback) => {
  const TOKEN_PATH = 'gmail-credentials.json';
  console.log("----------gmail token", TOKEN_PATH);
  fs.readFile(TOKEN_PATH, (err, content) => {
    if (err) console.log('Error loading client secret file:', err);

    let token = JSON.parse(content);
    console.log('1');
    // set the current users access and refresh token
    oauth2Client.setCredentials({
      access_token: token.access_token,
      refresh_token: token.refresh_token
    });

    // request a new token
    oauth2Client.refreshAccessToken(function (err, tokens) {
      if (err) {
        console.log('erro refreshAccessToken');
        callback(err);
      }
      //save the new token and expiry_date
      console.log("Token", tokens);
      fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), (err) => {
        if (err) {
          console.log('err', err);
          callback(err);
        } else {
          console.log('Token stored to', TOKEN_PATH);
          callback(200);
        }
      });
    });
  });
};

