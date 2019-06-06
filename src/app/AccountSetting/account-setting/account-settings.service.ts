import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {Router} from '@angular/router';
import {MessageServiceService} from '../../Auth/message-service.service';
@Injectable({
  providedIn: 'root'
})
export class AccountSettingsService {
  user_id: string;
  public  isSpinningStatus: boolean;
  public isProfileisSpinningStatus: boolean;
  confirmEmail = new Subject<boolean>();
  imagePriview = new Subject <any>();
  constructor(private messageService: MessageServiceService, private httpClient: HttpClient, private authService: AuthServiceLocal,private router:Router,private dialog: MatDialog) {
    this.user_id = this.authService.getUserId();
  }



  saveProfilePic(postData) {
    this.isSpinningStatus = true;
    this.httpClient.post<{message: string,data: []}>('/userData/updateProfile',postData).subscribe((responseData)=>{
      // console.log("updateLink profile====",responseData);
      this.getImagePath();
      this.messageService.generateSuccessMessage("profile updated ");
      this.isSpinningStatus = false;

    },error => {
      // console.log("error====",error);

      this.messageService.generateErrorMessage(error);
      this.isSpinningStatus = false;
    });
  }
  getImagePath() {
    this.httpClient.post<{message: string,data: []}>('/userData/userData',{'userId': this.authService.getUserId()}).subscribe(
      res =>{
        if(res.data['0'].profilePic) {
          this.imagePriview.next(res.data['0'].profilePic);
        }
      });
  }

  SaveProfileData(data) {
    this.isProfileisSpinningStatus = true;
    this.httpClient.post<{message: string,data: []}>('/userData/addUserData',data).subscribe((responseData)=>{
      // console.log("settingForm responseData====",responseData.data);
      this.router.navigate(["dashboard"]);
      this.messageService.generateSuccessMessage("Successfully submitted the setting form.");
      this.isProfileisSpinningStatus = false;

    },error => {
      // console.log("error====",error);
      this.messageService.generateErrorMessage("Data out of range.");
      this.isProfileisSpinningStatus = false;

    });
  }
  deletUserAccount(userId){
    if(confirm("Are you sure You want to delete ?")) {
      this.httpClient.post<{message: string,data: []}>('/userData/deleteProfile',{'id':userId}).subscribe((responseData)=>{
        // console.log("updateLink profile====",responseData);
        this.messageService.generateSuccessMessage("profile deleted");
        this.router.navigate(['']);
        /*this.authService.logout();*/

      },error => {
        // console.log("error====",error);
        this.messageService.generateErrorMessage(error);

      });
    }
  }
  saveMyLink(linkData){
    this.httpClient.post<{message: string,data: []}>('/userData/updateLink',linkData).subscribe((responseData)=>{
      // console.log("updateLink responseData====",responseData.data);
      this.messageService.generateSuccessMessage("Link updated");

    },error => {
      // console.log("error====",error);
      this.messageService.generateErrorMessage(error);

    });
  }


  updateAccountPassword(data) {
    this.httpClient.post<{message: string,data: []}>('/userData/updatePassword',data).subscribe((responseData)=>{
      // console.log("settingForm responseData====",responseData.data);
      if(responseData.data){
        this.messageService.generateSuccessMessage("Password updated successfully");

      } else {
        this.messageService.generateErrorMessage("You have entered incorrect password");

      }

    },error => {
      // console.log("error====",error);
      this.messageService.generateErrorMessage(error.error.message);

    });
  }
  sendAccountEmail(data) {
    // console.log(data.email);
    this.httpClient.post<{
      token: any;
      message: string,data: []}>('/userData/generateEmailToken',data).subscribe((responseData)=>{
      // console.log("settingForm responseData====",responseData);
      // console.log('Token--> ', responseData.token);
      if(responseData.data.length>0){
        this.httpClient.post<any>('/sendResetPasswordEmail/sendResetPasswordEmail',{
          message: "You are receiving this message because you have requested to reset your login email\n Here is the link to reset your email /changeEmail/da?email="+ data.email+"&data="+responseData.token+"",
          email: data.email
        }).subscribe((responseData)=>{
          this.confirmEmail.next(true);
          //this.token = responseData.token;
        },error => {
          this.messageService.generateErrorMessage("Could not send email!! Check your mail service ");

        });

      } else {
        this.messageService.generateErrorMessage("You have entered incorrect password");

      }
    },error => {

      // console.log("error====",error);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error.error.message;
      this.dialog.open(MessagedialogComponent, dialogConfig);
    });
  }
  checkTokenDataUpdateEmail(data:string,email:string){
    this.httpClient.post<any>('/password/checkTokenDataEmail',{token:data,email:email}).subscribe((responseData)=>{
      // console.log('Response data ',responseData);
      if(responseData.valid===true){
        this.messageService.generateSuccessMessage("Your email has changed successfully ! ");
        // console.log('Response data ',responseData);
      }else{
        this.router.navigate(['/forgetPassword']);
        this.messageService.generateErrorMessage("Sorry its an invalid token id please try again ! ");
      }
    },error => {
      this.router.navigate(['/forgetPassword']);
      this.messageService.generateErrorMessage("Some Error occurred !! Please check your connection ");
    });
  }


}

