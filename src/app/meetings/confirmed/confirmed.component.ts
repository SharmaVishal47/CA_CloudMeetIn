import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-confirmed',
  templateUrl: './confirmed.component.html',
  styleUrls: ['./confirmed.component.css']
})
export class ConfirmedComponent implements OnInit {
  meetingTime = '15 Minute Meeting';
  meetingDateTime = '09:00am - Wednesday, January 30,2019';
  meetingTimeZone = 'India, Sri Lanka Time';
  constructor( private router: Router, private notification: NzNotificationService) { }
  userId = 'Kishor Kumar';
  rescheduleRecord;
  visibleButton = false;
  ngOnInit() {
    this.rescheduleRecord = localStorage.getItem("rescheduleRecord");
    this.userId = localStorage.getItem('fullName');
    this.meetingTime = localStorage.getItem('eventType')+" Minute Meeting";
    this.meetingDateTime = localStorage.getItem('selectedTime')+" "+localStorage.getItem('selectedDate');
    this.meetingTimeZone = localStorage.getItem('selectedTimeZone');
    this.notification.blank('Meeting Confirmation', 'I would like to confirm our meeting at '+this.meetingDateTime+'', { nzDuration: 0 })
    localStorage.removeItem('fullName');
    localStorage.removeItem('eventType');
    localStorage.removeItem('selectedTime');
    localStorage.removeItem('selectedDate');
    localStorage.removeItem('selectedTimeZone');
    localStorage.removeItem('userId');
    localStorage.removeItem('selectedTimeIndex');
    localStorage.removeItem('rescheduleRecord');
    if(this.rescheduleRecord){
      //
      this.visibleButton = true;
    }
  }

  backToHome() {
    localStorage.removeItem('rescheduleRecord');
    this.router.navigate(['dashboard']);
  }
}
