import {  OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {MeetingService} from '../../meetings/meeting.service';
import {Component} from '@angular/core';
import {MessageServiceService} from '../../Auth/message-service.service';
import {IntegrationService} from '../integration.service';

@Component({
  selector: 'app-gtm-integration-code',
  templateUrl: './gtm-integration-code.component.html',
  styleUrls: ['./gtm-integration-code.component.css']
})
export class GTMIntegrationCodeComponent implements OnInit {
  isVisible = false;
  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };
  defaultPlatform = 'GTM';

  GTM: string ;
  ZOOM: string ;
  constructor(
    private messageService:MessageServiceService,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthServiceLocal,
    private meetingService: MeetingService,
    private integrationService: IntegrationService
  ) { }
  paramCode:string;
  ngOnInit() {
    this.meetingService.authStatusListener.next(true);
    this.paramCode = this.route.snapshot.queryParamMap.get('code');
    if (this.paramCode) {
      console.log("Code",this.paramCode);
      let client_id_client_secret64 = window.btoa("2dWCGOZLt9Y28Rmc0xfWNz84kPGkEpfA"+':'+"9uFMfxwb5tG1zK0O");
      let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': 'Basic '+client_id_client_secret64
      });
      let optionsHeader = {
        headers: httpHeaders
      };
      this.httpClient.post<any>('https://api.getgo.com/oauth/v2/token?grant_type=authorization_code&code='+this.paramCode,{},optionsHeader).subscribe(
        res =>{
          let access_token = res.access_token;
          let account_key = res.account_key;
          let email = res.email;
          let firstName = res.firstName;
          let lastName = res.lastName;
          let organizer_key = res.organizer_key;
          let expires_in = res.expires_in;
          let refresh_token = res.refresh_token;
          let body = {
            access_token: access_token,
            account_key: account_key,
            email: email,
            firstName: firstName,
            lastName: lastName,
            organizer_key: organizer_key,
            refresh_token: refresh_token,
            userId: localStorage.getItem('userId'),
            expires_in: expires_in
          };

          this.httpClient.post<{message: string,data: []}>('https://dev.cloudmeetin.com/integration/gotomeetingAdd',body,).subscribe((responseData)=>{
            console.log("integrationForm responseData====",responseData.data);
            this.messageService.generateSuccessMessage("GTM Connected");
            this.integrationService.getMeetingPlatforms(localStorage.getItem('userId')).subscribe( (response) => {
              console.log("Response of Multiple platform records : ", response);
              if(response.data.length > 0) {
                this.GTM = response.data[0].go2meeting;
                this.ZOOM = response.data[0].zoom;
                if (this.GTM === 'true' && this.ZOOM === 'true') {
                  this.isVisible = true;
                } else {
                  this.integrationService.AddMeetingPlatforms(localStorage.getItem('userId'), 'GTM').subscribe((response) => {
                    this.authService.autoAuthenticateUserAfterIntegration("integrations/gotomeeting");
                  });
                }
              }
            });

          },error => {
            console.log("error====",error);
            this.messageService.generateErrorMessage("Something gone wrong,Please try again.")
          });

        },
        err => {
          console.log("Error=========",err.message);
        });
    }else{
      window.location.href = "https://api.getgo.com/oauth/v2/authorize?client_id=2dWCGOZLt9Y28Rmc0xfWNz84kPGkEpfA&response_type=code";
    }
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
        this.authService.autoAuthenticateUserAfterIntegration("integrations/gotomeeting");
      });
    }
  }
}
