import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {SignUpService} from '../../Auth/sign-up.service';
import {MeetingService} from '../../meetings/meeting.service';
import {Subscription} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-availbility',
  templateUrl: './availbility.component.html',
  styleUrls: ['./availbility.component.css']
})
export class AvailbilityComponent implements OnInit  ,OnDestroy{
  email: string;
  defaultStartTime = "06:00";
  defaultEndTime = "24:00";
  time = true;
  isSpinning = true;
  availabilityForm: FormGroup;
  listOfDays = ['1','2','3','4','5'];
  private subscriptions = new Subscription();
  constructor(private fb: FormBuilder,private signUpService: SignUpService,
              private router:Router,private httpClient: HttpClient,private route: ActivatedRoute,
              private meetingService: MeetingService,
              private message: NzMessageService) { }
  ngOnInit(): void {
    this.availabilityForm = this.fb.group({
      inTime: [ null, [ Validators.required ] ],
      outTime: [ null, [ Validators.required ] ],
      selectedOption: [ null, [ Validators.required ] ],
    });
    this.meetingService.removeHeader(true);
    this.email = localStorage.getItem('email');
    this.subscriptions = this.signUpService.checkEmail.subscribe((responseData: {data: any,message: String})=>{
      console.log("Data=======",responseData.data);
      if(responseData.data.length>0){
        if(responseData.data[0].startTime != null && responseData.data[0].endTime != null && responseData.data[0].availableDays != null){
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
    }else{
      this.router.navigate(['error']);
    }
  }

  checkTime(){
    if(this.defaultStartTime < this.defaultEndTime){
      console.log(' start time--> ', this.defaultStartTime);
      console.log(' end time--> ',this.defaultEndTime);
      this.time = true;
      console.log('time-->',this.time);
    }else{ this.time = false;}
  }

  submitForm(): void {
    for (const i in this.availabilityForm.controls) {
      this.availabilityForm.controls[ i ].markAsDirty();
      this.availabilityForm.controls[ i ].updateValueAndValidity();
    }
    if(this.availabilityForm.valid) {
      this.availabilityForm.value['email'] = this.email;
      this.signUpService.updateAvailabilityConfiguration(this.availabilityForm.value);
      console.log('Availability Form---> ',this.availabilityForm.value);
    } else {
      this.message.create('warning', `Please fill all field`);
    }

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
