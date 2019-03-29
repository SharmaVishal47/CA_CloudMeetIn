import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {AuthServiceLocal} from '../../Auth/auth.service';

@Component({
  selector: 'app-zoom-integration',
  templateUrl: './zoom-integration.component.html',
  styleUrls: ['./zoom-integration.component.css']
})
export class ZoomIntegrationComponent implements OnInit {
  alreadyIntegrated = false;
  zoomCode: string;
  user_id: string;
  refreshToken: string;
  constructor(private httpClient: HttpClient, private route: ActivatedRoute,
              private modalService: NzModalService, private authService: AuthServiceLocal, private dialog: MatDialog ) {}

  ngOnInit() {
    this.user_id = localStorage.getItem('userId');
    this.zoomCode = this.route.snapshot.queryParamMap.get('code');
    this.httpClient.post<any>('http://localhost:3000/zoom/checkintegrationstatus',{user_id: this.user_id}).subscribe((responseData)=>{
      console.log("Get Zoom Response Data", responseData );
      if(responseData.data.length > 0) {
        this.alreadyIntegrated = responseData.data[0].integrationStatus;
        this.refreshToken = responseData.data[0].refresh_token;
        console.log("Refresh Token", this.refreshToken);
        this.httpClient.post<any>('http://localhost:3000/zoom/insert',{refreshToken: this.refreshToken, user_id: this.user_id}).subscribe((responseData1)=>{
          console.log("Get Zoom Response Data", responseData1 );
        });
      } else {
        this.alreadyIntegrated = false;
      }
    });
    if((this.user_id && this.zoomCode) && !this.alreadyIntegrated) {
      if(this.zoomCode && this.user_id) {
        this.httpClient.post<any>('http://localhost:3000/zoom/zoomcallback',{code: this.zoomCode, user_id: this.user_id}).subscribe((responseData)=>{
          console.log("Zoom Response Data when details is insert in database", responseData );
// this.alreadyIntegrated = true;
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = 'Zoom Connected';
          let dialogRef = this.dialog.open(MessagedialogComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(value => {
            this.authService.autoAuthenticateUser();
          });
        })
      }
    }
  }

  zoomMeetingIntegration() {
    let zoomClientId = 'dvRsLP5cSOFosrcG4Df1w';
    let myAppRedirect = 'http://localhost:4200/integrations/zoommeeting';
    window.location.href = "https://zoom.us/oauth/authorize" + "?response_type=code&client_id=" + zoomClientId + "&redirect_uri=" + myAppRedirect;
  }

  disconnectZoomIntegration() {
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Are you sure,you want to disconnect the Zoom?',
      nzOkText: 'OK',
      nzCancelText: 'Cancel',
      nzOnOk: () =>{
        this.httpClient.post<any>('http://localhost:3000/zoom/disconnectzoomintegration',{user_id: this.user_id}).subscribe((responseData)=>{
          console.log("Zoom disconnect", responseData );
          this.alreadyIntegrated = false;
        })
      }
    });

  }
}
