import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {HttpClient} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {MeetingService} from '../meeting.service';
import {MessageServiceService} from '../../Auth/message-service.service';

@Component({
  selector: 'app-schedule-date',
  templateUrl: './schedule-date.component.html',
  styleUrls: ['./schedule-date.component.css'],
})
export class ScheduleDateComponent implements OnInit, OnDestroy {

  timeArray = [];
  listTimeArray = [];
  expectedDay;
  expectedDate;
  expectedTimeZone: string;
  timeZone: string;
  userSelectDay: any;
  constructor(
    private meetingService: MeetingService,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private messageService:MessageServiceService,
    public datepipe: DatePipe
  ) {}

  ngOnInit() {
    this.meetingService.removeHeader(true);
    this.route.params.subscribe((params: Params) => {
      this.userSelectDay = typeof (+params['selectDay']) === 'number' ? +params['selectDay'] : this.router.navigate(['/']);
      this.expectedDay = this.meetingService.getDay(this.userSelectDay);

    });

    let returnRecords = this.meetingService.getSelectedDateAndTimeZone();
    // console.log("Return Records Date and TimeZone", returnRecords);
    this.expectedTimeZone = this.timeZone = returnRecords.timezone;
    this.expectedDate = returnRecords.selectedDate;
    let userEmail = returnRecords.userEmail;
    if (userEmail) {
      this.meetingService.userSelectTimePeriod(userEmail, this.expectedDate, this.timeZone);
      this.meetingService.getTimePeriod.subscribe((responseData) =>{
        this.meetingService.deleteListTimeArray();
        console.log('responseData====', responseData);
        this.listTimeArray = responseData;
      }, error => {
        console.log('error====', error);
        this.messageService.generateErrorMessage(error)
       /* const dialogConfig = new MatDialogConfig();
        dialogConfig.data = error;
        this.dialog.open(MessagedialogComponent, dialogConfig);*/
      });
    }
  }

  setTime(index: number, item: number) {
    localStorage.setItem('selectedTime', item.toString());
    localStorage.setItem('selectedTimeIndex', index.toString());
    localStorage.setItem('selectedTimeZone', this.expectedTimeZone);
    this.router.navigate(['schedulingPage'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.meetingService.deleteListTimeArray();
    console.log("Call on destroy");
  }

}

