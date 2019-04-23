import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../messagedialog/messagedialog.component';
import {Subject} from 'rxjs';
import {AuthServiceLocal} from './auth.service';
import {MessageServiceService} from './message-service.service';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  private checkEmail = new Subject<{data: String,message: String}>();
  private checkUserId = new Subject<{data: [],message: String}>();
  private generateTokenSubject = new Subject<any>();
  private getCalendarOption = new Subject<any>();
  private getCalendarEvents = new Subject<any>();
  private password: string;
  constructor(private messageService: MessageServiceService,private httpClient: HttpClient,private router: Router,private dialog: MatDialog,private authService: AuthServiceLocal) { }

  getCheckEmailListener(){
    return this.checkEmail.asObservable();
  }

  getCalendarEventsListener(){
    return this.getCalendarEvents.asObservable();
  }

  getCalendarOptionListener(){
    return this.getCalendarOption.asObservable();
  }

  getGenerateTokenListener(){
    return this.generateTokenSubject.asObservable();
  }
  getExistingUserId(){
    return this.checkUserId.asObservable();
  }

  updateRoleOfUser(formData){
    this.httpClient.post<any>('https://dev.cloudmeetin.com/user/updateRole',formData).subscribe((responseData)=>{


      let email = localStorage.getItem("emailSignUp");
      let password = localStorage.getItem("password");
      localStorage.removeItem("emailSignUp");
      localStorage.removeItem("password");
      this.authService.loginUserAfterSignup({emailID: email,password: password});
    },error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
   /*   const dialogConfig = new MatDialogConfig();
      dialogConfig.data = JSON.stringify(error);
      this.dialog.open(MessagedialogComponent, dialogConfig);*/
    });
  }

  updateAvailabilityConfiguration(formData){
    this.httpClient.post<any>('https://dev.cloudmeetin.com/user/updateConfiguration',formData).subscribe((responseData)=>{
      this.router.navigate(["userRole"]);
    },error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
     /* const dialogConfig = new MatDialogConfig();
      dialogConfig.data = JSON.stringify(error);
      this.dialog.open(MessagedialogComponent, dialogConfig);*/
    });
  }

  public updateCalendarEventOptions(event,calendarOptions,email){
    let data =  {
      eventType: event,
      calnedarOption : calendarOptions,
      email : email
    };
    this.httpClient.post<any>('https://dev.cloudmeetin.com/user/updateCalendarEvent',data).subscribe((responseData)=>{
      this.router.navigate(["availability"]);
    },error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
      /*const dialogConfig = new MatDialogConfig();
      dialogConfig.data = JSON.stringify(error);
      this.dialog.open(MessagedialogComponent, dialogConfig);*/
    });
  }

  public getCalendarEventsList(email: string){
    this.httpClient.post<any>('https://dev.cloudmeetin.com/user/getcalendarlist',{email: email}).subscribe( (responseData)=>{
      this.getCalendarEvents.next(responseData);
    },error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
      /*const dialogConfig = new MatDialogConfig();
      dialogConfig.data = JSON.stringify(error);
      this.dialog.open(MessagedialogComponent, dialogConfig);*/
    });
  }

  public getCalendarOptionList(email: string){
    this.httpClient.post<any>('https://dev.cloudmeetin.com/user/getcalendarlist',{email: email}).subscribe( (responseData)=>{
      this.getCalendarOption.next(responseData);
    },error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
      /*const dialogConfig = new MatDialogConfig();
      dialogConfig.data = JSON.stringify(error);
      this.dialog.open(MessagedialogComponent, dialogConfig);*/
    });
  }

  public updateTimeZoneUserId(email,timeZone,userId){
    this.httpClient.post<any>('https://dev.cloudmeetin.com/user/updateUser',{email: email,timeZone: timeZone,userId: userId}).subscribe((responseData)=>{
      this.router.navigate(['calendar']);
    },error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
      /*const dialogConfig = new MatDialogConfig();
      dialogConfig.data = JSON.stringify(error);
      this.dialog.open(MessagedialogComponent, dialogConfig);*/
    });
  }

  public generateToken(token: string,emailId: string){
    this.httpClient.post<any>('https://dev.cloudmeetin.com/googleCalendar/generateToken',{_token: token, email: emailId}).subscribe((responseData)=>{
      this.generateTokenSubject.next(responseData);
    }, error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
      /*const dialogConfig = new MatDialogConfig();
      dialogConfig.data = JSON.stringify(error);
      this.dialog.open(MessagedialogComponent, dialogConfig);*/
    });
  }

  public generateGmailAuthUrl() {
    this.httpClient.get<any>('https://dev.cloudmeetin.com/googleCalendar/signupcal').subscribe((responseData) => {
      window.location.href = responseData.url;
    }, error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
     /* const dialogConfig = new MatDialogConfig();
      dialogConfig.data = JSON.stringify(error);
      this.dialog.open(MessagedialogComponent, dialogConfig);*/
    });
  }

  public checkUserEmail(signUpData){
    this.httpClient.post<any>('https://dev.cloudmeetin.com/user/checkuseremail',signUpData).subscribe((responseData)=>{
      this.checkEmail.next(responseData);
    },error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
    /*  const dialogConfig = new MatDialogConfig();
      dialogConfig.data = JSON.stringify(error);
      this.dialog.open(MessagedialogComponent, dialogConfig);*/
    });
  }

  /* This method return the authorise email (Sign Up Email) */
  public getAuthUserEmail() {
    return  localStorage.getItem('email').toString();

  }
  public updateUserProfile(profileData){
    localStorage.setItem("password",profileData.password);
    console.log("password===",profileData.password);
    this.httpClient.post<any>('https://dev.cloudmeetin.com/user/updateUserProfile',profileData).subscribe((responseData)=>{
     //  this.authorizeSignUpEmail =  profileData.profileData.emailID;
      this.router.navigate(["settings"]);
    },error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
      /*const dialogConfig = new MatDialogConfig();
      dialogConfig.data = JSON.stringify(error);
      this.dialog.open(MessagedialogComponent, dialogConfig);*/
    });
  }

  public checkUser(formData){
    this.httpClient.post<{message: string,data: []}>('https://dev.cloudmeetin.com/user/checkuser',formData).subscribe((responseData)=>{
      this.checkUserId.next(responseData);
    },error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
      /* const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);*/
    });
  }

  /*Abhishek*/
  public updateToken(token: string,emailId: string, userId:any, calendarId:string){
    this.httpClient.post<any>('https://dev.cloudmeetin.com/googleCalendar/updateToken',{_token: token, email: emailId,userId:userId,calendarId:calendarId}).subscribe((responseData)=>{
      this.generateTokenSubject.next(responseData);
    }, error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
     /* const dialogConfig = new MatDialogConfig();
      dialogConfig.data = JSON.stringify(error);
      this.dialog.open(MessagedialogComponent, dialogConfig);*/
    });
  }
}
