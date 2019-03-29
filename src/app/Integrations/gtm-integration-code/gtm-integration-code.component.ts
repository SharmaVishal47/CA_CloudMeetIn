import {  OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {MeetingService} from '../../meetings/meeting.service';
import {Component} from '@angular/core';

@Component({
  selector: 'app-gtm-integration-code',
  templateUrl: './gtm-integration-code.component.html',
  styleUrls: ['./gtm-integration-code.component.css']
})
export class GTMIntegrationCodeComponent implements OnInit {

  constructor(private httpClient: HttpClient,private route: ActivatedRoute,private dialog: MatDialog,private router: Router,private authService: AuthServiceLocal,private meetingService: MeetingService) { }
  paramCode:string;
  ngOnInit() {
    this.meetingService.authStatusListener.next(true);
    this.paramCode = this.route.snapshot.queryParamMap.get('code');
    if (this.paramCode) {
      console.log("Code",this.paramCode);
      let client_id_client_secret64 = window.btoa("nQK9NcecyeyuXtnY4dM9OvJ3yI5uhVxH"+':'+"qnAAlqfUmAwNOPpc");
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
          this.httpClient.post<{message: string,data: []}>('http://localhost:3000/integration/gotomeetingAdd',body,).subscribe((responseData)=>{
            console.log("integrationForm responseData====",responseData.data);
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = 'GTM Connected';
            let dialogRef = this.dialog.open(MessagedialogComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(value => {
              this.authService.autoAuthenticateUserAfterIntegration("integrations/gotomeeting");
            });
          },error => {
            console.log("error====",error);
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = "Something gone wrong,Please try again.";
            this.dialog.open(MessagedialogComponent, dialogConfig);
          });

        },
        err => {
          console.log("Error=========",err.message);
        });
    }else{
      window.location.href = "https://api.getgo.com/oauth/v2/authorize?client_id=nQK9NcecyeyuXtnY4dM9OvJ3yI5uhVxH&response_type=code";
    }
  }
}
