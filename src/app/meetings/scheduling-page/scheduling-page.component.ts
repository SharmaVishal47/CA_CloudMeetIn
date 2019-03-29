import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {MeetingService} from '../meeting.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-scheduling-page',
  templateUrl: './scheduling-page.component.html',
  styleUrls: ['./scheduling-page.component.css']
})
export class SchedulingPageComponent implements OnInit {
  header: boolean = false;
  email: string;
  Meeting_owner = 'Sumit Kumar [#]';
  meeting_time15 = '15 Minute Meeting';
  meeting_time30 = '30 Minute Meeting';
  meeting_time60 = '60 Minute Meeting';
  headingTitle = `Welcome to my scheduling page.
Please follow the instructions to add an event to my calendar`;
  findId =  false;
  userId : string;
  currentDate;
  _meetingAuthUserDetails: MeetingAuthUser[];
  authMeetingSubscription: Subscription;
  constructor(private router:Router,private httpClient: HttpClient,private route: ActivatedRoute,private fb: FormBuilder, private meetingService: MeetingService) { }

  ngOnInit() {
    this.currentDate = new Date();
    this.route.params.subscribe((params: Params) => {
      this.userId = params['userId'];
      console.log("this.userId====",this.userId);
      let data = {userId: this.userId};
      /*this.httpClient.post<{message: string,data: []}>('http://localhost:3000/user/checkuser',data).subscribe((responseData)=>{
        console.log("responseData====",responseData.data);
        if(responseData.data.length>0){
          this.findId = true;
          this.Meeting_owner = responseData.data["0"].fullName;
          this.email = responseData.data["0"].email;
        }else{
          this.findId = false;
          this.email = null;
        }
      },error => {
        console.log("error====",error);
      });*/
        this.meetingService.authUserRecord(data);
        this.meetingService._meetingAuthUserRecord.subscribe((_meetingAuthUserDetails: MeetingAuthUser[]) => {
          this._meetingAuthUserDetails = _meetingAuthUserDetails;
          if(this._meetingAuthUserDetails.length > 0) {
          this.findId = true;
          this.Meeting_owner = this._meetingAuthUserDetails[0].fullName;
          this.email = this._meetingAuthUserDetails[0].email;
          this.meetingService.removeHeader(true);
           } else {
          this.findId = false;
          this.email = null;
           }
        });
    });
  }

  setEvent(event: string) {
    this.meetingService.saveEvent(event, this.email, this.userId, this.Meeting_owner);
  }
}
