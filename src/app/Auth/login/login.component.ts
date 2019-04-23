import {Component, OnInit} from '@angular/core';
import { AuthService} from 'angular-6-social-login';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {AuthServiceLocal} from '../auth.service';
import {HeaderserviceService} from '../../Home/headerservice.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {MessageServiceService} from '../message-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  param1;
  loginForm: FormGroup;
  constructor(private messageService:MessageServiceService , private fb: FormBuilder, private headerserviceService: HeaderserviceService, private socialAuthService: AuthService,private router:Router,private httpClient: HttpClient,private route: ActivatedRoute,private dialog: MatDialog,private authService:AuthServiceLocal) {}
  ngOnInit() {
    this.headerserviceService.getTokenExpiry();
 /*   this.param1 = this.route.snapshot.queryParamMap.get('code');
    if(this.param1) {
      this.httpClient.post<{message: string,data: []}>('https://dev.cloudmeetin.com/googleCalendar/generateToken',{_token: this.param1 }).subscribe((responseData)=>{
        console.log("responseData====",responseData.data);
        this.router.navigate(["/login"]);
      },error => {
        console.log("error====",error);
        this.messageService.generateErrorMessage(error);
       /!* const dialogConfig = new MatDialogConfig();
        dialogConfig.data = error;
        this.dialog.open(MessagedialogComponent, dialogConfig);*!/
      });
      console.log(this.param1);
    }*/

    this.loginForm = this.fb.group({
      emailID: [ null, [ Validators.email,Validators.required ] ],
      password: [ null, [ Validators.required ] ]
    });

  }
  submitForm(): void {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[ i ].markAsDirty();
      this.loginForm.controls[ i ].updateValueAndValidity();
    }
    console.log('Datas--------->', this.loginForm.value);
    this.authService.loginUser(this.loginForm.value);
  }
}
