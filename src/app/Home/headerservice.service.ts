import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {AuthServiceLocal} from '../Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderserviceService {
  userImageLink = new Subject<any>();
  authStatusListener = new Subject<boolean>();
  constructor(private  authService: AuthServiceLocal) { }

  getTokenExpiry(){
    let authData = this.authService.getAuthData();
    console.log("AuthData====",authData);
    if(authData){
      const now =new Date();
      const expiresIn =  Date.parse(authData.expirationDate) - now.getTime();
      console.log("expires=====",expiresIn);
      if(expiresIn > 0){
        this.authStatusListener.next(true);
      }else{
        this.authStatusListener.next(false);
      }
    }
  }
  afterLogout(){
    this.authStatusListener.next(false);
  }
  getImageSrc (imagePath: any) {
    this.userImageLink.next(imagePath);
  }
}
