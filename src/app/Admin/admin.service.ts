import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  adminToken: string;
  adminId: string;
  adminTokenTimer;
  private adminAuthStatusListener = new Subject<boolean>();


  public  adminName: string;
  private isAdminAuthenticated: boolean =  false;
  constructor(private httpClient: HttpClient,
              private router: Router,
              private message: NzMessageService) { }

  onSubmitAdminRecord(adminData: any) {
    this.httpClient.post<any>('/admin/admin-login',adminData).subscribe((responseData)=>{
      console.log("Verified User  -- > ", responseData);
      if(responseData.adminId.length > 0) {
        this.adminName = responseData.adminName;
        this.adminToken = responseData.token;
        console.log(this.adminToken);
        if(this.adminToken) {
          this.isAdminAuthenticated = true;
          this.adminId = responseData.adminId;
          const expireIn = responseData.expiresIn;
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expireIn * 1000);
          this.adminAuthStatusListener.next(true);
          this.saveAdminAuthData(this.adminToken, expirationDate, this.adminId, this.adminName);
          setTimeout(() => {
            this.onLogout();
          }, expireIn * 1000);
          this.router.navigate(['admin-dashboard']);
        }
      } else {
        this.message.create('error', `Invalid Login Credentials`);
      }
    });
  }
  getUserRecords() {
   return this.httpClient.get<any>('/admin/userRecords')
  }
  getIsAdminAuthenticated(){
    return  this.isAdminAuthenticated;
  }

  onLogout() {
    this.isAdminAuthenticated = false;
    this.adminToken = null;
    this.isAdminAuthenticated = false;
    this.adminId = null;
    this.adminAuthStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['admin-login']);
  }

  private saveAdminAuthData(token: string, expirationDate: Date, adminId: string, adminName: string) {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminExpirationDate', expirationDate.toISOString());
    localStorage.setItem('adminId', adminId);
    localStorage.setItem('adminName', adminName);

  }

  private clearAuthData() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminExpirationDate');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminName');
  }

  getToken() {
    return this.adminToken;
  }
  autoAuthListener() {
    const autoInfo = this.getAuthData();
    console.log("autoAuthListener", autoInfo);
    if (!autoInfo) {
      return;
    }
    const  now = new Date();
    const  expireIn = autoInfo.expirationDate.getTime() - now.getTime();
    if (expireIn > 0) {
      this.adminToken = autoInfo.token;
      this.isAdminAuthenticated = true;
      this.adminId = autoInfo.adminId;
      this.adminName = autoInfo.adminName;
      this.adminAuthStatusListener.next(true);
      this.setAuthTime(expireIn / 100);
      this.router.navigate(['admin-dashboard'])
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('adminToken');
    const expirationDate = localStorage.getItem('adminExpirationDate');
    const adminId = localStorage.getItem('adminId');
    const adminName = localStorage.getItem('adminName');
    if (!token || !expirationDate) {
      return;
    }
    return{
      token: token,
      expirationDate: new Date(expirationDate),
      adminId: adminId,
      adminName: adminName
    };

  }

  private setAuthTime(duration: number) {
    this.adminTokenTimer = setTimeout(() => {
      this.onLogout();
    }, duration * 1000);
  }
}
