import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class IntegrationService {
  constructor(private httpClient : HttpClient) {
  }

  /* This function use for get the meeting platform from the database api*/
  getMeetingPlatforms(userId: string) {
    return this.httpClient.post<any>('https://dev.cloudmeetin.com/integration/getMeetingPlatform',
      {userId: userId});
  }
  /* This function use for insert  the meeting platform in the database api*/
  AddMeetingPlatforms(userId: string, meetingPlatform: string) {
    return this.httpClient.post<any>('https://dev.cloudmeetin.com/integration/addSelectedMeetingPaltform',
      {userId: userId, selectedPlatform: meetingPlatform});
  }
}
