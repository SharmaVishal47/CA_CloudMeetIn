import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {MeetingService} from '../meeting.service';

@Component({
  selector: 'app-metting',
  templateUrl: './metting.component.html',
  styleUrls: ['./metting.component.css']
})
export class MettingComponent implements OnInit {
  Meeting_owner;
  meeting_time;
  select_day = 'Select Day';
  selectDate: any;
  timeZone: string;
  myFilter;
  userId: string;
  startDate = new Date();

  constructor(private meetingService: MeetingService, private router: Router, private route: ActivatedRoute, private httpClient: HttpClient, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.meetingService.removeHeader(true);
    this.userId = this.meetingService.getUserId();
    this.meetingService.getDataFromLocalStorage();
    this.route.params.subscribe((params: Params) => {
      this.meeting_time = params['selectTime'];
      switch (this.meeting_time) {
        case '15min' :
          return this.meeting_time = '15 Minute Meeting';
        case '30min' :
          return this.meeting_time = '30 Minute Meeting';
        case '60min' :
          return this.meeting_time = '60 Minute Meeting';
        default :
          this.router.navigate(['/']);
      }
    });
    /* this.meetingService.userLocalStorageData.subscribe((data: any) =>{
       console.log("Return data from service", typeof data.fullName);
       this.Meeting_owner =
         typeof (data.fullName) === 'string' && data.fullName.split('').length > 0 ? data.fullName : this.router.navigate(['/']);
   });*/
    this.Meeting_owner =
      typeof (localStorage.getItem('fullName')) === 'string' &&
      localStorage.getItem('fullName').split('').length > 0
        ? localStorage.getItem('fullName') : this.router.navigate(['/']);
    this.meetingService.getMeetingAvailableDay(this.userId);
    this.meetingService.meetingAvailableDay.subscribe((res: any) => {
      console.log(res.data);
      if (res.data.length > 0) {
        this.timeZone = res.data[0].timeZone;
        this.startDate = new Date(new Date().toLocaleString('en-US', {timeZone: this.timeZone}));
        if (res.data[0].availableDays) {
          let availableDays = res.data[0].availableDays.split(',');
          if (availableDays.length > 0) {
            this.myFilter = (d: Date): boolean => {
              let day = d.getDay();
              if (availableDays.indexOf(day.toString()) > -1) {
                let day = availableDays.indexOf(d.getDay());
                return day !== availableDays[day];
              }
            };
          } else {
            this.myFilter = (d: Date): boolean => {
              const day = d.getDay();
              return day !== 0 && day !== 1 && day !== 2 && day !== 3 && day !== 4 && day !== 5 && day !== 6;
            };
          }
        } else {
          this.myFilter = (d: Date): boolean => {
            const day = d.getDay();
            return day !== 0 && day !== 1 && day !== 2 && day !== 3 && day !== 4 && day !== 5 && day !== 6;
          };
        }
      }
    }, error => {
      console.log('error====', error);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);
    });
  }

  OnContinue() {
    localStorage.setItem('selectedDate', this.selectDate);
    localStorage.setItem('timeZone', this.timeZone);
    let expectedDay = this.selectDate.getDay();
    this.router.navigate([expectedDay], {relativeTo: this.route});
  }

  changeTimezone(timezone) {
    this.timeZone = timezone;
    console.log(this.timeZone);
    this.startDate = new Date(new Date().toLocaleString('en-US', {timeZone: this.timeZone}));
    this.selectDate = '';
  }
}

