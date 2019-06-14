import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {FormBuilder} from '@angular/forms';
import {MeetingService} from '../meeting.service';

@Component({
  selector: 'app-confirmed',
  templateUrl: './confirmed.component.html',
  styleUrls: ['./confirmed.component.css']
})
export class ConfirmedComponent implements OnInit {
  weblink;
  meetingEvent = '';
  userImage: string;
  meetingDate = '';
  meetingTimeZone = '';
  startTime = '';
  endTime = '';
  constructor( private message: NzMessageService, private router: Router, private notification: NzNotificationService,private authServiceLocal: AuthServiceLocal, private meetingService: MeetingService) { }
  userId = '';
  rescheduleRecord;
  visibleButton = false;
  ngOnInit() {
    if(localStorage.getItem('fullName') == undefined || localStorage.getItem('fullName') == null){
      this.router.navigate(['/error']);
      return;
    }
    if(localStorage.getItem('userIdMeeting') == undefined || localStorage.getItem('userIdMeeting') == null){
      this.router.navigate(['/error']);
      return;
    }
    if(localStorage.getItem('email') == undefined || localStorage.getItem('email') == null){
      this.router.navigate(['/error']);
      return;
    }
    this.weblink = localStorage.getItem('weblink');
    if(this.weblink === null|| this.weblink === undefined || this.weblink === "null" || this.weblink === "" ){
      this.weblink = "";
    }
    if(this.authServiceLocal.getIsAuthenticated()){
      this.meetingService.removeHeader(false);
      this.visibleButton = true;
    }else{
      this.meetingService.removeHeader(true);
    }
    this.userImage = localStorage.getItem('imagePreview');
    this.rescheduleRecord = localStorage.getItem("rescheduleRecord");
    this.userId = localStorage.getItem('fullName');
    this.meetingEvent = localStorage.getItem('eventType').split('m')[0]+" Minute Meeting";
    this.meetingDate = localStorage.getItem('selectedDate');
    this.startTime = localStorage.getItem('selectedStartTime');
    this.endTime = localStorage.getItem('selectedEndTime');
    this.meetingTimeZone = localStorage.getItem('selectedTimeZone');
// this.notification.blank('Meeting Confirmation', 'I would like to confirm our meeting at '+this.meetingDateTime+'', { nzDuration: 0 });
    this.createMessage('success','Meeting Confirmation, I would like to confirm our meeting at '+this.startTime);
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    localStorage.removeItem('eventType');
    localStorage.removeItem('selectedEndTime');
    localStorage.removeItem('selectedStartTime');
    localStorage.removeItem('selectedDate');
    localStorage.removeItem('selectedTimeZone');
    localStorage.removeItem('userIdMeeting');
    localStorage.removeItem('userTimeZone');
    localStorage.removeItem('description');
    localStorage.removeItem('imagePreview');
    localStorage.removeItem('userStartTime');
    localStorage.removeItem('userEndTime');
    localStorage.removeItem('reschduleMeetingId');
    localStorage.removeItem('eventId');
    localStorage.removeItem('rescheduleRecord');
    localStorage.removeItem('weblink');
    /*if(this.rescheduleRecord){
      localStorage.removeItem('rescheduleRecord');
    }*/
  }
  createMessage(type: string,content:string): void {
    this.message.create(type, content);
  }
  backToHome() {
    localStorage.removeItem('rescheduleRecord');
    this.router.navigate(['dashboard']);
  }
}
