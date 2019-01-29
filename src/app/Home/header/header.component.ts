import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ShareYourLinkComponentComponent} from '../../share-your-link-component/share-your-link-component.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit,OnDestroy  {
  emailId: string;
  userId: string;
  isAuthenticated = false;
  private authListnerSubscription: Subscription;
  private authStatusListener = new Subject<boolean>();
  constructor(private authService: AuthServiceLocal,private router:Router,private dialog: MatDialog) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.authListnerSubscription = this.authService.getAuthStatusListener().subscribe(isAuth =>{
      this.isAuthenticated = isAuth;
      this.emailId = this.authService.getUserEmaild();
      this.userId = this.authService.getUserId();
    });
  }

  ngOnDestroy() {
    this.authListnerSubscription.unsubscribe();
  }

  onLogout() {
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate([""]);
  }

  openDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = "";
    this.dialog.open(ShareYourLinkComponentComponent, dialogConfig);
  }
}
