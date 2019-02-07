import {Component, OnInit} from '@angular/core';
import { MatDialog,MatDialogConfig } from "@angular/material";
import {CalendarOptionComponent} from '../../calendar-option/calendar-option.component';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from 'angular-6-social-login';
import {CalendareventComponent} from '../../calendar-event/calendarevent.component';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
@Component({
  selector: 'app-calendar-edit',
  templateUrl: './calendar-edit.component.html',
  styleUrls: ['./calendar-edit.component.css']
})
export class CalendarEditComponent implements OnInit {

  constructor(private dialog: MatDialog,private route: ActivatedRoute,private router:Router,private httpClient: HttpClient) { }
  email: string;
  calendarOption : [];
  event : string;
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.email = params['email'];
    });
  }

  openCalendarOption() {
    this.httpClient.post<any>('http://localhost:3000/user/getcalendarlist',{email:this.email}).subscribe( (responseData)=>{
      let arr = [];
      arr.push(1);
      let calMap = new Map();
      const dialogConfig = new MatDialogConfig();
      responseData.record.forEach(function(cal) {
        calMap.set(cal.id, cal.summary)
      });
      dialogConfig.data = calMap;
      let dialogRef = this.dialog.open(CalendarOptionComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(value => {
        if(value !== ''){
          this.calendarOption = value;
        }
      });
    },error => {
      console.log("error====",error);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);
    });
  }

  /*openCalendarOption() {
    let arr = [];
    arr.push(1);
    const dialogConfig = new MatDialogConfig();
    let dummyData = ['Contacts','Holiday in India'];
    dummyData.push(this.email)
    dialogConfig.data = dummyData;
    let dialogRef = this.dialog.open(CalendarOptionComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      if(value !== ''){
        this.calendarOption = value;
      }
    });
  }*/
  openCalendarEvent() {
    /* const dialogConfig = new MatDialogConfig();
    let dummyData = ['Contacts','Holiday in India'];
    dummyData.push(this.email)
    dialogConfig.data = dummyData;
    let dialogRef = this.dialog.open(CalendareventComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
    if(value){
    this.event = value;
    }
    });*/
// Show the event in dialog box
    this.httpClient.post<any>('http://localhost:3000/user/getcalendarlist',{email:this.email}).subscribe( (responseData)=>{
      const dialogConfig = new MatDialogConfig();
      let eventIdArray = [];
      eventIdArray.push(responseData.record[0].id);
      dialogConfig.data = eventIdArray;
      let dialogRef = this.dialog.open(CalendareventComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(value => {
        if(value){
          this.event = value;
        }
      });
    },error => {
      console.log("error====",error);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);
    });

  }


  updateEventCalendar() {
      let data =  {
        eventType: this.event,
        calnedarOption : this.calendarOption,
        email : this.email
      };
      this.httpClient.post<any>('http://localhost:3000/user/updateCalendarEvent',data).subscribe((responseData)=>{
        console.log("responseData====",responseData);
        this.router.navigate(["availability/"+this.email]);
      },error => {
        console.log("error====",error);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = error;
        this.dialog.open(MessagedialogComponent, dialogConfig);
      });
  }

  setUpLater() {
    this.router.navigate(["availability/"+this.email]);
  }
}

