import { Injectable } from '@angular/core';

import {AuthServiceLocal} from '../Auth/auth.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient, private authService: AuthServiceLocal) { }
  updateMeetingEmail(data: any) {
    let user_id = this.authService.getUserId();
    let currentEmail = localStorage.getItem('email');
    console.log("user_id", user_id);
    console.log("Meeting new data", data);
    this.httpClient.post<any>('http://localhost:3000/user/updateEvent', {data: data, email: currentEmail, eventType : data.eventType, inviteeEmail : data.schedulerEmail,
    }).subscribe(
      res => {
        this.httpClient.post<any>('http://localhost:3000/events/updateSchedulerEmail', {
          inviteeEmail : data.schedulerEmail,
          user_id: user_id
        }).subscribe(
          res => {
            console.log("Successfully")
          });
      },
      err => {
        console.log("Error")
      });
  }
}
