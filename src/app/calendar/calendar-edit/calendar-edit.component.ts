import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog } from "@angular/material";
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {SignUpService} from '../../Auth/sign-up.service';
import {MeetingService} from '../../meetings/meeting.service';
import {Subscription} from 'rxjs';
@Component({
  selector: 'app-calendar-edit',
  templateUrl: './calendar-edit.component.html',
  styleUrls: ['./calendar-edit.component.css']
})
export class CalendarEditComponent implements OnInit,OnDestroy {

  constructor(private dialog: MatDialog,
              private route: ActivatedRoute,private router:Router,
              private httpClient: HttpClient,public signUpService: SignUpService,
              private meetingService: MeetingService) { }
  email: string;
  isVisible = false;
  isSpinning = true;
  calendarOption;
  event : string;
  checkCalendar = false;
  checkEvent:number = 0;
  eventString: string;
  public data: Map<string,string>;
  onCheckBoxModelStatus;
  modelTitle: string;
  private subscriptions = new Subscription();

  ngOnInit() {
    this.meetingService.removeHeader(true);
    this.email =  localStorage.getItem('email');
    console.log("Email ===========> ", this.email);

    if(this.email) {
      this.subscriptions = this.signUpService.checkEmail.subscribe((responseData: { data: any, message: String }) => {
        console.log("Data=======", responseData.data);
        if (responseData.data.length > 0) {
          if (responseData.data[0].calendarEvent == null && responseData.data[0].token_path != null) {
            this.signUpService.getCalendarEventsList(this.email);
            console.log("Email ===========> ", this.email);
            this.signUpService.getCalendarOptionList(this.email);
            this.isSpinning = false;
          } else {
            this.router.navigate(['error']);
          }
        } else {
          this.router.navigate(['error']);
        }
        this.isSpinning = false;
      }, error1 => {
        this.router.navigate(['error']);
      });
      this.signUpService.checkUserEmail({email: this.email});

      this.signUpService.getCalendarOptionListener().subscribe((responseData) => {
        let calMap = new Map();
        let calendarId = [];
        responseData.record.forEach(function (cal) {
          calMap.set(cal.id, cal.summary);
          calendarId.push(cal.id);
        });
        this.data = calMap;
        this.checkEvent = calendarId.length > 0 ? calendarId.length : 0;
        this.calendarOption = calendarId.join(',');
      });
      this.signUpService.getCalendarEventsListener().subscribe((responseData) => {
        this.onCheckBoxModelStatus = true;
        // this.eventString = responseData.record[0].id;
        for(let i = 0; i< responseData.record.length ; i++ ) {
          // console.log("TYpe of ", typeof (responseData.record[i].primary));
          if( typeof (responseData.record[i].primary) === 'boolean' && responseData.record[i].primary != undefined ) {
            this.eventString = responseData.record[i].id;
          }
        }
      });
    }else{
      this.router.navigate(['error']);
    }
  }


  openCalendarEvent(status: boolean) {
    if(status) {
      this.isVisible = true;
      this.onCheckBoxModelStatus = status;
      this.modelTitle = 'Which calendar should we add new events to?';
      this.signUpService.getCalendarEventsList(this.email);
    }
  }

  updateEventCalendar() {
    this.signUpService.updateCalendarEventOptions(this.eventString,this.calendarOption,this.email);
  }

  openCalendarOption(status: boolean): void {
    if(!status) {
      this.isVisible = true;
      this.modelTitle = 'Which calendars should we check for conflicts?';
      this.onCheckBoxModelStatus = status;
      this.signUpService.getCalendarOptionList(this.email);
    }
  }
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  log(value: string[]): void {
    this.checkEvent = value.length;
    this.calendarOption = null;
    this.calendarOption = value.join(',');
    console.log(this.calendarOption);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
