import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-confirmed',
  templateUrl: './confirmed.component.html',
  styleUrls: ['./confirmed.component.css']
})
export class ConfirmedComponent implements OnInit {
  meetingTime = '15 Minute Meeting';
  meetingDateTime = '09:00am - Wednesday, January 30,2019';
  meetingTimeZone = 'India, Sri Lanka Time';
  constructor( private router: Router) { }
  userId = 'Kishor Kumar';
  ngOnInit() {
    this.userId = localStorage.getItem('fullName');
    this.meetingTime = localStorage.getItem('eventType')+" Minute Meeting";
    this.meetingDateTime = localStorage.getItem('selectedTime')+" "+localStorage.getItem('selectedDate');
    this.meetingTimeZone = localStorage.getItem('selectedTimeZone');
    localStorage.removeItem('fullName');
    localStorage.removeItem('eventType');
    localStorage.removeItem('selectedTime');
    localStorage.removeItem('selectedDate');
    localStorage.removeItem('selectedTimeZone');
    localStorage.removeItem('userId');
    localStorage.removeItem('selectedTimeIndex');
  }
}
