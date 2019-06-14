import {Component, OnDestroy, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {SignUpService} from '../Auth/sign-up.service';
import {MeetingService} from '../meetings/meeting.service';
import {Subscription} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd';
@Component({
  selector: 'app-user-role-component',
  templateUrl: './user-role-component.component.html',
  styleUrls: ['./user-role-component.component.css']
})
export class UserRoleComponentComponent implements OnInit,OnDestroy {
  calendarForm: FormGroup;
  selectedOption;
  email: string;
  isSpinning = true;
  private subscriptions = new Subscription();
  data = ['Customer success + Account Management','Interview Scheduling','Sales Marketing','Leader + Entrepreneur','Education','Freelance + Consultant','Other'];
  constructor(private signUpService: SignUpService,private router:Router,private httpClient: HttpClient,
              private route: ActivatedRoute,private dialog: MatDialog,
              private meetingService: MeetingService,
              private message: NzMessageService) { }
  body;
  ngOnInit() {
    this.calendarForm = new FormGroup({
      role: new FormControl(null,[Validators.required])
    });
    this.meetingService.removeHeader(true);
    this.email =  localStorage.getItem('email');
    if(this.email){
      this.signUpService.checkUserEmail({email:  this.email });
      console.log("Auth User Sign Up Email ===== >> ", this.email);
    }else{
      this.router.navigate(['error']);
    }
    this.subscriptions = this.signUpService.checkEmail.subscribe((responseData: {data: any,message: String})=>{
      console.log("Data=======",responseData.data);
      if(responseData.data.length>0){
        if(responseData.data[0].role != null ){
          this.router.navigate(['error']);
        }else{
          this.isSpinning = false;
        }
      }else{
        this.router.navigate(['error']);
      }
    },error1 => {
      this.router.navigate(['error']);
    });

  }
  updateRole() {
    for (const i in this.calendarForm.controls) {
      this.calendarForm.controls[ i ].markAsDirty();
      this.calendarForm.controls[ i ].updateValueAndValidity();
    }
    if(this.calendarForm.valid) {
      this.calendarForm.value['email']=this.email;
      console.log("Body---->", this.calendarForm.value);

      this.signUpService.updateRoleOfUser(this.calendarForm.value);
    } else {
      this.message.create('warning', `Please fill all field`);
    }
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

