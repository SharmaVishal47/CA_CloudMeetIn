import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../messagedialog/messagedialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceLocal {

  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private emailId: string;
  private userId: string;
  private fullName: string;

  constructor(private httpClient: HttpClient,private router: Router,private dialog: MatDialog) { }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getIsAuthenticated(){
    return this.isAuthenticated;
  }
  getUserEmaild(){
    return this.emailId;
  }
  getUserId(){
    return this.userId;
  }

  getFullName(){
    return this.fullName;
  }

  loginUser(data: {emailID: string,password: string}){
    this.httpClient.post<any>('http://localhost:3000/user/checkemailpassword',data).subscribe((responseData)=>{
      console.log("responseDatak====",responseData.data);
      if(responseData.data.length>0){
        this.emailId = data.emailID;
        this.userId = responseData.data[0].userId.toString();
        this.fullName = responseData.data[0].fullName.toString();
        this.isAuthenticated = true;
        this.router.navigate(["dashboard/"+data.emailID]);
        this.authStatusListener.next(true);
      }else{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = "Invalid username/password.";
        this.dialog.open(MessagedialogComponent, dialogConfig);
        this.authStatusListener.next(false);
      }
    },error => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);
      this.authStatusListener.next(false);
    });
  }
}
