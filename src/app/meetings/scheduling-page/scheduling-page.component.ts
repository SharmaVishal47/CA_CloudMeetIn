import {Component, OnInit, PipeTransform} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {MeetingService} from '../meeting.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';


@Component({
  selector: 'app-scheduling-page',
  templateUrl: './scheduling-page.component.html',
  styleUrls: ['./scheduling-page.component.css']
})
export class SchedulingPageComponent implements OnInit, PipeTransform {
  isSpinning: boolean = true;

  header: boolean = false;
  email: string;
  Meeting_owner = 'Sumit Kumar [#]';
  meeting_time15 = '15 Minute Meeting';
  meeting_time30 = '30 Minute Meeting';
  meeting_time60 = '60 Minute Meeting';
  headingTitle = `Welcome to my scheduling page.
  Please follow the instructions to add an event to my calendar`;
  description: SafeHtml;
  userImagePreview;
  findId =  false;
  userId : string;
  currentDate;
  _meetingAuthUserDetails: MeetingAuthUser[];
  checkPoint: boolean =  false;
  weblink: any;
  constructor(
    private router:Router,private httpClient: HttpClient,
              private route: ActivatedRoute,private fb: FormBuilder,
              private meetingService: MeetingService,
              private sanitizer: DomSanitizer
  ) {
    this.description = this.transform();
  }

  ngOnInit() {
    console.log("Routing");
    this.meetingService.removeHeader(true);

    this.currentDate = new Date();
    this.route.params.subscribe((params: Params) => {
      this.userId = params['userId'];
      console.log("this.userId====",this.userId);
      let data = {userId: this.userId};
        this.meetingService.authUserRecord(data);
        this.meetingService._meetingAuthUserRecord.subscribe((_meetingAuthUserDetails: MeetingAuthUser[]) => {
          this._meetingAuthUserDetails = _meetingAuthUserDetails;
          if(this._meetingAuthUserDetails.length > 0) {

            localStorage.removeItem('fullName');
            localStorage.removeItem('email');
            localStorage.removeItem('eventType');
            localStorage.removeItem('selectedEndTime');
            localStorage.removeItem('selectedStartTime');
            localStorage.removeItem('selectedDate');
            localStorage.removeItem('selectedTimeZone');
            localStorage.removeItem('userIdMeeting');
            localStorage.removeItem('userTimeZone');
            localStorage.removeItem('description');
            localStorage.removeItem('imagePreview');
            localStorage.removeItem('userStartTime');
            localStorage.removeItem('userEndTime');
            localStorage.removeItem('reschduleMeetingId');
            localStorage.removeItem('eventId');
            localStorage.removeItem('rescheduleRecord');
            localStorage.removeItem('weblink');


            this.userImagePreview = this._meetingAuthUserDetails[0].profilePic;
            this.weblink = this._meetingAuthUserDetails[0].imageLink;
            if(this.userImagePreview === null|| this.userImagePreview === undefined || this.userImagePreview === "null" || this.userImagePreview === "" ){
              this.userImagePreview = "../../../assets/group_people.png";
            }
            if(this.weblink === null|| this.weblink === undefined || this.weblink === "null" || this.weblink === "" ){
              this.weblink = "";
            }

            /*this.description = this._meetingAuthUserDetails[0].welcomeMessage;*/
            this.description = this.sanitizer.bypassSecurityTrustHtml(this._meetingAuthUserDetails[0].welcomeMessage);

          this.findId = true;
          this.Meeting_owner = this._meetingAuthUserDetails[0].fullName;
          this.email = this._meetingAuthUserDetails[0].email;
            this.isSpinning = false;
            this.checkPoint = true;
           } else {
            this.isSpinning = false;
            this.findId = false;
            this.email = null;
            this.checkPoint = true;
           }
        });
    });
  }
  setEvent(event: string) {

    // @ts-ignore
    localStorage.setItem("description",this.description);
    localStorage.setItem("imagePreview",this.userImagePreview);
    localStorage.setItem("weblink",this.weblink);
    this.meetingService.saveEvent(event, this.email, this.userId, this.Meeting_owner);
  }

  transform() {

    return this.description = this.sanitizer.bypassSecurityTrustHtml(<string>this.description);

    /*return this.sanitizer.bypassSecurityTrustResourceUrl(url);*/

  }
}
