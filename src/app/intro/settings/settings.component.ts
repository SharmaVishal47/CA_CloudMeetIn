import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material';
import {SignUpService} from '../../Auth/sign-up.service';
import * as moment from 'moment-timezone';
import {MessageServiceService} from '../../Auth/message-service.service';
import {MeetingService} from '../../meetings/meeting.service';
import {Subscription} from 'rxjs';
import {ValidInputDirective} from '../../Directive/valid-input.directive';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit ,OnDestroy{
  form: FormGroup;
  email: string;
  validUserId = true;
  timeZone: string = "Asia/Kolkata";
  _userSelectTimeZone ;
  isSpinning = true;
  private subscriptions = new Subscription();
  _name: any;
  constructor(private messageService:MessageServiceService,private router:Router,
              private httpClient: HttpClient,private route: ActivatedRoute,private dialog: MatDialog,
              private signUpService: SignUpService, private meetingService: MeetingService,
              private message: NzMessageService) { }
  ngOnInit() {
    this.form = new FormGroup({
      userId: new FormControl(null, [Validators.required, ValidInputDirective.userId])
    });
    this.meetingService.removeHeader(true);
    this.email =  localStorage.getItem('email');
    this.subscriptions = this.signUpService.checkEmail.subscribe((responseData: {data: any,message: String})=>{
      console.log("Data=======",responseData.data);
      if(responseData.data.length>0){
        if(responseData.data[0].userId != null && responseData.data[0].userId != undefined && responseData.data[0].userId != ""){
          this.router.navigate(['error']);
        }else{
          this.isSpinning = false;
        }
      }else{
        this.router.navigate(['error']);
      }
      this.isSpinning = false;
    },error1 => {
      this.router.navigate(['error']);
    });

    if(this.email){
      this.signUpService.checkUserEmail({email:  this.email });
      console.log("Auth User Sign Up Email ===== >> ", this.email);
      let timeZone = moment.tz.guess();
      console.log("timeZoneOffset======",timeZone);
      if(timeZone == "Asia/Calcutta"){
        this.timeZone = "Asia/Kolkata";
      }else{
        this.timeZone = timeZone;
      }
      this.signUpService.getExistingUserId().subscribe((responseData)=>{
        if (responseData.data.length>0){
          this.validUserId = false;
        }else{
          this.validUserId = true;
        }
      });
    }else{
      this.router.navigate(['error']);
    }
  }

  getUser(event){
    if(this.form.valid) {
      this.signUpService.checkUser(this.form.value);
    } else {
      console.log("Form is inValid");
    }
  }

  onSubmit() {
    if(this.form.valid) {
      if(this.validUserId){
        if(this._userSelectTimeZone) {
          this.signUpService.updateTimeZoneUserId(this.email,this._userSelectTimeZone,this.form.value.userId);
        }else{
          this.messageService.generateErrorMessage("Please Select Time Zone")
        }
      }else{
        this.messageService.generateErrorMessage("Please choose another Username")
      }
    } else {
      this.message.create('warning', `Please enter a valid user id`);
    }
  }


  changeTimezone(selectTimeZone: string) {
    this._userSelectTimeZone  =  typeof selectTimeZone === 'string' && selectTimeZone.split('').length > 0 ? selectTimeZone : false;

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  omit_special_char(e) {
    let k;
    document.all ? k = e.keyCode : k = e.which;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 45 || (k >= 48 && k <= 57));
  }
}
