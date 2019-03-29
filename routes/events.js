const uuid = require('uuid');
const express = require('express');
const router = express.Router();
const localStorage = require('localStorage');


/* Post */
router.post('/createevent', (req, res, next) => {
  let event_id = uuid.v4();
  localStorage.setItem('custom_eventId',event_id);
  let query = "INSERT INTO `event_table` (event_id, userId, name, location, description, link, color, location_display)" +
    " VALUES ('" + event_id + "', '" + req.body.user_id + "', '" + req.body.eventName + "', '" + req.body.location + "'," +
    " '" + req.body.description + "', '" + req.body.eventLink + "' , '" + req.body.color + "', '" + req.body.location_display + "')";

  db.query(query, (err, result) => {
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      res.status(200).json({
        message: 'Event created successfully.',
        data: result
      });
    }
  });
});

router.post('/updateSchedulerEmail', (req, res, next) => {
  let query = "UPDATE `event_table` SET  `schedulerEmail` = '"+req.body.inviteeEmail+"'  WHERE `userId` = '" + req.body.user_id + "'";
  console.log("-----------Update Query  ", query);
  db.query(query, (err, result) => {
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      res.status(200).json({
        message: 'Event created successfully.',
        data: result
      });
    }
  });
});

/* Update the advanced event data */
router.post('/advancedfeatureupdate', (req, res, next) => {
  console.log("Event Data ---- > ", req.body);
  let c_event_id = localStorage.getItem('custom_eventId');
  c_event_id  = typeof (req.body.eventId) === 'string' && req.body.eventId.split('').length > 0
    ? req.body.eventId : c_event_id;
  let query = "UPDATE `event_table` SET `eventDuration` = '" + req.body.events.event_duration + "', `dateRangeType` = '"
    + req.body.events.event_date_range + "', `event_infinite` = '" + req.body.events.event_infinite + "', `createdDate` = '" + req.body.events.event_current_date + "'," +
    " `rollingDays` = '" + req.body.events.event_rolling_days + "', `startingDate` = '" + req.body.events.event_availability_start_hours + "'," +
    " `endDate` = '" + req.body.events.event_availability_end_hours + "', `timeZone` = '" + req.body.events.event_time_zone_local + "'," +
    " `active` = '" + true+ "', `event_availability_increments` = '" + req.body.events.event_availability_increments + "'," +
    " `event_max_per_day` = '" + req.body.events.event_max_per_day + "', `event_scheduling_notice` = '" + req.body.events.event_scheduling_notice + "', " +
    "`event_buffer_before_event` = '" + req.body.events.event_buffer_before_event + "', `event_buffer_after_event` = '" + req.body.events.event_buffer_after_event + "'," +
    " `event_secret` = '" + req.body.events.event_secret + "' WHERE userId = '"+req.body.userId+"' AND event_id = '"+c_event_id+"'";

  console.log("-----------Update Query  ", query);
  db.query(query, (err, result) => {
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      res.status(200).json({
        message: 'Event updated  successfully.',
        data: result
      });
    }
  });
});

router.post('/getevents', (req, res, next) => {
  let query = "SELECT * FROM `event_table`  WHERE `userId` = '" + req.body.userId + "'";
  console.log("-----------Update Query 1.1  ", query);
  db.query(query, (err, result) => {
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      res.status(200).json({
        message: 'Events get successfully.',
        data: result
      });
    }
  });
});

router.get('/:eventId/:userId', (req, res, next) => {
  let query = "SELECT * FROM `event_table`  WHERE `userId` = '" + req.params.userId + "' AND event_id = '"+req.params.eventId+"'";
  console.log("-----------Update Query  ", query);
  db.query(query, (err, result) => {
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      res.status(200).json({
        message: 'One Event get successfully.',
        data: result
      });
    }
  });
});

router.post('/updateEvent', (req, res, next) => {
  localStorage.removeItem('custom_eventId');
  let query =
    "UPDATE `event_table` SET `name` = '" + req.body.updateEventData.eventName + "', `location` = '" + req.body.updateEventData.location + "'," +
    " `description` = '" + req.body.updateEventData.description + "', `link` = '" + req.body.updateEventData.eventLink + "'," +
    " `color` = '" + req.body.updateEventData.color + "', `location_display` = '" + req.body.updateEventData.location_display + "'" +
    " WHERE userId = '"+req.body.updateEventData.user_id+"' AND event_id = '"+req.body.eventId+"'";

  console.log("-----------Update Query  ", req.body);
  db.query(query, (err, result) => {
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      res.status(200).json({
        message: 'Events updated successfully.',
        data: result
      });
    }
  });
});

router.post('/delete', (req, res, next) => {
  let query = "DELETE  FROM `event_table`  WHERE `userId` = '" + req.body.userId + "' AND event_id = '"+req.body.eventId+"'";
  console.log("-----------Update Query  ", query);
  db.query(query, (err, result) => {
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      res.status(200).json({
        message: 'Single Event successfully Deleted.',
        data : result
      });
    }
  });
});

router.post('/getselecteddateslot', (req, res, next) => {
  let c_event_id = localStorage.getItem('custom_eventId');
  c_event_id  = typeof (req.body.eventId) === 'string' && req.body.eventId.split('').length > 0
    ? req.body.eventId : c_event_id;
  let query = "SELECT * FROM `s_date`  WHERE `selected_date` = '" + req.body.selected_date + "' AND eventId = '"+c_event_id+"'";
  console.log("-----------Select Query  ", query);
  db.query(query, (err, result) => {
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      res.status(200).json({
        message: 'One Event get successfully.',
        data: result
      });
    }
  });
});

/* This api used for insert the slots in the s_date table */
router.post('/insertslots', (req, res, next) => {
  let selected_date_Id = uuid.v4();
  let c_event_id = localStorage.getItem('custom_eventId');
  c_event_id  = typeof (req.body.eventId) === 'string' && req.body.eventId.split('').length > 0
    ? req.body.eventId : c_event_id;
  let query = "INSERT INTO `s_date` (startTime, endTime, av_ua, selected_date, applyToDate, applyToDays, selected_date_Id, eventId)" +
    " VALUES ('" + req.body.startTime + "', '" + req.body.endTime + "', '" + req.body.av_ua + "', '" + req.body.selected_date + "'," +
    " '" + req.body.applyToDate + "', '" + req.body.applyToDays + "' , '" + selected_date_Id + "', '" + c_event_id + "')";

  console.log("Slots Query --- > ", query);
  db.query(query, (err, result) => {
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      res.status(200).json({
        message: 'Slots successfully created.',
        data: result
      });
    }
  });
});


module.exports = router;
