import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../messagedialog/messagedialog.component';
import {DatePipe, formatDate} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  _meetingAuthUser: MeetingAuthUser[];
  _meetingAuthUserRecord = new Subject<MeetingAuthUser[]>();
  getTimePeriod = new Subject<any>();
  userLocalStorageData = new Subject<any>();
  meetingAvailableDay = new Subject<any>();
  authStatusListener = new Subject<boolean>();
  meetingPlatform = new Subject<any>();
  expectedDay: string;
  expectedDate;
  timeArray = [];
  listTimeArray = [];
  timeZone: string;
  expectedTime;
  goToMeetingStartDateTime;
  goToMeetingEndDateTime;
  _dateFormatEnd;

  gtm_access_token: string;
  gtm_expires_in: string;
  gtm_organizer_key: string;
  gtm_refresh_token: string;
  meetIngData;
  data;
  isAuthicated: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    public datepipe: DatePipe,
    private dialog: MatDialog
    ) {
  }

// This method used to get authicated user Details for meeting schudule
  authUserRecord(data: { userId: string }) {
    this.httpClient.post<{ message: string, data: MeetingAuthUser[] }>
    ('http://localhost:3000/user/checkuser', data).subscribe((responseData) => {
      this._meetingAuthUser = responseData.data;
      this._meetingAuthUserRecord.next([...this._meetingAuthUser]);
    });
  }

  removeHeader(check: boolean) {
    console.log("Check ===>>", check);
    this.isAuthicated =  check;
    this.authStatusListener.next(this.isAuthicated);
  }

