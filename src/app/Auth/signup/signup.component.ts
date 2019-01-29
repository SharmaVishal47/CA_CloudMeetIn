import {Component, OnInit} from '@angular/core';
import {AuthService, GoogleLoginProvider} from 'angular-6-social-login';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Route, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {CalendarOptionComponent} from '../../calendar-option/calendar-option.component';
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
  signUpForm: FormGroup;
  constructor( private socialAuthService: AuthService,private router:Router,private httpClient: HttpClient,private route: ActivatedRoute,private dialog: MatDialog) {}
  ngOnInit() {
    this.signUp = new FormGroup({
      email: new FormControl(null, [Validators.required])
    });
    this.signUpForm = new FormGroup({
      emailID: new FormControl(null, [Validators.required]),
      fullName: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
    this.route.params.subscribe((params: Params) => {
      this.email = params['email'];
      this.signUp.patchValue({email: this.email});
    });
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
   if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        // @ts-ignore
        console.log(socialPlatform + ' sign in data : ' , userData);
        this.signUpForm.patchValue({
          emailID: userData.email
        });
        this.httpClient.post<any>('http://localhost:3000/user/signup',this.signUp.value).subscribe((responseData)=>{
          console.log("responseData====",responseData);
          this.OnCreateAccount();
        },error => {
          console.log("error====",error);
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = error;
          this.dialog.open(MessagedialogComponent, dialogConfig);
        });
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
}
