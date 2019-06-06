import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {Subject} from 'rxjs';
import {AuthServiceLocal} from './auth.service';
import {MessageServiceService} from './message-service.service';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class SignUpService {
  checkEmail = new Subject<{data: String,message: String}>();
  private checkUserId = new Subject<{data: [],message: String}>();
  private generateTokenSubject = new Subject<any>();
  private getCalendarOption = new Subject<any>();
  private getCalendarEvents = new Subject<any>();
  public existUserStatus = new Subject<any>();
  private password: string;
  public checkCalendarEmail = new Subject<any>();
  authStatusListener = new Subject<boolean>();
  checkTokenSubject = new Subject<boolean>();
  private token: string;
  emailList = ['forcebolt.com',
    'sfuptech.com',
    'Salesforcecare.com',
    'Salesforceexpert.com',
    'salesforceup.com',
    'salesforcewise.com',
    'cloudanalogy.net',
    'ajaydubedi.com',
    'oursalesforcedev.com',
    'cloudanalogy.tech',
    'salesforcewise.com',
    'cloudanalogy.io',
    'cloudanalogy.info',
    'cloudanalogy.com',
    'adhiman.com'];

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
    this.httpClient.get<any>('/user/getlocation').subscribe((responseLocation) => {
      console.log("Respone of Location ss --- > ", responseLocation);
      formData['location'] = responseLocation.data.city;
      this.httpClient.post<any>('/user/updateRole',formData).subscribe((responseData)=>{
        let email = localStorage.getItem("emailSignUp");
        let password = localStorage.getItem("password");
        localStorage.removeItem("emailSignUp");
        localStorage.removeItem("password");
        this.authService.loginUserAfterSignup({emailID: email,password: password});
      },error => {
        this.messageService.generateErrorMessage(JSON.stringify(error));
      });
    });
  }

  updateAvailabilityConfiguration(formData){
    this.httpClient.post<any>('/user/updateConfiguration',formData).subscribe((responseData)=>{
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
    });
  }

  public getCalendarEventsList(email: string){
    this.httpClient.post<any>('https://dev.cloudmeetin.com/user/getcalendarlist',{email: email}).subscribe( (responseData)=>{
      this.getCalendarEvents.next(responseData);
    },error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));

    });
  }

  public getCalendarOptionList(email: string){
    this.httpClient.post<any>('https://dev.cloudmeetin.com/user/getcalendarlist',{email: email}).subscribe( (responseData)=>{
      this.getCalendarOption.next(responseData);
    },error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
    });
  }

  public updateTimeZoneUserId(email,timeZone,userId){
    this.httpClient.post<any>('https://dev.cloudmeetin.com/user/updateUser',{email: email,timeZone: timeZone,userId: userId}).subscribe((responseData)=>{
      this.router.navigate(['calendar']);
    },error => {
      // this.messageService.generateErrorMessage('Internal server Error');
    });
  }



  public generateGmailAuthUrl() {
    this.httpClient.get<any>('https://dev.cloudmeetin.com/googleCalendar/signupcal').subscribe((responseData) => {
      /*this.httpClient.get<any>('https://dev.cloudmeetin.com/googleCalendar/signupcal').subscribe((responseData) => {*/
      window.location.href = responseData.url;
    }, error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
    });
  }


  public checkUserEmail(signUpData){
    this.httpClient.post<any>('https://dev.cloudmeetin.com/user/checkuseremail',signUpData).subscribe((responseData)=>{
      this.checkEmail.next(responseData);
    },error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
    });
  }

  /* Sumit Kumar*/

  public userExistStatus(signUpData){
    this.httpClient.post<any>('https://dev.cloudmeetin.com/user/checkuseremail',signUpData).subscribe((responseData)=>{
      /*this.checkEmail.next(responseData);*/
      this.existUserStatus.next(responseData);
    },error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));

    });
  }

  /* This method return the authorise email (Sign Up Email) */
  public getAuthUserEmail() {
    return  localStorage.getItem('email').toString();

  }
  public updateUserProfile(profileData){
    localStorage.setItem("password",profileData.password);
    // console.log("password===",profileData.password);
    this.httpClient.post<any>('/user/updateUserProfile',profileData).subscribe((responseData)=>{
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
      this.messageService.generateErrorMessage('Internal Server Error');
    });
  }

  /*Abhishek*/
  public updateToken(token: string,emailId: string, userId:any, calendarId:string){
    this.httpClient.post<any>('/googleCalendar/updateToken',{_token: token, email: emailId,userId:userId,calendarId:calendarId}).subscribe((responseData)=>{
      this.generateTokenSubject.next(responseData);
    }, error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
    });
  }


  getUserAuthToken(userEmail: string) {
    this.httpClient.post<any>('/userData/sendVerificationLink',{email: userEmail}).subscribe((responseUserTokenData)=>{
      console.log("responseUserTokenData -- > ", responseUserTokenData);
      this.httpClient.post<any>('/sendResetPasswordEmail/sendResetPasswordEmail',{
        message: "\n\nHello , \n\nFollow this link to verify your email address. \n\n https://cloudmeetin.com/signup?email="+responseUserTokenData.email+"&data="+responseUserTokenData.token + "\n\nThanks, \n\nCloudMeetIn Team",
        subject: "CloudMeetIn Email Verification",
        email: responseUserTokenData.email
      }).subscribe((responseData)=>{
        console.log("Message : Email verification link have sent");
      });
    }, error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
    });
  }

  public signUpByEmail(data){
    console.log('Valid data ',data);
    this.httpClient.post<any>('https://dev.cloudmeetin.com/userEmail/createSignupToken',data).subscribe((responseData)=>{
      console.log('responseData----------------->',responseData.data.length);
      if(responseData.data.length>0){
        let token = responseData.data[0].token;
        let srcData =  "https://dev.cloudmeetin.com/calenderOption/signupData?signupData="+token;
        let body='<br><a href="'+srcData+'" style="  background-color: #4CAF50;border: none;color: white;padding: 15px 32px; text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;">'+ "Verify Your Email" + '</a>';
        console.log('Response token value-------->',responseData.data[0].token);
        console.log('Response Email value-------->',responseData.data[0].email);
        this.httpClient.post<any>('https://dev.cloudmeetin.com/sendSignupEmail/signupEmail',{
          message: "You have signUp successfully please verify your email address to proceed further click on verify your email \n " +body,
          email: responseData.data[0].email
        }).subscribe((responseData)=>{
          /* if(responseData.data.length>0){*/
          console.log('Response Email-------->',responseData.email);
          this.router.navigate(['/verify/'+responseData.email]);
          this.token = responseData.token;
          /* }else{
             this.messageService.generateErrorMessage("Email could not be send ");
             this.authStatusListener.next(false);
           }*/
        },error => {
          this.messageService.generateErrorMessage("Could not send email!! Check your mail service ");
        });
        this.messageService.generateSuccessMessage("You have registered successfully ! ");
        console.log('Response Message value-------->',"You are receiving this message because you have requested to reset your password\n Here is the link to reset your password https://dev.cloudmeetin.com/changePassword/"+token);
      }else{
        this.messageService.generateErrorMessage("Something went wrong plz try again ! ");
      }
    },error => {
      console.log('Error-------->',error);
      this.messageService.generateErrorMessage("Registration failed!! something went wrong ");
    });
  }

  checkTokenData(data:string){
    this.httpClient.post<any>('https://dev.cloudmeetin.com/userEmail/checkSignUpToken',{token:data}).subscribe((responseData)=>{
      console.log('Response data---> ',responseData);
      if(responseData.valid===true){
        let email:string  = responseData.result[0].email;
        this.password = responseData.result[0].password;
        //let verified = responseData.result[0].verified;
        let splitDomain = email.split('@');
        console.log('Email--> ',email);
        for (let email1 in this.emailList) {
          if (splitDomain[1] !== this.emailList[email1]) {
            console.log('Email  matched---->',this.emailList[email1]);
            this.httpClient.post<any>('https://dev.cloudmeetin.com/sendSignupEmail/signupEmail',{
              message: "Here is the new sign up  by an external user \n " +email,
              email: 'abhishek.singh@cloudanalogy.com'
            }).subscribe((responseData)=>{
              console.log('Email receved at sf@cloudanalogy.com');
            },error => {
              this.messageService.generateErrorMessage("Could not send email at sf@cloudanalogy.com ");
            });

          }else {
            console.log('Not Matched email ', this.emailList[email1]);
          }

        }
        localStorage.setItem('emailSignUp',email);
        localStorage.setItem('process','email');
        localStorage.setItem('email',email);
        localStorage.setItem("password",this.password);
        this.checkTokenSubject.next(true);
        this.messageService.generateSuccessMessage("Email verified successfully ! ");
        console.log('Response data ',responseData);
      }else{
        this.router.navigate(['/error']);
        this.messageService.generateErrorMessage("Sorry its an invalid token id plz try again ! ");
        this.authStatusListener.next(false);
      }
    },error => {
      this.router.navigate(['/error']);
      this.messageService.generateErrorMessage("Some Error occurred !!  ");
    });
  }

  public generateGmailAuthUrlByEmail() {
    this.httpClient.get<any>('https://dev.cloudmeetin.com/googleCalendar/signupcalbyemail').subscribe((responseData) => {
      window.location.href = responseData.url;
    }, error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
    });
  }

  public generateToken(token: string,emailId: string){
    console.log('Genrate Token---------------------------:');
    this.httpClient.post<any>('https://dev.cloudmeetin.com/googleCalendar/generateTokenSignUpEmail',{_token: token, email: emailId}).subscribe((responseData)=>{
      this.generateTokenSubject.next(responseData);
    }, error => {
      this.messageService.generateErrorMessage(JSON.stringify(error));
      /*const dialogConfig = new MatDialogConfig();
      dialogConfig.data = JSON.stringify(error);
      this.dialog.open(MessagedialogComponent, dialogConfig);*/
    });
  }

  public generateTokenBySignOn(token: string,emailId: string){
    this.httpClient.post<any>('/googleCalendar/generateTokenSignOn',{_token: token, email: emailId}).subscribe((responseData)=>{
      this.generateTokenSubject.next(responseData);
    }, error => {
      this.messageService.generateErrorMessage("Please select registered email for Calendar.");
      this.router.navigate(['calender/option']);
      this.checkCalendarEmail.next(false);
    });
  }
}
