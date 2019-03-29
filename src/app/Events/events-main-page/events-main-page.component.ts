
import { Component, OnInit } from '@angular/core';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {EventService} from '../event.service';
import {EventModel} from '../../model/event';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-events-main-page',
  templateUrl: './events-main-page.component.html',
  styleUrls: ['./events-main-page.component.css']
})
export class EventsMainPageComponent implements OnInit {

  hostName: string = 'http://localhost:4200/';
  fullName: string;
  userId: string;
  userCheck= false;
  teamCheck = false;
  firstChar;
  EventTypeSlot = [];
/*  EventTypeSlot = [{
    event_color: 'yellow',
    event_type: '15 Minute Meeting',
    event_relation_type: 'One-on-One, 15 mins',
    event_link : 'http://localhost:4200/15minute',
    active : 'true'
  },
    {
      event_color: 'blue',
      event_type: '30 Minute Meeting',
      event_relation_type: 'One-on-One, 30 mins',
      event_link : 'http://localhost:4200/30minute',
      active : 'false'
    },
    {
      event_color: 'red',
      event_type: '60 Minute Meeting',
      event_relation_type: 'One-on-One, 60 mins',
      event_link : 'http://localhost:4200/1 hour',
      active : 'true'
    },
  ];*/

  constructor(
              private authService: AuthServiceLocal,
              private dialog: MatDialog,
              private httpClient: HttpClient,
              private router:Router,
              private eventService: EventService,
              private modalService: NzModalService,
              private message: NzMessageService
  ) { }
  ngOnInit() {
    this.eventService.getUserSelectEvents();
    this.eventService.userCreateEvents.subscribe((response) => {
      console.log("Response Data --- > ", response);
      this.EventTypeSlot = response;
    });
    this.fullName = this.authService.getFullName();
    this.userId = this.authService.getUserId();
    this.firstChar = this.fullName.split('');
    this.getUserList();
  }

  getUserList(){
    this.httpClient.post<{message: string,data: []}>('http://localhost:3000/usertable/getuserlist',{'userId': this.userId}).subscribe(res =>{
      console.log("res getuserlist=========",res);
      if(res.data.length > 0){
        this.userCheck = true;
        this.getTeamList();
      }
    },err => {
      this.getTeamList();
    });
  }
  getTeamList(){
    this.httpClient.post<{message: string,data: []}>('http://localhost:3000/team/getteamlist',{'userId': this.userId}).subscribe(res =>{
      console.log("getteamlist=========",res);
      if(res.data.length > 0){
        this.teamCheck = true;
      }
    },err => {

    });
  }

  log(event: string[]) {
    console.log(event);
  }

  onEditEvent(event_id: string, index: number) {
    this.eventService.onEditEventMain(event_id, index);

  }

  onDeleteEvent(event_id: string) {
    this.modalService.confirm({
      nzTitle: '<i>Do you Want to delete these event?</i>',
      nzOnOk: () => {
        this.eventService.singleEventDelete(event_id);
        this.message.create('success', `This event successfully deleted`);
      }
    });

  }
}
