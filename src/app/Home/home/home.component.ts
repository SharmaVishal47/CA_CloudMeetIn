import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MeetingService} from '../../meetings/meeting.service';
import * as CryptoJS  from 'crypto-js';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {AuthServiceLocal} from '../../Auth/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  signUp: FormGroup;
  email: string;
  checkboxValue: false;
  isSpinning = true;
  loginCheck = false;
  constructor(private fb: FormBuilder, private route: ActivatedRoute,private router:Router, private meetingService: MeetingService,private authService: AuthServiceLocal) { }


  ngOnInit() {
    /*const  ciphertext = 'U2FsdGVkX19I9poxVYeEhXJDe/3c7qcmFUGoxaM/v8MJG6JTvlvGHoPsw/Xy707k'
    const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), 'sfdc31011992');
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    console.log(plaintext);*/
    this.authService.disableProgress.subscribe((value )=> {
      this.isSpinning = false;
      this.loginCheck = true;
    });
    this.authService.autoAuthenticateUser("");

    this.meetingService.removeHeader(false);
    this.authService.homeAuthStatusListener.subscribe(check => {
      this.loginCheck = true;
      this.isSpinning = false;
    });
    let offset = new Date().getTimezoneOffset();
    // console.log("TimeZone=====",offset);

    this.signUp = this.fb.group({
      email: [ null, [ Validators.required ] ],
    });
    this.route.params.subscribe((params: Params) => {
      this.email = params['email'];
      this.signUp.patchValue({email: this.email});
    });

  }

  onSubmit() {
    for (const i in this.signUp.controls) {
      this.signUp.controls[ i ].markAsDirty();
      this.signUp.controls[ i ].updateValueAndValidity();
    }
    this.authService.beforeSignUp(this.signUp.value.email);
    /*this.router.navigate(['signup/'+this.signUp.value.email]);*/
  }
  checkCheckBoxvalue(event){
    // console.log(this.checkboxValue)
  }
}
