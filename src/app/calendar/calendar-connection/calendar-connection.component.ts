import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {SignUpService} from '../../Auth/sign-up.service';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';


@Component({
  selector: 'app-calendar-connection',
  templateUrl: './calendar-connection.component.html',
  styleUrls: ['./calendar-connection.component.css']
})
export class CalendarConnectionComponent implements OnInit {
  checked: boolean=true;
  userId:{};
  public calendar: string;
  public param1;
  public _emailID;
  public calendarId;
  public email;
  switchValue: false;
  constructor(private route: ActivatedRoute, private dialog: MatDialog,private httpClient: HttpClient,private authService:AuthServiceLocal,private router:Router, private signUpService: SignUpService) {
    this.userId = this.authService.getUid();
    console.log('UserId ', this.userId);
  }

  ngOnInit() {
    /* this.signUpService.getCalendarEventsListener().subscribe((responseData)=>{
    this.calendarId = responseData.record[0].id;
    console.log("Response id====",this.calendarId);

    });
    this._emailID = localStorage.getItem('emailId');
    this.email = localStorage.getItem('emailId');
    this.signUpService.getCalendarEventsList(this._emailID);
    this.param1 = this.route.snapshot.queryParamMap.get('code');
    console.log('Query Param ', this.param1);
    this.signUpService.updateToken(this.param1,this._emailID,this.userId,this.calendarId);
    this.signUpService.getGenerateTokenListener().subscribe((responseData)=>{
    console.log("responseData token ---- ",responseData);
    //this.OnCreateAccount();
    });*/
    this.httpClient.post<{message: string,data: []}>('http://localhost:3000/googleCalendar/calendarId',{'userId': this.userId}).subscribe(
      res =>{
        console.log('Response---> ',res);
<<<<<<< HEAD
        this.calendar = res.data['0'].calendarEvent
=======
        this.calendar = res.data['0'].calanderId
>>>>>>> 99000335af931bb3a175773c259d6b31e2ac1b6f
      },err => {
        console.log("Error=========",err.message);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = err;
        this.dialog.open(MessagedialogComponent, dialogConfig);
      });
  }


}
