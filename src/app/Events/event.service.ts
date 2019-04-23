import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthServiceLocal} from '../Auth/auth.service';
import {Subject} from 'rxjs';
import {EventModel} from '../model/event';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class EventService {
  event_id: string = null;
  event_index: number = null;
  user_id: string;
  eventArray: EventModel;
  checkMeetingPlatformAvailability = new Subject<any>();
  getOneEventData = new Subject<any>();
  userCreateEvents = new Subject<any>();
  editEventRecords = new Subject<{ event_id: string, eventIndex: number }>();

  constructor(
    private httpClient: HttpClient, private authService: AuthServiceLocal,
    private router: Router) {
    this.user_id = this.authService.getUserId();
  }

  /* This function used for create a new event*/
  createEvent(creatEventData: any) {
    creatEventData['user_id'] = this.user_id;
    this.httpClient.post<any>('https://dev.cloudmeetin.com/events/createevent', creatEventData).subscribe(
      res => {
      },
      err => {
      });
  }

  updateEvent(updateEventData: any, eventId: string) {
    updateEventData['user_id'] = this.user_id;
    this.httpClient.post<any>('https://dev.cloudmeetin.com/events/updateEvent', {updateEventData: updateEventData, eventId: eventId}).subscribe(
      res => {
      },
      err => {
      });
  }

  checkMeetingPlatform() {
    if (this.user_id) {
      this.httpClient.post<any>('https://dev.cloudmeetin.com/user/checkMeetingPlatform', {userId: this.user_id}).subscribe(
        res => {
          console.log("Respinser ---------- ", res);
          this.checkMeetingPlatformAvailability.next(res);
        },
        err => {

        });
    }
  }

  onSaveInDatabase(defaultEventType: string, default_secret_event: string, _userSelectTimeZone: any, user_select_range: any,
                   availabilityAdvance: any, checkStatus: boolean, eventId: string) {
    let current = new Date();
    /*let userSelectTimeZone =  _userSelectTimeZone == 'Asia/Kolkata' ? 'Asia/Kolkata' : null;*/
    let rolling_days = '';
    let date_ranges = '';
    let infinite = 'false';
    switch (user_select_range.availability) {
      case 'day' : {
        let days = user_select_range.rolling_days;
        const myDate = new Date(new Date().getTime() + (+days * 24 * 60 * 60 * 1000));
        rolling_days = myDate.toString();
        break;
      }
      case 'date_range' : {
        date_ranges = user_select_range.range_dates;
        break;
      }
      case 'indefinitely' : {
        infinite = 'true';
        break;

      }
      default: {
        infinite = 'true';
      }
    }

    console.log("User select range --- > ", user_select_range);

    const newEventModel = new EventModel(
      defaultEventType,
      date_ranges,
      rolling_days,
      infinite,
      _userSelectTimeZone,
      '09: 00 AM',
      '06: 00 PM',
      current.toString(),
      availabilityAdvance.show_availability,
      availabilityAdvance.event_max_per_day,
      availabilityAdvance.minimum_scheduling_notice,
      availabilityAdvance.show_availability_buffer_before_event,
      availabilityAdvance.show_availability_buffer_after_event,
      default_secret_event);
    console.log("Total data --- > ", newEventModel);

    if (checkStatus) {
      this.httpClient.post<any>('https://dev.cloudmeetin.com/events/advancedfeatureupdate', {
        userId: this.user_id,
        events: newEventModel,
        eventId: eventId
      }).subscribe(
        res => {
          this.getUserSelectEvents();
          this.eventCancel();
        },
        err => {
        });
    } else {
      this.httpClient.post<any>('https://dev.cloudmeetin.com/events/advancedfeatureupdate', {
        userId: this.user_id,
        events: newEventModel,
        eventId: eventId
      }).subscribe(
        res => {
          this.getUserSelectEvents();
        },
        err => {
        });
    }
  }

  getUserSelectEvents() {
    this.httpClient.post<any>('https://dev.cloudmeetin.com/events/getevents', {userId: this.user_id}).subscribe(
      res => {
        console.log("Response --- >  ", res);
        /*if(res.data.length > 0) {

        }*/
        this.userCreateEvents.next([...res.data]);
      },
      err => {

      });
  }

  eventCancel() {
    this.router.navigate(['/eventMainPage']);
  }

  onEditEventMain(event_id: any, eventIndex: number) {
    console.log("Selected Event Details -->", event_id, 'And index is --> ', eventIndex);
    this.event_id = event_id;
    this.event_index = eventIndex;
    this.router.navigate(['/newEvent/create']);
    /*this.editEventRecords.next({event_id, eventIndex});*/
  }

  returnEventId() {
    return this.event_id;
  }

  returnEventIndex() {
    return this.event_index;
  }

  removeEventData() {
    this.event_id = null;
    this.event_index = null;
  }

  getOneEventRecords(eventId: string) {
    return this.httpClient.get<any>('https://dev.cloudmeetin.com/events/' + eventId + '/' + this.user_id)
  }

  singleEventDelete(eventId: string) {
    this.httpClient.post<any>('https://dev.cloudmeetin.com/events/delete', {eventId: eventId, userId: this.user_id}).subscribe((response) => {
      console.log('Successfully Deleted', response);
      this.getUserSelectEvents();
    });
  }
/* This function used getting the event slot from the sign-up table*/
  getAvailabilitySlotTime() {
    return this.httpClient.post<{ message: string, data: [] }>('https://dev.cloudmeetin.com/user/getTimeAvailability', {'userId': this.user_id})
  }

  convertTimeInto12(startTime: any, endTime: any) {
      let timeString = startTime ;
      let H = +timeString.substr(0, 2);
      let h = (H % 12) || 12;
      let ampm = H < 12 ? "AM" : "PM";
      let _startTime =  h + timeString.substr(2, 3) + ampm;

      let _timeString = endTime ;
      let _H = +_timeString.substr(0, 2);
      let _h = (_H % 12) || 12;
      let _ampm = _H < 12 ? "AM" : "PM";
      let _endTime =  _h + _timeString.substr(2, 3) + _ampm;
      let returnJson = {
        startTime: _startTime,
        endTime: _endTime
      };
      return returnJson;
  }

  getSelectedDateSlot (eventId: string, selected_date: Date) {
    return this.httpClient.post<{ message: string, data: [] }>(
      'https://dev.cloudmeetin.com/events/getselecteddateslot', {selected_date: selected_date, eventId : eventId})
  }


  convertTimePickerFormat(time: any, selectedDate: Date) {
   /* console.log("Time == >", time);
    console.log("selectedDate == >", selectedDate);*/
   return selectedDate.setHours(time.toString().split(':')[0]);
  }


  addSlotsInSDate(slotsValue: any, eventId: string, selectedDate: Date) {
    console.log('Submit value of slot type --> ', slotsValue.datePicker);
    let addFromSlots = [];
    let addToSlots = [];
    for (let i = 0; i < slotsValue.datePicker.length; i++) {
      console.log("From Time  --- > ", slotsValue.datePicker[i].fromTime);
      console.log("Type of ", typeof (slotsValue.datePicker[i].fromTime));
      typeof (slotsValue.datePicker[i].fromTime) ==='number' ? addFromSlots.push(slotsValue.datePicker[i].fromTime) : addFromSlots.push(Date.parse(slotsValue.datePicker[i].fromTime));
      typeof (slotsValue.datePicker[i].toTime) ==='number' ? addToSlots.push(slotsValue.datePicker[i].toTime) : addToSlots.push(Date.parse(slotsValue.datePicker[i].toTime));
      console.log("to Time  --- > ", slotsValue.datePicker[i].toTime)
    }
    console.log('========>>>> From  ',addFromSlots.join(','));
    console.log('========>>>> To  ',addToSlots.join(','));
    return this.httpClient.post<{ message: string, data: [] }>('https://dev.cloudmeetin.com/events/insertslots', {
      startTime: addFromSlots.join(','),
      endTime: addToSlots.join(','),
      av_ua: true,
      selected_date : selectedDate,
      applyToDate: true,
      applyToDays: false,
      eventId: eventId
    })

  }
}


