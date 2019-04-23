import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../messagedialog/messagedialog.component';
import {AuthServiceLocal} from '../Auth/auth.service';
import {MessageServiceService} from '../Auth/message-service.service';

@Component({
  selector: 'app-available-date-time',
  templateUrl: './available-date-time.component.html',
  styleUrls: ['./available-date-time.component.css']
})
export class AvailableDateTimeComponent implements OnInit {
  time;
  form: FormGroup;
  userId;
  defaultStartTime:string;
  defaultEndTime:string;
  availableDays:[];
  item;
  email;
// chk1;chk2;chk3;chk4;chk5;chk6;chk7;

  constructor(private messageService: MessageServiceService,private router:Router,private httpClient: HttpClient,private route: ActivatedRoute,private fb: FormBuilder,private dialog: MatDialog , private authService:AuthServiceLocal) {}
  ngOnInit() {
    this.email = this.authService.getUserEmaild();
    this.userId = this.authService.getUserId();
    /* this.form = new FormGroup({
    inTime: new FormControl(null,[Validators.required]),
    outTime: new FormControl(null,[Validators.required]),
    selectedOption: this.fb.array([],[Validators.required])
    });*/
    this.form = this.fb.group({
      inTime: [ null, [ Validators.required ] ],
      outTime: [ null, [ Validators.required ] ],
      selectedOption: [ null, [ Validators.required ] ],
    });
    this.httpClient.post<{message: string,data: []}>('https://dev.cloudmeetin.com/user/getTimeAvailability',{'userId': this.userId}).subscribe(
      res =>{
        console.log("res===========",res);
        this.defaultStartTime = res.data['0'].startTime;
        this.defaultEndTime = res.data['0'].endTime;
        this.availableDays = res.data['0'].availableDays.toString().split(',');
        this.checkTime();
      },err => {
        console.log("Error=========",err.message);
        this.messageService.generateErrorMessage(JSON.stringify(err));
        /*const dialogConfig = new MatDialogConfig();
        dialogConfig.data = err;
        this.dialog.open(MessagedialogComponent, dialogConfig);*/
      });
  }

  checkTime(){
    if(this.defaultStartTime < this.defaultEndTime){
      console.log(' start time--> ', this.defaultStartTime);
      console.log(' end time--> ',this.defaultEndTime);
      this.time = true;
      console.log('time-->',this.time);
    }else{ this.time = false;}
  }

  updateConfiguration() {
    this.form.value['userId'] = this.userId;
    console.log("Value=====",this.form.value);
    this.httpClient.post<any>('https://dev.cloudmeetin.com/user/updateUserConfiguration',this.form.value).subscribe((responseData)=>{
      console.log("responseData====",responseData);
      this.router.navigate(["dashboard"]);
    },error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
     /* const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);*/
    });
  }

  /* onChange(email: string, isChecked: boolean) {
  const emailFormArray = <FormArray>this.form.controls.selectedOption;
  if (isChecked) {
  emailFormArray.push(new FormControl(email));
  } else {
  let index = emailFormArray.controls.findIndex(x => x.value == email);
  emailFormArray.removeAt(index);
  }
  this.dayFormArray = emailFormArray;
  }
  */
  setUpLater() {
// this.router.navigate(["dashboard/"+this.email]);
    this.router.navigate(["dashboard"]);
  }

}
