import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {IntegrationService} from '../integration.service';
import {MeetingService} from '../../meetings/meeting.service';

@Component({
  selector: 'app-zoom-integration',
  templateUrl: './zoom-integration.component.html',
  styleUrls: ['./zoom-integration.component.css']
})
export class ZoomIntegrationComponent implements OnInit {
  defaultMettingPlatform;
  alreadyIntegrated = false;
  zoomCode: string;
  user_id: string;
  GTM: string;
  ZOOM: string;
  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };
  defaultPlatform = 'GTM';
  isVisible = false;
  refreshToken: string;
  spinLoading: boolean = true;
  constructor(private httpClient: HttpClient, private route: ActivatedRoute,
              private modalService: NzModalService, private authService: AuthServiceLocal,
              private dialog: MatDialog, private integrationService : IntegrationService,
              private meetingService: MeetingService) {}

  ngOnInit() {
    console.log("log 3");
    this.user_id = localStorage.getItem('userId');
    this.zoomCode = this.route.snapshot.queryParamMap.get('code');
    this.httpClient.post<any>('/zoom/checkintegrationstatus',{user_id: this.user_id}).subscribe((responseData)=>{
      console.log("Get Zoom Response Data", responseData );
      if(responseData.data.length > 0) {
        this.alreadyIntegrated = responseData.data[0].integrationStatus;
        this.refreshToken = responseData.data[0].refresh_token;
        console.log("Refresh Token", this.refreshToken);
        this.spinLoading =  false;
        this.authService.autoAuthenticateUserAfterIntegration("integrations/zoommeeting");
      } else {
        this.authService.autoAuthenticateUserAfterIntegration("integrations/zoommeeting");
        this.alreadyIntegrated = false;
        this.spinLoading =  false;
      }
    });
    if((this.user_id && this.zoomCode) && !this.alreadyIntegrated) {
      if(this.zoomCode && this.user_id) {
        this.httpClient.post<any>('/zoom/zoomcallback',{code: this.zoomCode, user_id: this.user_id}).subscribe((responseData)=>{
          console.log("Zoom Response Data when details is insert in database", responseData );
          this.integrationService.getMeetingPlatforms(this.user_id).subscribe( (response) => {
            console.log("Response of Multiple platform records : ", response);
            if(response.data.length > 0) {
              this.alreadyIntegrated = true;
              this.GTM = response.data[0].go2meeting;
              this.ZOOM = response.data[0].zoom;
              if (this.GTM === 'true' && this.ZOOM === 'true') {
                this.isVisible = true;
              } else {
                this.integrationService.AddMeetingPlatforms(localStorage.getItem('userId'), 'ZOOM').subscribe((response) => {
                  this.authService.autoAuthenticateUserAfterIntegration("integrations/zoommeeting");
                });
              }
            }
          });
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = 'Zoom Connected';
          let dialogRef = this.dialog.open(MessagedialogComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(value => {
            /* this.authService.autoAuthenticateUser();*/
            // this.authService.autoAuthenticateUserAfterIntegration("integrations/zoommeeting");
          });
        })
      } else {
        console.log("log 2");
        this.authService.autoAuthenticateUserAfterIntegration("integrations/zoommeeting");
      }
    } else {
      console.log("log 1");
      this.authService.autoAuthenticateUserAfterIntegration("integrations/zoommeeting");
    }
  }

  zoomMeetingIntegration() {
    /*let zoomClientId = 'dvRsLP5cSOFosrcG4Df1w';*/ /*Sumit Dev*/
   /* let myAppRedirect = 'http://localhost:4200/integrations/zoommeeting';*/
    let zoomClientId = 'sLjYhPSHQU6foXMbp6dOrA'; /* Prod*/
    let myAppRedirect = 'https://cloudmeetin.com/integrations/zoommeeting';
    window.location.href = "https://zoom.us/oauth/authorize" + "?response_type=code&client_id=" + zoomClientId + "&redirect_uri=" + myAppRedirect;
  }

  disconnectZoomIntegration() {
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Are you sure you want to disconnect the Zoom?',
      nzOkText: 'OK',
      nzCancelText: 'Cancel',
      nzOnOk: () =>{
        this.httpClient.post<any>('/zoom/disconnectzoomintegration',{user_id: this.user_id}).subscribe((responseData)=>{
          this.integrationService.getMeetingPlatforms(this.user_id).subscribe((response) => {
            this.defaultMettingPlatform= response.data[0].go2meeting === 'true' ? 'GTM' : null;
            this.integrationService.AddMeetingPlatforms( this.user_id, this.defaultMettingPlatform).subscribe((response) => {
              this.alreadyIntegrated = false;
            })
          });
        })
      }
    });
  }
  OnSelectedPlatform(meetingPlatForm: string) {
    this.defaultPlatform =  meetingPlatForm
  }

  handleOk() {
    this.isVisible = false;
    let selectedPlatform =  typeof (this.defaultPlatform) === 'string' &&  this.defaultPlatform !== 'undefined' && this.defaultPlatform.split('').length > 0 ? this.defaultPlatform : 'GTM';
    console.log("Response -- > ok ", selectedPlatform);
    if(selectedPlatform) {
      this.integrationService.AddMeetingPlatforms(localStorage.getItem('userId'), selectedPlatform).subscribe((response) => {
        console.log("Add Meeting response : ", response);
        this.authService.autoAuthenticateUserAfterIntegration("integrations/zoommeeting");
      });
    }
  }
}
