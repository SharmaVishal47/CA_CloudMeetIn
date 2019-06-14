import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService, GoogleLoginProvider} from 'angular-6-social-login';
import {FormBuilder, FormControl, FormGroup, MaxLengthValidator, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Route, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {SignUpService} from '../sign-up.service';
/*import * as AllIcons from 'ant-icons-angular/icons';*/
import {IconDefinition, IconService} from '@ant-design/icons-angular';
import {MessageServiceService} from '../message-service.service';
import {AuthServiceLocal} from '../auth.service';
import {Subscription} from 'rxjs';
import * as CryptoJS from 'crypto-js';
import {MeetingService} from '../../meetings/meeting.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isButtonStatus :  boolean = false;
  isSpinning = true;
  signUp: FormGroup;
  isSignInStatus = 0;
  email = '';
  param1;
  verifiedEmail ;
  verifiedToken ;
  _emailID ;
  signUpForm: FormGroup;
  passwordVisible = false;
  password: string;
  emailAuth :Subscription;
  buttonCheck = true;
  isDisabled: boolean = true;
  isValid: boolean = false;
  isUserEmail: string;
  isValidUserSub: Subscription;
  inValidAuthSub: Subscription;
  gmailAuthUserData: any;
  /*_link: any = 'sumit.kumar@cloudanalogy.com';*/
  /* use for maintain the routing*/
  calendarCheckPoint;
  userIdAndTimeZoneCheckPoint;
  calendarIdCheckPoint;
  availabilityDaysAndStartEndTimeCheckPoint;
  userRoleCheckPoint;
  isCheckedButton = false;
  _link = 'theatulrai1@gmail.com';
  constructor(
    private _iconService: IconService, private fb: FormBuilder, private socialAuthService: AuthService,
              private router:Router,private httpClient: HttpClient,private route: ActivatedRoute,private dialog: MatDialog,
              private signUpService: SignUpService,
              private messageService:MessageServiceService ,private authService: AuthServiceLocal,
              private meetingService: MeetingService,
           private message: NzMessageService) {

  }
  ngOnInit() {
    this.meetingService.removeHeader(false);
    this.authService.homeAuthStatusListener.subscribe(check => {
      this.isSpinning = false;
    });
    this.authService.autoAuthenticateUser("signup");
    this.emailAuth = this.signUpService.checkEmail.subscribe((responseData: {data: any,message: String})=>{
      if(responseData.data.length>0){
        console.log("responseData=============",responseData);

        this.calendarCheckPoint = responseData.data[0].token_path != null && responseData.data[0].token_path != undefined && responseData.data[0].token_path.split('').length > 0;


        this.userIdAndTimeZoneCheckPoint = responseData.data[0].userId != null && responseData.data[0].userId != undefined && responseData.data[0].userId.split('').length > 0;

        this.calendarIdCheckPoint =
          responseData.data[0].calanderId != null && responseData.data[0].calanderId != undefined && responseData.data[0].calanderId.split('').length > 0
          && responseData.data[0].calendarEvent != null && responseData.data[0].calendarEvent != undefined && responseData.data[0].calendarEvent.split('').length > 0;

        this.availabilityDaysAndStartEndTimeCheckPoint =
          responseData.data[0].availableDays != null && responseData.data[0].availableDays != undefined && responseData.data[0].availableDays.split('').length > 0
          && responseData.data[0].startTime != null && responseData.data[0].startTime != undefined  && responseData.data[0].startTime.split('').length > 0
          && responseData.data[0].endTime != null && responseData.data[0].endTime != undefined  && responseData.data[0].endTime.split('').length > 0;
        this.userRoleCheckPoint = responseData.data[0].role != null && responseData.data[0].role != undefined &&  responseData.data[0].role.split('').length > 0;

      /*  this.calendarCheckPoint =
          responseData.data[0].calendarEvent != null && responseData.data[0].calendarEvent != undefined && responseData.data[0].calendarEvent.split('').length > 0
          && responseData.data[0].userId != null && responseData.data[0].userId != undefined && responseData.data[0].userId.split('').length > 0;

        this.userIdAndTimeZoneCheckPoint =
          responseData.data[0].userId != null && responseData.data[0].userId != undefined && responseData.data[0].userId.split('').length > 0;

        this.calendarIdCheckPoint =
          responseData.data[0].calanderId != null && responseData.data[0].calanderId != undefined && responseData.data[0].calanderId.split('').length > 0
          && responseData.data[0].calendarEvent != null && responseData.data[0].calendarEvent != undefined && responseData.data[0].calendarEvent.split('').length > 0;

        this.availabilityDaysAndStartEndTimeCheckPoint =
          responseData.data[0].availableDays != null && responseData.data[0].availableDays != undefined && responseData.data[0].availableDays.split('').length > 0
          && responseData.data[0].startTime != null && responseData.data[0].startTime != undefined  && responseData.data[0].startTime.split('').length > 0
          && responseData.data[0].endTime != null && responseData.data[0].endTime != undefined  && responseData.data[0].endTime.split('').length > 0;

        this.userRoleCheckPoint = responseData.data[0].role != null && responseData.data[0].role != undefined &&  responseData.data[0].role.split('').length > 0;*/

        console.log('calendarCheckPoint : === ', this.calendarCheckPoint);
        console.log('userIdAndTimeZoneCheckPoint : === ', this.userIdAndTimeZoneCheckPoint);
        console.log('calendarIdCheckPoint : === ', this.calendarIdCheckPoint);
        console.log('availabilityDaysAndStartEndTimeCheckPoint : === ', this.availabilityDaysAndStartEndTimeCheckPoint);
        console.log('userRoleCheckPoint : === ', this.userRoleCheckPoint);

        localStorage.setItem("email",this.gmailAuthUserData.email);
        localStorage.setItem("emailSignUp",this.gmailAuthUserData.email);
        localStorage.setItem("process","gmail");
         if (this.calendarCheckPoint && this.userIdAndTimeZoneCheckPoint && this.calendarIdCheckPoint && this.availabilityDaysAndStartEndTimeCheckPoint && this.userRoleCheckPoint){
           this.authService.loginUser({emailID: responseData.data[0].email,password: responseData.data[0].password});
        } else if(this.calendarCheckPoint && this.userIdAndTimeZoneCheckPoint && this.calendarIdCheckPoint && this.availabilityDaysAndStartEndTimeCheckPoint){
           this.router.navigate(['userRole']);
         } else if(this.calendarCheckPoint && this.userIdAndTimeZoneCheckPoint && this.calendarIdCheckPoint){
           this.router.navigate(['availability']);
         } else if(this.calendarCheckPoint && this.userIdAndTimeZoneCheckPoint) {
           this.router.navigate(['calendar']);
         } else if(this.calendarCheckPoint) {
           this.router.navigate(['settings']);
         }
         else {
           this.router.navigate(['calender/option']);
        }
      /*  if(responseData.data[0].calendarEvent != null && responseData.data[0].calendarEvent != undefined && responseData.data[0].userId != null && responseData.data[0].userId != undefined){
          this.authService.loginUser({emailID: responseData.data[0].email,password: responseData.data[0].password});
        }else{
          localStorage.setItem("email",this.gmailAuthUserData.email);
          localStorage.setItem("emailSignUp",this.gmailAuthUserData.email);
          localStorage.setItem("process","gmail");
          this.router.navigate(['calender/option']);
          /!*this.signUpService.generateGmailAuthUrl();*!/
        }*/
      } else {
        this.httpClient.post<any>('/user/signupbysignon',{email: this.gmailAuthUserData.email,name: this.gmailAuthUserData.name,image: this.gmailAuthUserData.image}).subscribe((responseData)=>{
          localStorage.setItem("email",this.gmailAuthUserData.email);
          localStorage.setItem("emailSignUp",this.gmailAuthUserData.email);
          localStorage.setItem("process","gmail");
          this.router.navigate(['calender/option']);
          /*this.signUpService.generateGmailAuthUrl();*/
        },error => {
          this.messageService.generateErrorMessage("Something went gone wrong.");
        });
      }
    },error1 => {
      this.buttonCheck = true;
    });
  }

  signUpByGoogleEmail() {
    if(this.isCheckedButton) {
      this.socialSignIn('google');
    } else {
      this.message.create('warning', `Please select the terms & conditions`);
    }

  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log("userData=======",userData);
        this.gmailAuthUserData = userData;
        this.signUpService.checkUserEmail({email: userData.email});
      }
    );
  }

  onSubmit() {
    this.buttonCheck = false;
    this.signUpService.checkUserEmail(this.signUp.value);
  }

  onSubmitProfile() {
    this.signUpService.updateUserProfile(this.signUpForm.value);
  }

  OnCreateAccount() {
    this.isSignInStatus = 1;

    this.signUpForm.patchValue({
      emailID: this._emailID
    });
  }

  navigateToLogin() {
    this.isSpinning = true;
    this.authService.autoAuthenticateUser("signup");
  }

  ngOnDestroy(): void {
    this.emailAuth.unsubscribe();
  }


}
