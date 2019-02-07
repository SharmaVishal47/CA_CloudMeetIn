const express = require('express');
const userRoutes = require('../routes/users');
const googleCalRoutes = require('../routes/emailVerify');
const meetingRoutes = require('../routes/meeting');
const sendEmail = require('../routes/sendEmail');
const integrationRoutes = require('../routes/integration');
const calendlyTimeFilter = require('../routes/calendlyTimeFilter');
const userDataRoutes = require('../routes/userData');
const app = express();
const bodyParser = require('body-parser');
const path  = require('path');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ca_calendly'
});
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});
global.db = db;

app.use('/', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Max-Age');
  next();
});



app.use(bodyParser.json());
app.use('/userData',userDataRoutes);
app.use('/images',express.static(path.join('backend/images')));
app.use('/user', userRoutes);
app.use('/meeting', meetingRoutes);
app.use('/integration', integrationRoutes);
app.use('/googleCalendar', googleCalRoutes);
app.use('/sendEmail', sendEmail);
app.use('/filter', calendlyTimeFilter);

module.exports = app;
