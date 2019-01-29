import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Route, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  email: string;
  validUserId = true;
  constructor(private router:Router,private httpClient: HttpClient,private route: ActivatedRoute,private dialog: MatDialog) { }

  ngOnInit() {
    this.form = new FormGroup({
      userId: new FormControl(null, [Validators.required]),
      timeZone: new FormControl(null, [Validators.required])
    });
    this.route.params.subscribe((params: Params) => {
      this.email = params['email'];
      console.log("this.email====",this.email);
    });
  }
  getUser(event){
    console.log('Form--> ',this.form.value.userId);
    this.httpClient.post<{message: string,data: []}>('http://localhost:3000/user/checkuser',this.form.value).subscribe((responseData)=>{
      console.log("responseData====",responseData.data);
      if(responseData.data.length>0){
        this.validUserId = false;
      }else{
        this.validUserId = true;
      }
    },error => {
      console.log("error====",error);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);
    });
  }

  onSubmit() {
    console.log('Form--> ',this.form.value);
    this.httpClient.post<any>('http://localhost:3000/user/updateUser',{email: this.email,timeZone:this.form.value.timeZone,userId:this.form.value.userId}).subscribe((responseData)=>{
      console.log("responseData====",responseData);
      this.router.navigate(["calendar/"+this.email]);
    },error => {
      console.log("error====",error);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);
    });
  }
}
