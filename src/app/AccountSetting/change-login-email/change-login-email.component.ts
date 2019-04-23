import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {AccountSettingsService} from '../account-setting/account-settings.service';

@Component({
  selector: 'app-change-login-email',
  templateUrl: './change-login-email.component.html',
  styleUrls: ['./change-login-email.component.css']
})
export class ChangeLoginEmailComponent implements OnInit {
  changPasswordForm: FormGroup;
  queryData;
  email;
  valid;
  /*userEmail;*/
  constructor(private accountService:AccountSettingsService, private fb: FormBuilder,private router: Router,private activatedRoute: ActivatedRoute,private authService:AuthServiceLocal) { }
  ngOnInit() {
   // this.authService.logOutOnEmailChange();
    /*this.userEmail = this.authService.getUserEmaild();*/
    this.changPasswordForm = this.fb.group({
      password: [ null, [ Validators.required ] ]
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.queryData = params['data'];
      this.email = params['email'];
      console.log(' QueryParams--->',this.queryData);
      console.log(' QueryParams email--->',this.email);
     /* console.log(' user email--->',this.userEmail);*/
    });
    //this.accountService.getUserEmail();
 this.accountService.checkTokenDataUpdateEmail(this.queryData,this.email);
  }
  submitForm(): void {
    let loginForm = this.changPasswordForm.value;
    loginForm['emailID'] = this.email;
    console.log('LoginForm', loginForm);
    for (const i in this.changPasswordForm.controls) {
      this.changPasswordForm.controls[ i ].markAsDirty();
      this.changPasswordForm.controls[ i ].updateValueAndValidity();
    }
    this.authService.loginUser(loginForm);

  }
}
