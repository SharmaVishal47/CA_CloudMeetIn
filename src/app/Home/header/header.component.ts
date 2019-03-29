import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ShareYourLinkComponentComponent} from '../../share-your-link-component/share-your-link-component.component';
import {HeaderserviceService} from '../headerservice.service';
import {AccountSettingComponent} from '../../AccountSetting/account-setting/account-setting.component';
import {AccountSettingsService} from '../../AccountSetting/account-setting/account-settings.service';


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
  private authListnerSubscription: Subscription;
  loginText = 'Login';
  userImagePreview: any;
  constructor(private accountSettingService: AccountSettingsService, private headerService: HeaderserviceService,private authService: AuthServiceLocal,private router:Router,private dialog: MatDialog) { }

  ngOnInit() {
    /*this.accountSettingService.getImagePath();*/
    this.accountSettingService.imagePriview.subscribe((response) => {
      console.log("Re=============> ", response);
      this.userImagePreview = response;
      if(this.userImagePreview === null|| this.userImagePreview === undefined || this.userImagePreview === "null" ){
        this.userImagePreview = "../../../assets/logo.svg";
      }
    });
    this.headerService.userImageLink.subscribe((response) => {
      if(response) {
        this.userImagePreview = response;
        if(this.userImagePreview === null|| this.userImagePreview === undefined || this.userImagePreview === "null" ){
          this.userImagePreview = "../../../assets/logo.svg";
        }
      }
    });

    this.headerService.getTokenExpiry();
    this.authListnerSubscription = this.authService.authStatusListener.subscribe(isAuth =>{
      this.isAuthenticated = isAuth;
      this.emailId = this.authService.getUserEmaild();
      this.userId = this.authService.getUserId();
      this.userImagePreview = this.authService.getprofilePic();
      if(this.userImagePreview === null|| this.userImagePreview === undefined || this.userImagePreview === "null" ){
        this.userImagePreview = "../../../assets/logo.svg";
      }
    });
    this.userId = this.authService.getUserId();
    this.userImagePreview = this.authService.getprofilePic();
    if(this.userImagePreview === null|| this.userImagePreview === undefined || this.userImagePreview === "null" ){
      this.userImagePreview = "../../../assets/logo.svg";
    }
    /* this.authService.autoAuthenticateUser();*/
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.authService.isAuth.subscribe((response) => {
      console.log("isAuthenticated------------>", response);
      this.isAuthenticated = response;
      this.loginText = 'Login';
    });
    let authData = this.authService.getAuthData();
    console.log("AuthData====",authData);
    if(authData){
      const now =new Date();
      const expiresIn = Date.parse(authData.expirationDate) - now.getTime();
      console.log("expires=====",expiresIn);
      if(expiresIn > 0){
        this.loginText = 'Account';
      }else{
        this.loginText = 'Login';
      }
    }
    this.headerService.authStatusListener.subscribe(isExpire => {
      if(isExpire){
        this.loginText = 'Account';
      }else{
        this.loginText = 'Login';
      }
    })
  }

  ngOnDestroy() {
    this.authListnerSubscription.unsubscribe();
  }
  onLogout() {
    this.isAuthenticated = false;
    this.authService.logout();
  }

  openDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = "";
    this.dialog.open(ShareYourLinkComponentComponent, dialogConfig);
  }

  checkLogin() {
    this.authService.autoAuthenticateUser();
    /*routerLink="/login"*/
  }
}
