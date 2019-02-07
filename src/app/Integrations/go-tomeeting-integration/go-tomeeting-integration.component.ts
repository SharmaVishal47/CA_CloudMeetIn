import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AuthServiceLocal} from '../../Auth/auth.service';
@Component({
  selector: 'app-go-tomeeting-integration',
  templateUrl: './go-tomeeting-integration.component.html',
  styleUrls: ['./go-tomeeting-integration.component.css']
})
export class GoTomeetingIntegrationComponent implements OnInit {
  editable: boolean = false;
  integrationForm: FormGroup;
  userId: string;
  constructor(private dialog: MatDialog,private httpClient: HttpClient,private authService:AuthServiceLocal,private router:Router) { }

  ngOnInit() {
    this.integrationForm = new FormGroup({
      emailId: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      clientId: new FormControl(null, [Validators.required]),
    });
    this.userId = this.authService.getUserId();
    console.log("userId===",this.userId);
    this.httpClient.post<{message: string,data: []}>('http://localhost:3000/integration/getgotomeeting',{userId: this.userId}).subscribe(
      res =>{
        if(res.data.length > 0){
          console.log("res===========",res.data['0']);
          this.editable = true;
          this.integrationForm.patchValue({
            emailId: res.data['0'].emailId,
            password: res.data['0'].password,
            clientId: res.data['0'].clientId
          });
        }
      },err => {
        console.log("Error=========",err.message);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = err;
        this.dialog.open(MessagedialogComponent, dialogConfig);
      });
  }

  onSubmit() {
    this.httpClient.get<any>('https://api.getgo.com/oauth/access_token?grant_type=password&user_id='+this.integrationForm.value.emailId+'&password='+this.integrationForm.value.password+'&client_id='+this.integrationForm.value.clientId).subscribe(
      res =>{
        this.integrationForm.value['userId'] = this.userId;
        this.httpClient.post<{message: string,data: []}>('http://localhost:3000/integration/gotomeetingAdd',this.integrationForm.value).subscribe((responseData)=>{
          console.log("integrationForm responseData====",responseData.data);
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = 'Integration Completed';
          let dialogRef = this.dialog.open(MessagedialogComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(value => {
            this.router.navigate(["dashboard/:"+this.authService.getUserEmaild()]);
          });
        },error => {
          console.log("error====",error);
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = error;
          this.dialog.open(MessagedialogComponent, dialogConfig);
        });
      },
      err => {
        console.log("Error=========",err.message);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = 'Please check given credentials and client id.';
        this.dialog.open(MessagedialogComponent, dialogConfig);
      });
  }
}
