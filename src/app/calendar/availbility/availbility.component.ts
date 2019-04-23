import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {SignUpService} from '../../Auth/sign-up.service';

@Component({
  selector: 'app-availbility',
  templateUrl: './availbility.component.html',
  styleUrls: ['./availbility.component.css']
})
export class AvailbilityComponent implements OnInit {
  email: string;
  defaultStartTime = "06:00";
  defaultEndTime = "24:00";
  time = true;

  availabilityForm: FormGroup;
  listOfDays = ['1','2','3','4','5'];
  constructor(private fb: FormBuilder,private signUpService: SignUpService,private router:Router,private httpClient: HttpClient,private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.availabilityForm = this.fb.group({
      inTime: [ null, [ Validators.required ] ],
      outTime: [ null, [ Validators.required ] ],
      selectedOption: [ null, [ Validators.required ] ],
    });
    this.email = this.signUpService.getAuthUserEmail();
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
    this.availabilityForm.value['email'] = this.email;
    this.signUpService.updateAvailabilityConfiguration(this.availabilityForm.value);
    console.log('Availability Form---> ',this.availabilityForm.value);
  }
}


/*
import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material';
import {SignUpService} from '../../Auth/sign-up.service';

@Component({
  selector: 'app-availbility',
  templateUrl: './availbility.component.html',
  styleUrls: ['./availbility.component.css']
})
export class AvailbilityComponent implements OnInit {
  form: FormGroup;
  dayFormArray: FormArray;
  email: string;
  defaultStartTime = "09:00";
  defaultEndTime = "20:00";

  constructor(private signUpService: SignUpService,private router:Router,private httpClient: HttpClient,private route: ActivatedRoute,private fb: FormBuilder,private dialog: MatDialog) {}
  ngOnInit() {
    this.form = new FormGroup({
      inTime: new FormControl(null,[Validators.required]),
      outTime: new FormControl(null,[Validators.required]),
      selectedOption: this.fb.array([],[Validators.required])
    });

   this.email = this.signUpService.getAuthUserEmail();
  }

  updateConfiguration() {
    this.form.value['email'] = this.email;
    this.signUpService.updateAvailabilityConfiguration(this.form.value);
  }

  onChange(email: string, isChecked: boolean) {
    const emailFormArray = <FormArray>this.form.controls.selectedOption;
    if (isChecked) {
      emailFormArray.push(new FormControl(email));
    } else {
      let index = emailFormArray.controls.findIndex(x => x.value == email)
      emailFormArray.removeAt(index);
    }
    this.dayFormArray = emailFormArray;
  }
}
*/
