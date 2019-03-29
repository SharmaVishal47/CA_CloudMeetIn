import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MeetingService} from '../meeting.service';

@Component({
  selector: 'app-schedule-event',
  templateUrl: './schedule-event.component.html',
  styleUrls: ['./schedule-event.component.css']
})
export class ScheduleEventComponent implements OnInit {
  name;
  email;
  phone;
  userName = '';
  meetingUserInfoForm: FormGroup;
  meetingTime = '';
  meetingDateTime = '';
  selectedTime = '';
  goToMeetingStartDateTime;
  meetingTimeZone = '';
  _dateFormatEnd;
  meetingOptionList = [];
  meetingSelectedOption: string;
  checkMeetingOption = false;
  data;
  meetIngData;
  rescheduleRecords;
  btnValue: string = 'Schedule Event';
  rescheduleDetails;

  constructor(private fb: FormBuilder, private meetingService: MeetingService, private router: Router, private httpClient: HttpClient, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.meetingUserInfoForm = this.fb.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      description:[null],
      reasonOfRescheduling:[null],
    });

    this.rescheduleRecords = this.meetingService.getRescheduleRecords();
    if(this.rescheduleRecords) {
      this.btnValue = 'Reschedule Event'
    }
    this.meetingService.removeHeader(true);
    this.meetingService.checkMeetingPlatform();
    this.meetingService.meetingPlatform.subscribe(res => {
      if (res.data.length > 0) {
        if (res.data[0].go2meeting != null && res.data[0].go2meeting !== "false") {
          this.checkMeetingOption = true;
          this.meetingOptionList.push('GoToMeeting');
          this.meetingSelectedOption = 'GoToMeeting';
        }
        if (res.data[0].salesforce) {
          this.checkMeetingOption = true;
          this.meetingOptionList.push('Salesforce');
          this.meetingSelectedOption = 'Salesforce';
        }
        if (res.data[0].zoom) {
          this.checkMeetingOption = true;
          this.meetingOptionList.push('Zoom');
          this.meetingSelectedOption = 'Zoom';
        }
      }
    }, error => {
      console.log('error====', error);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);
    });
    this.goToMeetingStartDateTime = this.meetingService.meetingStartTime();
    console.log('S -> ',this.goToMeetingStartDateTime);
    this._dateFormatEnd = this.meetingService.meetingEndTime(this.goToMeetingStartDateTime);
    console.log('E--> ',this._dateFormatEnd);

    this.userName = localStorage.getItem('fullName');
    this.meetingTime = localStorage.getItem('eventType') + ' Minute Meeting';
    this.meetingDateTime = localStorage.getItem('selectedDate');
    this.selectedTime = localStorage.getItem('selectedTime');
    this.meetingTimeZone = localStorage.getItem('selectedTimeZone');
  }


  selectedPlatform(selectOption: string) {
    this.meetingSelectedOption = selectOption;
  }

  onSubmit() {
    for (const i in this.meetingUserInfoForm.controls) {
      this.meetingUserInfoForm.controls[i].markAsDirty();
    }
    this.data = {
      userId: localStorage.getItem('userId'),
      timeZone: localStorage.getItem('selectedTimeZone'),
      eventType: localStorage.getItem('eventType'),
      time: localStorage.getItem('selectedTime'),
      date: localStorage.getItem('selectedDate'),
      schedulerName: this.meetingUserInfoForm.value.fullName,
      schedulerEmail: this.meetingUserInfoForm.value.email,
      schedulerPhone: this.meetingUserInfoForm.value.phone,
      schedulerDescription: this.meetingUserInfoForm.value.description,
    };

    this.meetIngData = {
      'subject': this.meetingUserInfoForm.value.fullName,
      'starttime': this.goToMeetingStartDateTime,
      'endtime': this._dateFormatEnd,
      'passwordrequired': false,
      'conferencecallinfo': 'hybrid',
      'timezonekey': localStorage.getItem('selectedTimeZone'),
      'meetingtype': 'scheduled'
    };
    if(this.btnValue == 'Schedule Event') {
      if (this.checkMeetingOption) {
        console.log("_------------------data --- >> ", this.data);
        this.meetingService.getGoToMeeting(this.meetIngData, this.data);
      } else {
        this.meetingService.addMeetingToDatabase(this.meetIngData, this.data);
      }
    } else {
      this.data['reschedulerName'] = this.userName;
      this.data['rescheduleReason'] = this.meetingUserInfoForm.value.reasonOfRescheduling;
      this.data['eventId'] = localStorage.getItem("eventID");
      console.log('------------------ -->>', this.data);
      this.meetingService.rescheduleMeeting(this.data, this.meetIngData);
    }
  }
}


