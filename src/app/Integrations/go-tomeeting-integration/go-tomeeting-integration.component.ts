import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import { Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {MeetingService} from '../../meetings/meeting.service';
import {NzModalService} from 'ng-zorro-antd';
import {MessageServiceService} from '../../Auth/message-service.service';
import {IntegrationService} from '../integration.service';
@Component({
  selector: 'app-go-tomeeting-integration',
  templateUrl: './go-tomeeting-integration.component.html',
  styleUrls: ['./go-tomeeting-integration.component.css']
})
export class GoTomeetingIntegrationComponent implements OnInit {
  defaultMettingPlatform;
  emailId: string;
  userId: string;
  constructor(private messageService:MessageServiceService,private dialog: MatDialog,private httpClient: HttpClient,
              private authService:AuthServiceLocal,private meetingService: MeetingService,private router: Router,private modalService: NzModalService,
              private integrationService: IntegrationService) { }
  alreadyIntegrated = false;
  gtmIntegratedEmail: string;
  spinLoading: boolean =  true;


  ngOnInit() {
    this.meetingService.authStatusListener.next(false);
    this.meetingService.inetgrationGTMDetail.subscribe((responseData)=>{
      console.log("Integration detail====",responseData);
      if(responseData.data.length > 0){
        this.alreadyIntegrated = true;
        this.gtmIntegratedEmail = responseData.data[0].email;
        this.spinLoading = false;
      }else{
        this.alreadyIntegrated = false;
        this.spinLoading = false;
      }
    });
    this.emailId = localStorage.getItem("emailId");
    this.userId = localStorage.getItem("userId");
    this.meetingService.gotoMeetingDetail();
  }

  gtmIntegrationStart() {
    console.log("start");
    this.router.navigate(['integrations/gotomeeting/code']);
  }

  disconnectGTM() {
    this.modalService.confirm({
      nzTitle: 'Disconnect GTM',
      nzContent: 'Are you sure,you want to disconnect the GTM?',
      nzOkText: 'OK',
      nzCancelText: 'Cancel',
      nzOnOk: () =>{
        this.httpClient.post<any>('https://dev.cloudmeetin.com/meeting/disconnectgtmintegration',{userId: this.userId}).subscribe((responseData)=>{
          this.integrationService.getMeetingPlatforms(this.userId).subscribe((response) => {
            this.defaultMettingPlatform= response.data[0].zoom === 'true' ? 'ZOOM' : null;
            this.integrationService.AddMeetingPlatforms( this.userId, this.defaultMettingPlatform).subscribe((response) => {
              this.alreadyIntegrated = false;
              this.spinLoading = false;
            })
          });
        },error => {
          this.messageService.generateErrorMessage(JSON.stringify(error));
          this.spinLoading = false;
        });
      }
    });
  }
}
