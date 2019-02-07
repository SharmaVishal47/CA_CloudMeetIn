import {Component, OnInit} from '@angular/core';
import {AuthService, GoogleLoginProvider} from 'angular-6-social-login';
import {FormControl, FormGroup, MaxLengthValidator, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Route, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signUp: FormGroup;
  isSignInStatus = 0;
  email = '';
  param1;
  _emailID ;
  signUpForm: FormGroup;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor( private socialAuthService: AuthService,private router:Router,private httpClient: HttpClient,private route: ActivatedRoute,private dialog: MatDialog) {}
  ngOnInit() {

    this.param1 = this.route.snapshot.queryParamMap.get('code');
    console.log(this.param1);
    if (this.param1) {
      this._emailID = localStorage.getItem('email');
      this.httpClient.post<any>('http://localhost:3000/googleCalendar/generateToken',{_token: this.param1, email: this._emailID}).subscribe((responseData)=>{
        console.log("responseData====",responseData);
        // localStorage.removeItem('email');
        // this.router.navigate(['signup']);
        this.isSignInStatus = 2;
      });
    }
    this.signUp = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern(this.emailPattern)])
    });
    this.signUpForm = new FormGroup({
      emailID: new FormControl(null, [Validators.required, Validators.pattern(this.emailPattern)]),
      fullName: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
    this.route.params.subscribe((params: Params) => {
      this.email =  params['email'];
      this.signUp.patchValue({email: this.email});
    });
    this.route.params.subscribe((params: Params) => {
      let _emailId=  localStorage.getItem('email');
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
          localStorage.setItem('email', userData.email);
          this.signUpForm.patchValue({
            emailID: userData.email
          });

          this.httpClient.get<any>('http://localhost:3000/googleCalendar/signupcal').subscribe((responseData)=>{
            console.log("responseData====",responseData.url);
            // this.router.navigate([responseData.url]);
            window.location.href = responseData.url;
            this.OnCreateAccount();
          },error => {
            console.log("error====",error);
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = error;
            this.dialog.open(MessagedialogComponent, dialogConfig);
          });
        }else{
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = "Unauthorized access,Email does not match!";
          this.dialog.open(MessagedialogComponent, dialogConfig);
          this.isSignInStatus = 0;
        }
      }
    );
  }
  onSubmit() {
    this.httpClient.post<any>('http://localhost:3000/user/checkuseremail',this.signUp.value).subscribe((responseData)=>{
      console.log("responseData====",responseData);
      if(responseData.data.length>0){
        console.log("Email already exists.");
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = "Email already exists.";
        this.dialog.open(MessagedialogComponent, dialogConfig);
      }else{
        this.email = this.signUp.value.email;
        this.isSignInStatus = 1;
        console.log("this.signUp.value1====",this.signUp.value);
      }
    },error => {
      console.log("error====",error);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);
    });
  }

  onSubmitProfile() {
    this.isSignInStatus = 1;
    console.log("this.signUp.value2====",this.signUpForm.value);
    this.httpClient.post<any>('http://localhost:3000/user/updateUserProfile',this.signUpForm.value).subscribe((responseData)=>{
       console.log("responseData====",responseData);
       this.router.navigate(["settings/"+this.signUpForm.value.emailID]);
     },error => {
       console.log("error====",error);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);
     });
  }

  OnCreateAccount() {
     this.isSignInStatus = 2;
    this.signUpForm.patchValue({
      emailID: this.email
    });
  }

/*  socialSignIn() {
    this.httpClient.get<any>('http://localhost:3000/googleCalendar/signupcal').subscribe((responseData)=>{
      console.log("responseData====",responseData);
      this.router.navigate(['/login']);
    },error => {
      console.log("error====",error);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);
    });
  }*/
}
