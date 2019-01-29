import { Component, OnInit } from '@angular/core';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  scheduling: true;
  count = 0;
  event: string;
   /* _id ;
   _userId ;
   _zoomMeetingUrl  ;
   _zoomMeetingId ;
   _salesForceRecordId  ;
   _schedulerName ;
   _schedulerEmail ;
   _meetingDate ;
   _meetingTime ;
   _eventType ;
   _timeZone ;
   _g2mMeetingId  ;
   _g2mMeetingUrl ;*/
   responseData = [] ;
   fullName ;
  constructor(private authService: AuthServiceLocal,private router:Router,  private  httpClient: HttpClient, private dialog: MatDialog) { }

  ngOnInit() {
     this.fullName= this.authService.getFullName();
    this.httpClient.post<any>('http://localhost:3000/meeting/getMeetingRecord',{userId: this.authService.getUserId()}).subscribe((responseData)=>{
      console.log("responseData====",responseData);
      this.responseData =  responseData.data;
     /* for(let i = 0; i< responseData.data.length ; i ++ ) {
         this._id  = responseData.data[i].id;
        this._userId  = responseData.data[i].userId;
        this._zoomMeetingUrl  = responseData.data[i].ZoomMeetingUrl;
        this._zoomMeetingId  = responseData.data[i].zoomMeetingId;
        this._salesForceRecordId  = responseData.data[i].salesforceRecordId;
        this._schedulerName  = responseData.data[i].schedulerName;
        this._schedulerEmail  = responseData.data[i].schedulerEmail;
        this._meetingDate  = responseData.data[i].meetingDate;
        this._meetingTime  = responseData.data[i].meetingTime;
        this._eventType  = responseData.data[i].eventType;
        this._timeZone  = responseData.data[i].timeZone;
        this._g2mMeetingId  = responseData.data[i].g2mMeetingId;
        this._g2mMeetingUrl  = responseData.data[i].g2mMeetingUrl;
      }*/

    },error => {
      console.log("error====",error);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);
    });
    this.count =3;
    this.event=" Meeting";
    if(this.authService.getUserId()){

    }else{
      this.router.navigate([""]);
    }
  }

}
