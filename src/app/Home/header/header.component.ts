import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {HeaderserviceService} from '../headerservice.service';
import {AccountSettingsService} from '../../AccountSetting/account-setting/account-settings.service';
import {NzMessageService} from 'ng-zorro-antd';
import * as CryptoJS  from 'crypto-js';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit,OnDestroy {
  emailId: string;
  userId: string;
  profilePic: string;
  isAuthenticated = false;
  url;
  private authListnerSubscription: Subscription;
  loginText = 'Login';
  userImagePreview: any;
  _link: any;
  constructor(private accountSettingService: AccountSettingsService, private headerService: HeaderserviceService,private authService: AuthServiceLocal,private router:Router,private dialog: MatDialog, private message: NzMessageService ) { }

  ngOnInit() {
    /*this.accountSettingService.getImagePath();*/
    this.accountSettingService.imagePriview.subscribe((response) => {
      // console.log("Re=============> ", response);
      this.userImagePreview = response;
      // console.log("this.userImagePreview----",this.userImagePreview);
      if(this.userImagePreview === null|| this.userImagePreview === undefined || this.userImagePreview === "null" || this.userImagePreview === "" ){

        this.userImagePreview = "../../../assets/group_people.png";
      }
    });
   /* this.headerService.userImageLink.subscribe((response) => {
      if(response) {
        this.userImagePreview = response;
        if(this.userImagePreview === null|| this.userImagePreview === undefined || this.userImagePreview === "null" ){
          this.userImagePreview = "../../../assets/logo.svg";
        }
      }
    });*/

    this.headerService.getTokenExpiry();
    this.authListnerSubscription = this.authService.authStatusListener.subscribe(isAuth =>{
      this.isAuthenticated = isAuth;
      this.emailId = this.authService.getUserEmaild();
      /*this._link = this.emailId;*/
      // console.log("Type Of : ", typeof (this.emailId ) === 'string' && this.emailId.trim().length > 0 ? this.emailId : localStorage.getItem('email'));
      // console.log("Type Of : ",  localStorage.getItem('email'));
      let validEmailId =  typeof (this.emailId ) === 'string' && this.emailId.trim().length > 0 ? this.emailId : localStorage.getItem('email');
      console.log("Response EMail: ", validEmailId);
      this._link = encodeURIComponent(CryptoJS.AES.encrypt(validEmailId, 'sfdc31011992', ''));
      this.userId = this.authService.getUserId();
      this.url = 'https://cloudmeetin.com/'+this.userId;

      this.userImagePreview = this.authService.getprofilePic();
      // console.log("this.userImagePreview----",this.userImagePreview);
      if(this.userImagePreview === null|| this.userImagePreview === undefined || this.userImagePreview === "null" || this.userImagePreview === ""){

        this.userImagePreview = "../../../assets/group_people.png";
      }
    });

    this.userId = this.authService.getUserId();
    this.url = 'https://cloudmeetin.com/'+this.userId;
    this.emailId = this.authService.getUserEmaild();
    /*this._link = this.emailId;*/
    // console.log("Type Of : ", typeof (this.emailId ) === 'string' && this.emailId.trim().length > 0 ? this.emailId : localStorage.getItem('email'));
    let validEmailId =  typeof (this.emailId ) === 'string' && this.emailId.trim().length > 0 ? this.emailId : localStorage.getItem('email');
    console.log("Response EMail: ", validEmailId);
    this._link = encodeURIComponent(CryptoJS.AES.encrypt(validEmailId, 'sfdc31011992', ''));
    this.userImagePreview = this.authService.getprofilePic();
    // console.log("this.userImagePreview----",this.userImagePreview);
    if(this.userImagePreview === null|| this.userImagePreview === undefined || this.userImagePreview === "null" || this.userImagePreview === ""){

      this.userImagePreview = "../../../assets/group_people.png";
    }
    /* this.authService.autoAuthenticateUser();*/
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.authService.isAuth.subscribe((response) => {
      // console.log("isAuthenticated------------>", response);
      this.isAuthenticated = response;
      this.loginText = 'Login';
    });
  }

  ngOnDestroy() {
    this.authListnerSubscription.unsubscribe();
  }
  onLogout() {
    this.isAuthenticated = false;
    this.authService.logoutByHeader();
  }

  openDialog(){
    /*const dialogConfig = new MatDialogConfig();
    dialogConfig.data = "";
    this.dialog.open(ShareYourLinkComponentComponent, dialogConfig);*/
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.message.create('success', `The URL successfully copied.`);
  }

  checkLogin() {
    //this.authService.autoAuthenticateUser();
    /*routerLink="/login"*/
    this.router.navigate(["/login"]);
  }
}
