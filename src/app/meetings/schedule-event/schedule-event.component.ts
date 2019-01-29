import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-schedule-event',
  templateUrl: './schedule-event.component.html',
  styleUrls: ['./schedule-event.component.css']
})
export class ScheduleEventComponent implements OnInit {
  access_token:string;
  expires_in:string;
  organizer_key:string;
  refresh_token:string;
  userName = '';
  meetingUserInfoForm: FormGroup;
  meetingTime = '';
  meetingDateTime = '';
  goToMeetingStartDateTime;
  goToMeetingEndDateTime;
  meetingTimeZone = '';
   todayDate;
   _dateFormatEND;
   _dateFormatEnd;
  constructor( private router: Router,private httpClient: HttpClient,private dialog: MatDialog) { }

  ngOnInit() {
    let _selectedDate = localStorage.getItem('selectedDate');
    let timePeriod = localStorage.getItem('eventType').split('m');
    let expectedTime = localStorage.getItem('selectedTime').split('a' || 'b');
    let date = new Date(_selectedDate);
    /*let _dateFormat  = formatDate(date, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');*/
    let _dateFormat = formatDate(date, 'yyyy-MM-dd', 'en-US');
    this.goToMeetingStartDateTime = _dateFormat + 'T' + expectedTime[0] + ':00Z';

    console.log(this.goToMeetingStartDateTime);
    let d = new Date(this.goToMeetingStartDateTime);
    // @ts-ignore
    d.setMinutes(timePeriod[0] - 300);
    this.goToMeetingEndDateTime = d;
     /*this._dateFormatEND = formatDate(this.goToMeetingEndDateTime, 'yyyy-MM-dd HH:mm:ss Z:', 'en-US');
    console.log('Hello ',this.goToMeetingEndDateTime);*/
     this._dateFormatEnd  = formatDate(this.goToMeetingEndDateTime, 'yyyy-MM-ddThh:mm:ss', 'en-US');
    console.log(this._dateFormatEnd +'Z');
    this.httpClient.get<any>('https://api.getgo.com/oauth/access_token?grant_type=password&user_id=kishor.kumar@cloudanalogy.com&password=sfdc9034&client_id=xPlKoK3aapfA2KdO8flPdewDOIlrY1V0').subscribe(
      res => {
        let jsonData = res;
        this.access_token = jsonData.access_token;
        console.log('this.access_token===',this.access_token);
        this.expires_in = jsonData.expires_in;
        this.organizer_key = jsonData.organizer_key;
        this.refresh_token = jsonData.refresh_token;
      });
    this.meetingUserInfoForm = new FormGroup({
      fullName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required])
    });
    this.userName = localStorage.getItem('fullName');
    this.meetingTime = localStorage.getItem('eventType') + ' Minute Meeting';
    this.meetingDateTime = localStorage.getItem('selectedTime') + ' ' + localStorage.getItem('selectedDate');
    this.meetingTimeZone = localStorage.getItem('selectedTimeZone');
  }

  onSubmit() {
    let data = {
      userId: localStorage.getItem('userId'),
      timeZone: localStorage.getItem('selectedTimeZone'),
      eventType: localStorage.getItem('eventType'),
      time: localStorage.getItem('selectedTime'),
      date: localStorage.getItem('selectedDate'),
      schedulerName: this.meetingUserInfoForm.value.fullName,
      schedulerEmail: this.meetingUserInfoForm.value.email
    };

    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization': "Bearer "+this.access_token
    });

    let options = {
      headers: httpHeaders
    };

    const meetIngData = {
      "subject": "Meeting with "+this.meetingUserInfoForm.value.fullName,
      "starttime": this.goToMeetingStartDateTime,
      "endtime": this._dateFormatEnd +'Z',
      "passwordrequired": false,
      "conferencecallinfo": "hybrid",
      "timezonekey": "Asia/Calcutta",
      "meetingtype": "recurring"
    };
    
    console.log(meetIngData);

    this.httpClient.post<any>('https://api.getgo.com/G2M/rest/meetings',meetIngData,options).subscribe(
      res =>{
        console.log("MeetingResponse=========",res[0].joinURL);
        console.log("MeetingResponse=========",res[0].meetingid);
        data['g2mMeetingId'] = res[0].meetingid;
        data['g2mMeetingUrl'] = res[0].joinURL;
        this.httpClient.post<any>('http://localhost:3000/meeting/addMeeting',data).subscribe((responseData)=>{
          console.log("addMeeting====",responseData);
            this.httpClient.post<any>('http://localhost:3000/user/insertevent',meetIngData).subscribe((responseData)=>{
              console.log('Google Calendar integration======',responseData);
              this.router.navigate(['confirmedMeeting']);
            },error => {
              console.log("error CAL ====",error);
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = error;
              this.dialog.open(MessagedialogComponent, dialogConfig);
            });

        },error => {
          console.log("error====",error);
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = error;
          this.dialog.open(MessagedialogComponent, dialogConfig);
        });
      },
      err => {
        console.log("MeetingError=========",err.message);
      });
    
    
  }

}
