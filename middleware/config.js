/* Zoom Config file*/
const fs = require('fs');
const googleSecrets = JSON.parse(fs.readFileSync('credentials.json')).installed;
module.exports = {
  zoomTokenEp : 'https://zoom.us/oauth/token',
  zoom_client_secret: 'wia7tOaNjtuNV4ISTMxiZXvFYkCe2T1Z',
  zoom_client_id: 'dvRsLP5cSOFosrcG4Df1w',
  zoom_redirect_url: 'http://localhost:4200/integrations/zoommeeting',
  google_calendar: {
    google_cal_client_id: googleSecrets.client_id,
    google_cal_client_secret: googleSecrets.client_secret,
    google_cal_redirect_url: googleSecrets.redirect_uris[0]
  }
};
