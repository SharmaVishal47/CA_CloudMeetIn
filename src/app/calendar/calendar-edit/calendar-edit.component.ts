import {Component, OnInit} from '@angular/core';
import { MatDialog,MatDialogConfig } from "@angular/material";
import {CalendarOptionComponent} from '../../calendar-option/calendar-option.component';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from 'angular-6-social-login';
import {CalendareventComponent} from '../../calendar-event/calendarevent.component';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {SignUpService} from '../../Auth/sign-up.service';
@Component({
  selector: 'app-calendar-edit',
  templateUrl: './calendar-edit.component.html',
  styleUrls: ['./calendar-edit.component.css']
})
export class CalendarEditComponent implements OnInit {

  constructor(private dialog: MatDialog, private route: ActivatedRoute,private router:Router,private httpClient: HttpClient,public signUpService: SignUpService) { }
  email: string;
  isVisible = false;
  calendarOption;
  event : string;
  checkCalendar = false;
  checkEvent:number = 0;
  eventString: string;
  public data: Map<string,string>;
  onCheckBoxModelStatus;
  modelTitle: string;


  ngOnInit() {
    this.email =  this.signUpService.getAuthUserEmail();
    console.log("Email ===========> ", this.email);

    this.signUpService.getCalendarOptionListener().subscribe((responseData)=>{
      let calMap = new Map();
      let calendarId = [];
      responseData.record.forEach(function(cal) {
        calMap.set(cal.id, cal.summary);
        calendarId.push(cal.id);
      });
      this.data = calMap;
      this.checkEvent = calendarId.length > 0 ? calendarId.length : 0;
      this.calendarOption = calendarId.join(',');
    });
    this.signUpService.getCalendarEventsListener().subscribe((responseData)=>{
      this.onCheckBoxModelStatus = true;
      this.eventString = responseData.record[0].id;
    });
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
}
