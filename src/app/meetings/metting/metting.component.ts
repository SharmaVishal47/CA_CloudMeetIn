import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-metting',
  templateUrl: './metting.component.html',
  styleUrls: ['./metting.component.css']
})
export class MettingComponent implements OnInit {

  Meeting_owner ;
  meeting_time ;
  select_day = 'Select Day';
  selectDate: any;
  timeZone: string;
  placeholderString = 'Select timezone';
  constructor( private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.meeting_time = params['selectTime'];
      switch (this.meeting_time) {
        case '15min' : return this.meeting_time = '15 Minute Meeting';
        case '30min' : return this.meeting_time = '30 Minute Meeting';
        case '60min' : return this.meeting_time = '60 Minute Meeting';
        default : this.router.navigate(['/']);
      }
    });
    this.Meeting_owner =
      typeof (localStorage.getItem('fullName')) === 'string' &&
      localStorage.getItem('fullName').split('').length > 0
        ? localStorage.getItem('fullName') : this.router.navigate(['/']);
  }

  OnContinue() {
    localStorage.setItem('selectedDate',this.selectDate);
    let expectedDay = this.selectDate.getDay();
    console.log(expectedDay);
    this.router.navigate([expectedDay], {relativeTo: this.route});
    console.log(this.selectDate);
  }
  changeTimezone(timezone) {
    this.timeZone = timezone;
    console.log(this.timeZone);
  }

}