// This method used to store the event records in local storage
  saveEvent(event: string, email: string, userId: string, Meeting_owner: string) {
    localStorage.setItem('eventType', event);
    localStorage.setItem('email', email);
    localStorage.setItem('userId', userId);
    localStorage.setItem('fullName', Meeting_owner);
    this.router.navigate([userId + '/' + event]);
  }

  // This method used to get the records from local storage
   getDataFromLocalStorage() {
    let data = {
      'eventType': localStorage.getItem('eventType'),
      'email': localStorage.getItem('email'),
      'userId': localStorage.getItem('userId'),
      'fullName': localStorage.getItem('fullName')
    };
    // this.userLocalStorageData.next(data);
    return data;
  }

  //  This method used to get the available meeting day from database
  getMeetingAvailableDay(userId: string) {
    this.httpClient.post<any>('http://localhost:3000/user/getAvailableDays', {userId: userId}).subscribe(res => {
      this.meetingAvailableDay.next(res);
    });
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  deleteListTimeArray() {
    console.log("finally call");
    this.listTimeArray = [];
    this.timeArray = [];
  }
  getDay(expectedDate: number) {
    switch (expectedDate) {
      case 0 :
        this.expectedDay = 'Sunday';
        break;
      case 1 :
        this.expectedDay = 'Monday';
        break;
      case 2 :
        this.expectedDay = 'Tuesday';
        break;
      case 3 :
        this.expectedDay = 'Wednesday';
        break;
      case 4 :
        this.expectedDay = 'Thursday';
        break;
      case 5 :
        this.expectedDay = 'Friday';
        break;
      case 6 :
        this.expectedDay = 'Saturday';
        break;
      default :
        this.router.navigate(['/']);
    }
    return this.expectedDay;
  }

  getSelectedDateAndTimeZone() {
    let data;
    let _selectedDate = typeof (localStorage.getItem('selectedDate')) === 'string' && localStorage.getItem('selectedDate')
      .split('').length > 0 ? localStorage.getItem('selectedDate') : false;
    let _timeZone = typeof (localStorage.getItem('timeZone')) === 'string' && localStorage.getItem('timeZone')
      .split('').length > 0 ? localStorage.getItem('timeZone') : false;
    let userEmail = typeof (localStorage.getItem('email')) === 'string' && localStorage.getItem('email')
      .split('').length > 0 ? localStorage.getItem('email') : false;
    if (_selectedDate && _timeZone && userEmail) {
      data = {
        'timezone': _timeZone,
        'selectedDate': _selectedDate,
        'userEmail': userEmail
      };
    } else {
      this.router.navigate(['/']);
    }
    return data;
  }

  userSelectTimePeriod(userEmail: string | boolean, expectedDate: any, timeZone:string ) {
    this.expectedDate = expectedDate;
    this.timeZone = timeZone;
    this.httpClient.post<any>('http://localhost:3000/user/gettime', {email: userEmail})
      .subscribe((responseData) => {
      // this.getTimePeriod.next(responseData);
      this.httpClient.post<any>('http://localhost:3000/filter/meetingTime', {
        userId: this.getUserId(),
        meetingDate: this.expectedDate
      }).
      subscribe((responseDataByUserID) => {
        console.log('responseDataByUserId --  >  > > ', responseDataByUserID.data);
        if (responseDataByUserID.data.length > 0) {
          let userId = responseDataByUserID.data[0].userId;
          let meetingDate = responseDataByUserID.data[0].meetingDate;
          let meetingTimeList = responseDataByUserID.data[0].meetingTimeList;
          console.log('userId', userId + 'meetinDate ', meetingDate + 'meetingTimeList', meetingTimeList);
          let startTime = responseData.data[0].startTime.split(':');
          let endTime = responseData.data[0].endTime.split(':');
          let userEventType = typeof localStorage.getItem('eventType') === 'string' && localStorage.getItem('eventType').split('').length > 0
          && (localStorage.getItem('eventType') === '15min' || localStorage.getItem('eventType') === '30min') ? localStorage.getItem('eventType') : 0;
          // if date will be match in database
          if (userEventType) {
            for (let i = +startTime[0]; i <= endTime[0]; i++) {
              if (i == 0) {
                this.timeArray.push(12 + ':00 AM');
                this.timeArray.push(12 + ':30 AM');
              } else if (i < 12) {
                this.timeArray.push(i + ':00 AM');
                this.timeArray.push(i + ':30 AM');
              } else if (i == 12) {
                this.timeArray.push(i + ':00 PM');
                this.timeArray.push(i + ':30 PM');
              } else if (i > 12) {
                let j = i - 12;
                this.timeArray.push(j + ':00 PM');
                this.timeArray.push(j + ':30 PM');
              }
            }
            this.timeArray.pop();

          } else {
            for (let i = +startTime[0]; i <= endTime[0]; i++) {
              if (i == 0) {
                this.timeArray.push(12 + ':00 am');
              } else if (i < 12) {
                this.timeArray.push(i + ':00 am');
              } else if (i == 12) {
                this.timeArray.push(i + ':00 pm');
              } else if (i > 12) {
                let j = i - 12;
                this.timeArray.push(j + ':00 pm');
              }
            }
          }

          for (let item of this.timeArray) {
            let time = this.datepipe.transform(this.expectedDate, 'yyyy-MM-dd') + ' ' + item;
            let convertedTime = new Date(new Date(time)).toLocaleString('en-US', {timeZone: this.timeZone});
            let hours = new Date(convertedTime).toLocaleTimeString().split(':');
            console.log('hours====', hours[0].length, typeof hours[0]);
            let returnValue = typeof hours[0] === 'string' && hours[0].length == 1 ? '0' + new Date(convertedTime).toLocaleTimeString() : new Date(convertedTime).toLocaleTimeString();
            console.log('MeetingDate ---->>', meetingDate);
            if (meetingDate === this.expectedDate) {
              this.listTimeArray.push(returnValue);
              let splitMeetingList = meetingTimeList.split(',');
              console.log(splitMeetingList);
              for (let i = 0; i < splitMeetingList.length; i++) {
                if (this.listTimeArray.indexOf(splitMeetingList[i]) > -1) {
                  this.listTimeArray.splice(this.listTimeArray.indexOf(meetingTimeList), splitMeetingList.length);
                  localStorage.setItem('UpdateQuery', String(true));
                  localStorage.setItem('meetingTimeList', meetingTimeList);
                }
              }
            } else {
              this.listTimeArray.push(returnValue);
            }

          }
        } else {
          console.log('Else Part ------------>>>');
          let startTime = responseData.data[0].startTime.split(':');
          let endTime = responseData.data[0].endTime.split(':');
          let userEventType = typeof localStorage.getItem('eventType') === 'string' && localStorage.getItem('eventType').split('').length > 0
          && (localStorage.getItem('eventType') === '15min' || localStorage.getItem('eventType') === '30min') ? localStorage.getItem('eventType') : 0;
          // if date will be match in database
          if (userEventType) {
            for (let i = +startTime[0]; i <= endTime[0]; i++) {
              if (i == 0) {
                this.timeArray.push(12 + ':00 AM');
                this.timeArray.push(12 + ':30 AM');
              } else if (i < 12) {
                this.timeArray.push(i + ':00 AM');
                this.timeArray.push(i + ':30 AM');
              } else if (i == 12) {
                this.timeArray.push(i + ':00 PM');
                this.timeArray.push(i + ':30 PM');
              } else if (i > 12) {
                let j = i - 12;
                this.timeArray.push(j + ':00 PM');
                this.timeArray.push(j + ':30 PM');
              }
            }
            this.timeArray.pop();
          } else {
            for (let i = +startTime[0]; i <= endTime[0]; i++) {
              if (i == 0) {
                this.timeArray.push(12 + ':00 am');
              } else if (i < 12) {
                this.timeArray.push(i + ':00 am');
              } else if (i == 12) {
                this.timeArray.push(i + ':00 pm');
              } else if (i > 12) {
                let j = i - 12;
                this.timeArray.push(j + ':00 pm');
              }
            }
          }

          for (let item of this.timeArray) {
            let time = this.datepipe.transform(this.expectedDate, 'yyyy-MM-dd') + ' ' + item;
            let convertedTime = new Date(new Date(time)).toLocaleString('en-US', {timeZone: this.timeZone});
            let hours = new Date(convertedTime).toLocaleTimeString().split(':');
            console.log('hours====', hours[0].length, typeof hours[0]);
            let returnValue = typeof hours[0] === 'string' && hours[0].length == 1 ? '0' + new Date(convertedTime).toLocaleTimeString() : new Date(convertedTime).toLocaleTimeString();
            this.listTimeArray.push(returnValue);
          }
        }
        console.log("This List time Array", this.listTimeArray);
        this.getTimePeriod.next(this.listTimeArray);
      }, error => {
        console.log('error====', error);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = error;
        this.dialog.open(MessagedialogComponent, dialogConfig);
      });

    },error => {
        console.log('error====', error);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = error;
        this.dialog.open(MessagedialogComponent, dialogConfig);
      });
  }

  checkMeetingPlatform() {
    this.httpClient.post<any>('http://localhost:3000/user/checkMeetingPlatform',{userId: localStorage.getItem("userId")}).subscribe(
      res =>{
        this.meetingPlatform.next(res);
      },error => {
        console.log("error====",error);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = error;
        this.dialog.open(MessagedialogComponent, dialogConfig);
      });
  }

  meetingStartTime() {
    let _selectedDate =  localStorage.getItem('selectedDate');
    // @ts-ignore
    let _selectTime = localStorage.getItem('selectedTime');
    if(_selectTime.indexOf('a') > -1) {
      this.expectedTime = localStorage.getItem('selectedTime').split(' ');
    } else  {
      this.expectedTime = localStorage.getItem('selectedTime').split(' ');
    }
    let date = new Date(_selectedDate);
    let _dateFormat = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return this.goToMeetingStartDateTime = _dateFormat + 'T' + this.expectedTime[0] + 'Z';
  }

  meetingEndTime(_goToMeetingStartDateTime: Date) {
    let meetingRecords = this.getDataFromLocalStorage();
    let timePeriod = meetingRecords.eventType.split('m');
    let d = new Date(_goToMeetingStartDateTime);
    // @ts-ignore
    d.setMinutes(timePeriod[0] - 300);
    this.goToMeetingEndDateTime = d;
    /*this._dateFormatEND = formatDate(this.goToMeetingEndDateTime, 'yyyy-MM-dd HH:mm:ss Z:', 'en-US');*/
    this._dateFormatEnd  = formatDate(this.goToMeetingEndDateTime, 'yyyy-MM-ddThh:mm:ss', 'en-US');
    return this._dateFormatEnd +'Z';
  }

  getGoToMeeting(meetIngData: any, data: any) {
    this.meetIngData = meetIngData;
    this.data = data;
    this.httpClient.post<any>('http://localhost:3000/integration/getgotomeeting', {userId: localStorage.getItem('userId')}).subscribe(
      res => {
        console.log('gtm detail=======', res);
        if (res.data.length > 0) {
          this.httpClient.get<any>('https://api.getgo.com/oauth/access_token?grant_type=password&user_id=' + res.data[0].emailId + '&password=' + res.data[0].password + '&client_id=' + res.data[0].clientId).subscribe(
            res => {
              this.gtm_access_token = res.access_token;
              console.log('this.access_token===', this.gtm_access_token);
              this.gtm_expires_in = res.expires_in;
              this.gtm_organizer_key = res.organizer_key;
              this.gtm_refresh_token = res.refresh_token;

              let httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.gtm_access_token
              });

              let options = {
                headers: httpHeaders
              };


              this.httpClient.post<any>('https://api.getgo.com/G2M/rest/meetings', this.meetIngData, options).subscribe(
                res => {
                  console.log('MeetingResponse=========', res);

                  this.data['g2mMeetingId'] = res[0].meetingid;
                  this.data['g2mMeetingUrl'] = res[0].joinURL;
                  this.data['g2mMeetingCallNo'] = res[0].conferenceCallInfo;

                  this.meetIngData['g2mMeetingId'] = res[0].meetingid;
                  this.meetIngData['g2mMeetingUrl'] = res[0].joinURL;
                  this.meetIngData['g2mMeetingCallNo'] = res[0].conferenceCallInfo;
                  this.addMeetingToDatabaseWithGTM(this.meetIngData);
                },
                err => {
                  console.log('Meeting Error=========', err.message);
                });
            },
            err => {
              console.log('AccessToken Error=========', err.message);
            });
        }
      });
  }
  addMeetingToDatabase(meetIngData: any, data: any) {
    this.meetIngData = meetIngData;
    this.data = data;
    this.httpClient.post<any>('http://localhost:3000/meeting/addMeeting', this.data).subscribe((responseData) => {
      console.log('addMeeting====', responseData);
      let currentEmail = localStorage.getItem('email');
      this.httpClient.post<any>('http://localhost:3000/user/insertevent', {
        meetIngData: this.meetIngData,
        email: currentEmail
      }).subscribe((responseData) => {
        console.log('Google Calendar integration======', responseData);
        this.httpClient.post<any>('http://localhost:3000/sendEmail/sendemail', {
          meetingData: this.meetIngData,
          clientEmail: this.data.schedulerEmail,
          email: currentEmail
        }).subscribe((responseData) => {
          console.log('Notification sent on gmail ======', responseData);
          if (localStorage.getItem('UpdateQuery') === 'true') {
            // if user select same date then run the update api
            console.log('Update =====================================================');
            let oldMeetingList = localStorage.getItem('meetingTimeList').toString();
            let updateMeetingList = oldMeetingList.concat(',' + this.data.time);
            // console.log('',updateMeetingList);
            this.httpClient.post<any>('http://localhost:3000/filter/updateMeetingRecords', {
              userId: this.data.userId,
              meetingDate: this.data.date,
              meetingTimeList: updateMeetingList
            }).subscribe((responseDataUserUpdate) => {
              console.log('Meeting Data updated successfully  ========================>>>>>>', responseDataUserUpdate);
              this.router.navigate(['confirmedMeeting']);
              localStorage.removeItem('UpdateQuery');
              localStorage.removeItem('meetingTimeList');
            }, error => {
              console.log('error CAL ====', error);
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = error;
              this.dialog.open(MessagedialogComponent, dialogConfig);
            });

          } else {
            // if user select date as a first time
            console.log('Insert =====================================================');
            this.httpClient.post<any>('http://localhost:3000/filter/insertMeetingRecords', {
              userId: this.data.userId,
              meetingDate: this.data.date,
              meetingTimeList: this.data.time
            }).subscribe((responseDataUser) => {
              console.log('Meeting Data saved successfully  ========================>>>>>>', responseDataUser);
              this.router.navigate(['confirmedMeeting']);
            }, error => {
              console.log('error CAL ====', error);
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = error;
              this.dialog.open(MessagedialogComponent, dialogConfig);
            });
          }

        }, error => {
          console.log('error CAL ====', error);
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = error;
          this.dialog.open(MessagedialogComponent, dialogConfig);
        });
      }, error => {
        console.log('error CAL ====', error);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = error;
        this.dialog.open(MessagedialogComponent, dialogConfig);
      });
    }, error => {
      console.log('error====', error);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);
    });
  }

  addMeetingToDatabaseWithGTM(meetIngData) {
    this.httpClient.post<any>('http://localhost:3000/meeting/addMeetingWithGtm', this.data).subscribe((responseData) => {
      console.log('addMeeting====', responseData);
      let currentEmail = localStorage.getItem('email');
      this.httpClient.post<any>('http://localhost:3000/user/insertevent', {
        meetIngData: meetIngData,
        email: currentEmail
      }).subscribe((responseData) => {
        console.log('Google Calendar integration ======', responseData);
        this.httpClient.post<any>('http://localhost:3000/sendEmail/sendemail', {
          meetingData: meetIngData,
          clientEmail: this.data.schedulerEmail,
          email: currentEmail
        }).subscribe((responseData) => {
          console.log('Notification sent on gmail with GTM ======', responseData);
          if (localStorage.getItem('UpdateQuery') === 'true') {
            // if user select same date then run the update api
            console.log('Update =====================================================');
            let oldMeetingList = localStorage.getItem('meetingTimeList').toString();
            let updateMeetingList = oldMeetingList.concat(',' + this.data.time);
            // console.log('',updateMeetingList);
            this.httpClient.post<any>('http://localhost:3000/filter/updateMeetingRecords', {
              userId: this.data.userId,
              meetingDate: this.data.date,
              meetingTimeList: updateMeetingList
            }).subscribe((responseDataUserUpdate) => {
              console.log('Meeting Data updated successfully  ========================>>>>>>', responseDataUserUpdate);
              this.router.navigate(['confirmedMeeting']);
              localStorage.removeItem('UpdateQuery');
              localStorage.removeItem('meetingTimeList');
            }, error => {
              console.log('error CAL ====', error);
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = error;
              this.dialog.open(MessagedialogComponent, dialogConfig);
            });

          } else {
            // if user select date as a first time
            console.log('Insert =====================================================');
            this.httpClient.post<any>('http://localhost:3000/filter/insertMeetingRecords', {
              userId: this.data.userId,
              meetingDate: this.data.date,
              meetingTimeList: this.data.time
            }).subscribe((responseDataUser) => {
              console.log('Meeting Data saved successfully  ========================>>>>>>', responseDataUser);
              this.router.navigate(['confirmedMeeting']);
            }, error => {
              console.log('error CAL ====', error);
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = error;
              this.dialog.open(MessagedialogComponent, dialogConfig);
            });
          }
        }, error => {
          console.log('error CAL ====', error);
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = error;
          this.dialog.open(MessagedialogComponent, dialogConfig);
        });
      }, error => {
        console.log('error CAL ====', error);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = error;
        this.dialog.open(MessagedialogComponent, dialogConfig);
      });
    }, error => {
      console.log('error====', error);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);
    });
  }

}
