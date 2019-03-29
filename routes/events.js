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

<<<<<<< HEAD
router.post('/createeventaftersignup', (req, res, next) => {
  let email =  req.body.email;
  let usernameQuery = "SELECT * FROM `calendly` WHERE email = '" + email + "'";
  db.query(usernameQuery, (err, result) => {
    console.log("result=====",result);
    console.log("err=====",err);
    if (err!==null) {
      return res.status(500).send(err);
    }else {
      if(result.length > 0){
        let userId = result[0].userId;
        const myDate = new Date(new Date().getTime() + (60 * 24 * 60 * 60 * 1000));
        let eventData = [
          {
            event_id : uuid.v4(),
            userId : userId,
            name : '15 Minute Meeting',
            location : "null",
            description: "null",
            link: '15min',
            location_display: 'A',
            color: '#17EFE5',
            eventDuration: '15 min',
            dateRangeType: 'null',
            rollingDays: myDate.toString(),
            event_infinite: 'false',
            createdDate: (new Date().toString()),
            startingDate: result[0].startTime,
            endDate: result[0].endTime,
            timeZone: result[0].timeZone,
            active: 'true',
            event_availability_increments: '30 min',
            event_max_per_day: 'null',
            event_scheduling_notice: '4',
            event_buffer_before_event: '0 min',
            event_buffer_after_event: '0 min',
            event_secret: 'false'
          },{
            event_id : uuid.v4(),
            userId : userId,
            name : '30 Minute Meeting',
            location : 'null',
            description: 'null',
            link: '30min',
            location_display: 'A',
            color: '#1748EF',
            eventDuration: '30 min',
            dateRangeType: 'null',
            rollingDays: myDate.toString(),
            event_infinite: 'false',
            createdDate: (new Date().toString()),
            startingDate: result[0].startTime,
            endDate: result[0].	endTime,
            timeZone: result[0].timeZone,
            active: 'true',
            event_availability_increments: '30 min',
            event_max_per_day: 'null',
            event_scheduling_notice: '4',
            event_buffer_before_event: '0 min',
            event_buffer_after_event: '0 min',
            event_secret: 'false'
          },{
            event_id : uuid.v4(),
            userId : userId,
            name : '60 Minute Meeting',
            location : 'null',
            description: 'null',
            link: '60min',
            location_display: 'A',
            color: '#EFD817',
            eventDuration: '60 min',
            dateRangeType: 'null',
            rollingDays: myDate.toString(),
            event_infinite: 'false',
            createdDate: (new Date().toString()),
            startingDate: result[0].startTime,
            endDate: result[0].	endTime,
            timeZone: result[0].timeZone,
            active: 'true',
            event_availability_increments: '30 min',
            event_max_per_day: 'null',
            event_scheduling_notice: '4',
            event_buffer_before_event: '0 min',
            event_buffer_after_event: '0 min',
            event_secret: 'false'
          }
        ];

        for(let i = 0;i<eventData.length;i++){
          let query = "INSERT INTO `event_table` (event_id, userId, name, location, description, link, location_display, color,eventDuration,dateRangeType,rollingDays" +
            ",event_infinite,createdDate,startingDate,endDate,timeZone," +
            "active,event_availability_increments,event_max_per_day,event_scheduling_notice,event_buffer_before_event,event_buffer_after_event,event_secret) " +
            "VALUES ('" + eventData[i].event_id + "','" +eventData[i].userId + "','" + eventData[i].name  + "','" + eventData[i].location + "','" +
            eventData[i].description  + "','" + eventData[i].link  + "','" + eventData[i].location_display  + "','" + eventData[i].color  + "','"+eventData[i].eventDuration +"','"+eventData[i].dateRangeType+
            "','"+eventData[i].rollingDays+"','"+eventData[i].event_infinite+"','"+ eventData[i].createdDate+"','"+eventData[i].startingDate+"','"+eventData[i].endDate+"','"+eventData[i].timeZone
            +"','"+eventData[i].active+"','"+eventData[i].event_availability_increments+"','"+eventData[i].event_max_per_day+"','"+eventData[i].event_scheduling_notice+"','"+eventData[i].event_buffer_before_event+
            "','"+eventData[i].event_buffer_after_event+"','"+eventData[i].event_secret+"')";
          db.query(query, (err, result) => {
            if (err !== null) {
              return res.status(500).send(err);
            } else {
            }
          });
          if(i == 2){
            res.status(200).json({
              message: 'Insert Event Successfully.',
              data: []
            });
          }
        }
      }
    }
  });
});
=======

>>>>>>> 99000335af931bb3a175773c259d6b31e2ac1b6f
module.exports = router;