/*
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MeetingService} from '../meeting.service';

@Component({
  selector: 'app-schedule-event',
  templateUrl: './schedule-event.component.html',
  styleUrls: ['./schedule-event.component.css']
})
export class ScheduleEventComponent implements OnInit {
  userName = '';
  meetingUserInfoForm: FormGroup;
  meetingTime = '';
  meetingDateTime = '';
  selectedTime = '';
  goToMeetingStartDateTime;
  meetingTimeZone = '';
  _dateFormatEnd;
  meetingOptionList = [];
  meetingSelectedOption: string;
  checkMeetingOption = false;
  data;
  meetIngData;
  rescheduleRecords;
  btnValue: string = 'Schedule Event';
  rescheduleDetails;

  constructor(private meetingService: MeetingService, private router: Router, private httpClient: HttpClient, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.meetingUserInfoForm = new FormGroup({
      fullName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      phone: new FormControl(null ),
      description: new FormControl(null),
      reasonOfRescheduling: new FormControl(null),
    });

    this.rescheduleRecords = this.meetingService.getRescheduleRecords();
    if(this.rescheduleRecords) {
      this.btnValue = 'Reschedule Event'
    }
    this.meetingService.removeHeader(true);
    this.meetingService.checkMeetingPlatform();
    this.meetingService.meetingPlatform.subscribe(res => {
      if (res.data.length > 0) {
        if (res.data[0].go2meeting != null && res.data[0].go2meeting !== "false") {
          this.checkMeetingOption = true;
          this.meetingOptionList.push('GoToMeeting');
          this.meetingSelectedOption = 'GoToMeeting';
        }
        if (res.data[0].salesforce) {
          this.checkMeetingOption = true;
          this.meetingOptionList.push('Salesforce');
          this.meetingSelectedOption = 'Salesforce';
        }
        if (res.data[0].zoom) {
          this.checkMeetingOption = true;
          this.meetingOptionList.push('Zoom');
          this.meetingSelectedOption = 'Zoom';
        }
      }
    }, error => {
      console.log('error====', error);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);
    });
    this.goToMeetingStartDateTime = this.meetingService.meetingStartTime();
    console.log('S -> ',this.goToMeetingStartDateTime);
    this._dateFormatEnd = this.meetingService.meetingEndTime(this.goToMeetingStartDateTime);
    console.log('E--> ',this._dateFormatEnd);

    this.userName = localStorage.getItem('fullName');
    this.meetingTime = localStorage.getItem('eventType') + ' Minute Meeting';
    this.meetingDateTime = localStorage.getItem('selectedDate');
    this.selectedTime = localStorage.getItem('selectedTime');
    this.meetingTimeZone = localStorage.getItem('selectedTimeZone');
  }


  selectedPlatform(selectOption: string) {
    this.meetingSelectedOption = selectOption;
  }

  onSubmit() {

    this.data = {
      userId: localStorage.getItem('userId'),
      timeZone: localStorage.getItem('selectedTimeZone'),
      eventType: localStorage.getItem('eventType'),
      time: localStorage.getItem('selectedTime'),
      date: localStorage.getItem('selectedDate'),
      schedulerName: this.meetingUserInfoForm.value.fullName,
      schedulerEmail: this.meetingUserInfoForm.value.email,
      schedulerPhone: this.meetingUserInfoForm.value.phone,
      schedulerDescription: this.meetingUserInfoForm.value.description,
    };

    this.meetIngData = {
      'subject': this.meetingUserInfoForm.value.fullName,
      'starttime': this.goToMeetingStartDateTime,
      'endtime': this._dateFormatEnd,
      'passwordrequired': false,
      'conferencecallinfo': 'hybrid',
      'timezonekey': localStorage.getItem('selectedTimeZone'),
      'meetingtype': 'scheduled'
    };
    if(this.btnValue == 'Schedule Event') {
      if (this.checkMeetingOption) {
        console.log("_------------------data --- >> ", this.data);
        this.meetingService.getGoToMeeting(this.meetIngData, this.data);
      } else {
        this.meetingService.addMeetingToDatabase(this.meetIngData, this.data);
      }
    } else {
      this.data['reschedulerName'] = this.userName;
      this.data['rescheduleReason'] = this.meetingUserInfoForm.value.reasonOfRescheduling;
      this.data['eventId'] = localStorage.getItem("eventID");
      console.log('------------------ -->>', this.data);
      this.meetingService.rescheduleMeeting(this.data, this.meetIngData);
    }
  }
}
*/
