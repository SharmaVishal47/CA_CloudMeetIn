import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {MeetingService} from '../../meetings/meeting.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../admin.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  countDown;
  counter = 30;
  buttonStatus: boolean = false;
  tick = 1000;
  loginForm: FormGroup;
  public aFormGroup: FormGroup;
  public readonly siteKey = '6LcvoUgUAAAAAJJbhcXvLn3KgG-pyULLusaU4mL1';
  size: any = 'Normal';
  lang: any;
  theme: any;
  type: any;
  OTP;
  constructor(
    private meetingService: MeetingService,
    private fb: FormBuilder,
    private adminService: AdminService,
    private message: NzMessageService

  ) { }

  ngOnInit() {

    this.adminService.autoAuthListener();
    this.loginForm = this.fb.group({
      emailID: [ null, [ Validators.email,Validators.required ] ],
      password: [ null, [ Validators.required ] ],
      recaptcha: ['', Validators.required]
    });
    this.meetingService.removeHeader(true);

  }
  submitForm(): void {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[ i ].markAsDirty();
      this.loginForm.controls[ i ].updateValueAndValidity();
    }
    console.log("Form Data : ", this.loginForm.value);

    let captcha = typeof (this.OTP) === 'string' && this.OTP !== 'undefined' && this.OTP.length == 4 ? this.OTP : false;
    if(captcha) {
      if(captcha === this.loginForm.value.recaptcha) {
        this.adminService.onSubmitAdminRecord(this.loginForm.value);
        this.message.remove();
      } else {
        this.message.create('error', `Invalid captcha code`);
      }
    }

  }

  handleReset() {

  }

  handleExpire() {

  }

  handleError() {

  }

  handleLoad() {

  }

  handleSuccess(event: string) {
  console.log("Success : ", event);
  }

  getCaptcha() {
      this.buttonStatus = true;
      this.counter = 30;
      this.tick = 1000;
      let digits = '0123456789';
      this.OTP = '';
      for (let i = 0; i < 4; i++ ) {
        this.OTP += digits[Math.floor(Math.random() * 10)];
      }
      this.countDown = Observable.timer(0, this.tick)
        .take(this.counter)
        .map(() => --this.counter);
      console.log('OTP', this.OTP);
      this.message.success('This is Captcha code ' + this.OTP ,  {
        nzDuration: 30000
      });
      if(this.counter == 0) {
        this.buttonStatus = false;
      }
  }
}
@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return ('00' + Math.floor(value - minutes * 60)).slice(-2);
  }
}
