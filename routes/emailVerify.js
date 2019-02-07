const express = require('express');
const readline = require('readline');
const router = express.Router();
const fs = require('fs');
const {google} = require('googleapis');
const googleAuth = require('google-auth-library');
// scopes
const SCOPES = ['https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/userinfo.profile'];
const googleSecrets = JSON.parse(fs.readFileSync('credentials.json')).installed;
const oauth2Client = new googleAuth.OAuth2Client(
  googleSecrets.client_id,
  googleSecrets.client_secret,
  googleSecrets.redirect_uris[0]
);
router.get('/signupcal',(req,res,next)=>{
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  res.status(200).json(
    {url :  authUrl});
});

router.post('/generateToken',(req,res,next)=>{
  let currentDate =  Date.now();
  const TOKEN_PATH = './Token/'+req.body.email +'-'+ currentDate +'.json';
  oauth2Client.getToken(req.body._token, function(err, token) {
    if (err) return console.error('Error retrieving access token', err);
    oauth2Client.setCredentials(token);
    // Store the token to disk for later program executions
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) console.error(err);
     // console.log('Token stored to', TOKEN_PATH);
      const token = fs.readFileSync(TOKEN_PATH);
      let tokenObject = JSON.parse(token);
      let refresh_token = tokenObject.refresh_token;
      let access_token = tokenObject.access_token;
      let scope = tokenObject.scope;
      let token_type = tokenObject.token_type;
      let expiry_date = tokenObject.expiry_date;

      let query = "INSERT INTO `calendly` ( email, accessToken, refreshToken, tokenType, scope,expiryDate, token_path) VALUES ('"+req.body.email+"', '" + access_token + "', '" + refresh_token + "', '" + token_type + "', '" + scope + "', '" + expiry_date + "', '" + TOKEN_PATH + "' )";
      db.query(query, (err, result) => {
       // console.log("result=====",result);
        // console.log("err=====",err);
        if (err!==null) {
          return res.status(500).send(err);
        }else {
          res.status(200).json({
            message: 'Sign Up Successfully.'
          });
        }
      });
    });
  });
});

module.exports = router;
