import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';


@Component({
  selector: 'app-schedule-date',
  templateUrl: './schedule-date.component.html',
  styleUrls: ['./schedule-date.component.css'],


})
export class ScheduleDateComponent implements OnInit {



  constructor( private router: Router, private route: ActivatedRoute) { }
  startTime = 1 ;
  endTime = 9;
  timeArray = [];
  expectedDay ;
  expectedDate ;
  expectedTimeZone = 'Times are in India, Sri Lanka Time'

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.expectedDay = +params['selectDay'];
      switch (this.expectedDay) {
        case 0 : return this.expectedDay = 'Sunday';
        case 1 : return this.expectedDay = 'Monday';
        case 2 : return this.expectedDay = 'Tuesday';
        case 3 : return this.expectedDay = 'Wednesday';
        case 4 : return this.expectedDay = 'Thursday';
        case 5 : return this.expectedDay = 'Friday';
        case 6 : return this.expectedDay = 'Saturday';
        default : this.router.navigate(['/']);
      }
    });
    console.log(typeof (localStorage.getItem('selectedDate')));
    this.expectedDate =
      typeof (localStorage.getItem('selectedDate')) === 'string' &&
      localStorage.getItem('selectedDate').split('').length > 0
        ? localStorage.getItem('selectedDate') : this.router.navigate(['/']);
    for (let i = this.startTime; i < this.endTime; i++) {
      this.timeArray.push('0' + i + ':00am');
    }
  }

  setTime(index: number,item: number) {
    localStorage.setItem('selectedTime',item.toString());
    localStorage.setItem('selectedTimeIndex',index.toString());
    localStorage.setItem('selectedTimeZone',this.expectedTimeZone);
    this.router.navigate(['schedulingPage'], {relativeTo : this.route});
  }


}

