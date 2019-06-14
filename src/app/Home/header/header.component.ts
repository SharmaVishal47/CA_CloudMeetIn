import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {HeaderserviceService} from '../headerservice.service';
import {AccountSettingsService} from '../../AccountSetting/account-setting/account-settings.service';
import {NzMessageService} from 'ng-zorro-antd';
import * as CryptoJS  from 'crypto-js';
import {environment} from '../../../environments/environment';

const API_URL = environment.apiUrl;
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
    this.accountSettingService.imagePriview.subscribe((response) => {
      this.userImagePreview = response;
      if(this.userImagePreview === null|| this.userImagePreview === undefined || this.userImagePreview === "null" || this.userImagePreview === "" ){

        this.userImagePreview = "../../../assets/group_people.png";
      }
    });


    this.headerService.getTokenExpiry();
    this.authListnerSubscription = this.authService.authStatusListener.subscribe(isAuth =>{
      this.isAuthenticated = isAuth;
      this.emailId = this.authService.getUserEmaild();
      let validEmailId =  typeof (this.emailId ) === 'string' && this.emailId.trim().length > 0 ? this.emailId : localStorage.getItem('email');
      this._link = encodeURIComponent(CryptoJS.AES.encrypt(validEmailId, 'sfdc31011992', ''));
      this.userId = this.authService.getUserId();
      this.url = API_URL+ '/'+this.userId;

      this.userImagePreview = this.authService.getprofilePic();
      if(this.userImagePreview === null|| this.userImagePreview === undefined || this.userImagePreview === "null" || this.userImagePreview === ""){

        this.userImagePreview = "../../../assets/group_people.png";
      }
    });

    this.userId = this.authService.getUserId();
    this.url = API_URL+ '/' +this.userId;
    this.emailId = this.authService.getUserEmaild();
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
    this.router.navigate(["/login"]);
  }
}
