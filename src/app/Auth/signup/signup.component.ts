import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isSpinning = false;
  signUp: FormGroup;
  isSignInStatus = 0;
  email = '';
  param1;
  _emailID ;
  signUpForm: FormGroup;
  passwordVisible = false;
  password: string;
  emailAuth :Subscription;
  constructor(private _iconService: IconService, private fb: FormBuilder, private socialAuthService: AuthService,
              private router:Router,private httpClient: HttpClient,private route: ActivatedRoute,private dialog: MatDialog,
              private signUpService: SignUpService,
              private messageService:MessageServiceService ,private authService: AuthServiceLocal) {

  }
  ngOnInit() {
    this.param1 = this.route.snapshot.queryParamMap.get('code');
    if (this.param1) {
      this._emailID = localStorage.getItem('emailSignUp');
      this.email = localStorage.getItem('emailSignUp');
      this.signUpService.getGenerateTokenListener().subscribe((responseData)=>{
        console.log("responseData token====",responseData);
        this.OnCreateAccount();
      });
      this.signUpService.generateToken(this.param1,this._emailID);
    }
    this.signUp = new FormGroup({
      email: new FormControl(null, [Validators.email,Validators.required])
    });
    this.signUpForm = new FormGroup({
      emailID: new FormControl(null, [Validators.email , Validators.required]),
      fullName: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
    this.route.params.subscribe((params: Params) => {
      this.email =  params['email'];
      this.signUp.patchValue({email: this.email});
    });
    this.route.params.subscribe((params: Params) => {
      let _emailId=  localStorage.getItem('emailSignUp');
      this.signUpForm.patchValue(
        {emailID: _emailId});
    });
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        if(this.email === userData.email){
          console.log(socialPlatform + ' sign in data : ' , userData);
          localStorage.setItem('emailSignUp', userData.email);
          localStorage.setItem('email', userData.email);
          this.signUpForm.patchValue({
            emailID: userData.email
          });

          this.signUpService.generateGmailAuthUrl();
        }else{
          this.messageService.generateErrorMessage("Unauthorized access,Email does not match!");
        }
      }
    );
  }
  onSubmit() {
    this.signUpService.checkUserEmail(this.signUp.value);
    this.emailAuth = this.signUpService.getCheckEmailListener().subscribe((responseData: {data: String,message: String})=>{
      if(responseData.data.length>0){
        this.messageService.generateErrorMessage("Email already exist.");
        this.emailAuth.unsubscribe();
       /* const dialogConfig = new MatDialogConfig();
        dialogConfig.data = "Email already exists.";
        this.dialog.open(MessagedialogComponent, dialogConfig);*/
      }else{
        this.email = this.signUp.value.email;
        this.socialSignIn('google');
      }
    });
  }

  onSubmitProfile() {
    this.signUpService.updateUserProfile(this.signUpForm.value)
  }

  OnCreateAccount() {
    this.isSignInStatus = 1;
    this.signUpForm.patchValue({
      emailID: this._emailID
    });
  }

  navigateToLogin() {
    this.isSpinning = true;
    this.authService.autoAuthenticateUser();
  }
}
