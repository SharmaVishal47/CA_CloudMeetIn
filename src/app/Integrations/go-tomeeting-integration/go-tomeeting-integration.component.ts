import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {MeetingService} from '../../meetings/meeting.service';
import {NzModalService} from 'ng-zorro-antd';
@Component({
  selector: 'app-go-tomeeting-integration',
  templateUrl: './go-tomeeting-integration.component.html',
  styleUrls: ['./go-tomeeting-integration.component.css']
})
export class GoTomeetingIntegrationComponent implements OnInit {

  emailId: string;
  userId: string;
  constructor(private dialog: MatDialog,private httpClient: HttpClient,private authService:AuthServiceLocal,private meetingService: MeetingService,private router: Router,private modalService: NzModalService) { }
  alreadyIntegrated = false;
  gtmIntegratedEmail: string;

  ngOnInit() {
    this.meetingService.authStatusListener.next(false);
    this.meetingService.inetgrationGTMDetail.subscribe((responseData)=>{
      console.log("Integration detail====",responseData);
      if(responseData.data.length > 0){
        this.alreadyIntegrated = true;
        this.gtmIntegratedEmail = responseData.data[0].email;
      }else{
        this.alreadyIntegrated = false;
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
        this.httpClient.post<any>('http://localhost:3000/meeting/disconnectgtmintegration',{userId: this.userId}).subscribe((responseData)=>{
          this.alreadyIntegrated = false;
        },error => {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = JSON.stringify(error);
          this.dialog.open(MessagedialogComponent, dialogConfig);
        });
      }
    });
  }
}
