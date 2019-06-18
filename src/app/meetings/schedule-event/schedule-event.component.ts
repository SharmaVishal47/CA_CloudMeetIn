import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {MeetingService} from '../meeting.service';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {MessageServiceService} from '../../Auth/message-service.service';
import {ValidInputDirective} from '../../Directive/valid-input.directive';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-schedule-event',
  templateUrl: './schedule-event.component.html',
  styleUrls: ['./schedule-event.component.css']
})
export class ScheduleEventComponent implements OnInit {
  weblink;
  isLoadingOne = false;
  name;
  email;
  phone;
  userName = '';
  meetingUserInfoForm: FormGroup;
  meetingTime = '';
  meetingDateTime = '';
  selectedStartTime ;
  userImagePreview;
  selectedEndTime;
  goToMeetingStartDateTime;
  selectedTimeZone = '';
  userTimeZone = '';
  _dateFormatEnd;
  meetingOptionList = [];
  meetingSelectedOption: string;
  checkMeetingOption = "";
  data;
  meetIngData;
  rescheduleRecords;
  btnValue: string = 'Schedule Event';
  rescheduleDetails;
  userStartTime;
  userEndTime;
  rescheduleBack;
  meetingPlatform: string;


  constructor( private messageService:MessageServiceService,
               private message: NzMessageService,
               private authServiceLocal: AuthServiceLocal,private fb: FormBuilder, private meetingService: MeetingService, private router: Router, private httpClient: HttpClient, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.meetingUserInfoForm = this.fb.group({
      fullName: [null, [Validators.required, ValidInputDirective.input]],
      email: [null, [Validators.email,Validators.required]],
      phone: [null],
      description:[null],
      reasonOfRescheduling:[null],
    });
    this.meetingService.messageOff.subscribe(res=>{
      this.isLoadingOne = res;
    });
    if(this.authServiceLocal.getIsAuthenticated()){
      this.meetingService.removeHeader(false);
    }else{
      this.meetingService.removeHeader(true);
    }

    this.meetingService.getSelectedMeetingPlatform(localStorage.getItem("userIdMeeting")).subscribe((response) => {
      console.log("Response of the getSelectedMeetingPlatform", response);
      if(response.data.length > 0) {
        this.meetingPlatform = response.data[0].selectedMeetingPlatform;
      }
    });

    this.rescheduleBack = '/reschedule/'+localStorage.getItem('reschduleMeetingId');
    this.userImagePreview = localStorage.getItem("imagePreview");
    this.weblink = localStorage.getItem('weblink');
    this.rescheduleRecords = this.meetingService.getRescheduleRecords();
    if(this.rescheduleRecords) {
      this.btnValue = 'Reschedule Event'
    }
   /* //this.meetingService.removeHeader(true);
    this.meetingService.checkMeetingPlatform();
    this.meetingService.meetingPlatform.subscribe(res => {
      if (res.data.length > 0) {
        if (res.data[0].go2meeting != null && res.data[0].go2meeting != "false") {
          this.checkMeetingOption = true;
          this.meetingOptionList.push('GoToMeeting');
          this.meetingSelectedOption = 'GoToMeeting';
        }
        if (res.data[0].salesforce) {
          this.checkMeetingOption = true;
          this.meetingOptionList.push('Salesforce');
          this.meetingSelectedOption = 'Salesforce';
        }
        if (res.data[0].zoom) {
          this.checkMeetingOption = true;
          this.meetingOptionList.push('Zoom');
          this.meetingSelectedOption = 'Zoom';
        }
      }
    }, error => {
      // console.log('error====', error);
      this.messageService.generateErrorMessage(error)
    });*/
    //this.meetingService.removeHeader(true);
    this.meetingService.checkMeetingPlatform();
    this.meetingService.meetingPlatform.subscribe(res => {
      if (res.data.length > 0) {
        if (res.data[0].go2meeting != null && res.data[0].go2meeting != "false") {
          this.checkMeetingOption = "gtm";
          /*this.meetingOptionList.push('GoToMeeting');
          this.meetingSelectedOption = 'GoToMeeting';*/
        }
        if (res.data[0].zoom != null && res.data[0].zoom != "false") {
          this.checkMeetingOption = "zoom";
          /*this.meetingOptionList.push('Salesforce');
          this.meetingSelectedOption = 'Salesforce';*/
        }
        if (res.data[0].salesforce != null && res.data[0].salesforce != "false") {
          this.checkMeetingOption = "salesforce";
          /*this.meetingOptionList.push('Zoom');
          this.meetingSelectedOption = 'Zoom';*/
        }
      }
    }, error => {
      console.log('error====', error);
      this.messageService.generateErrorMessage(error)
    });


    this.userName = localStorage.getItem('fullName');
    this.meetingTime = localStorage.getItem('eventType').split('m')[0] + ' Minute Meeting';
    this.meetingDateTime = localStorage.getItem('selectedDate');
    this.selectedStartTime = Date.parse(localStorage.getItem('selectedStartTime'));
    this.userStartTime = Date.parse(localStorage.getItem('userStartTime'));
    this.selectedEndTime = Date.parse(localStorage.getItem('selectedEndTime'));
    this.userEndTime = Date.parse(localStorage.getItem('userEndTime'));
    this.selectedTimeZone = localStorage.getItem('selectedTimeZone');
    this.userTimeZone = localStorage.getItem('userTimeZone');



      if(this.rescheduleRecords){
        let checkFullName =  typeof (this.rescheduleRecords.schedulerName) == 'string' && this.rescheduleRecords.schedulerName != 'undefined' && this.rescheduleRecords.schedulerName.trim().length > 0 ? this.rescheduleRecords.schedulerName: '';
        let checkEmail =  typeof (this.rescheduleRecords.schedulerEmail) == 'string' && this.rescheduleRecords.schedulerEmail != 'undefined' && this.rescheduleRecords.schedulerEmail.trim().length > 0 ? this.rescheduleRecords.schedulerEmail: '';
        let checkPhone =  typeof (this.rescheduleRecords.schedulerPhone) == 'string' && this.rescheduleRecords.schedulerPhone != 'undefined' && this.rescheduleRecords.schedulerPhone.trim().length > 0 ? this.rescheduleRecords.schedulerPhone: '';
        this.meetingUserInfoForm.patchValue({
          fullName: checkFullName,
          email: checkEmail,
          phone: checkPhone
        });
      }


    if(this.weblink === null|| this.weblink === undefined || this.weblink === "null" || this.weblink === "" ){
      this.weblink = "";
    }
  }


  onSubmit() {



    if(this.meetingUserInfoForm.valid) {
      let curDate = new Date();
      curDate.setHours(0,0,0);
      this.isLoadingOne = true;
      for (const i in this.meetingUserInfoForm.controls) {
        this.meetingUserInfoForm.controls[i].markAsDirty();
      }
      let Meeting_owner = localStorage.getItem('fullName');


      let timeMax =  typeof (localStorage.getItem('userEndTime')) == 'string' && localStorage.getItem('userEndTime') != 'undefined' && localStorage.getItem('userEndTime').trim().length > 0 ;
      let checkEmail =  typeof (this.meetingService.getUserEmail()) == 'string' && this.meetingService.getUserEmail() != 'undefined' && this.meetingService.getUserEmail().trim().length > 0 ;
      let timeMin =  typeof (localStorage.getItem('userStartTime')) == 'string' && localStorage.getItem('userStartTime') != 'undefined' && localStorage.getItem('userStartTime').trim().length > 0 ;

      let flag = false;
      if(timeMax && checkEmail && timeMin ){
        this.httpClient.post<any>( '/user/getcalendareventslot',
          {
            email: this.meetingService.getUserEmail(),
            timeMax: new Date(localStorage.getItem('userEndTime')),
            timeMin: new Date(localStorage.getItem('userStartTime'))
          }).subscribe((response) => {
            console.log("Length : ", response);
             response.map((obj) => {
              if (obj.hasOwnProperty("attendees")) {
                for (let k = 0; k < obj.attendees.length; k++) {
                  let checkPoint = typeof (obj.attendees[k].organizer) === 'boolean' && obj.attendees[k].organizer !== 'undefined' && obj.attendees[k].organizer === true;
                  if (checkPoint) {
                    if (obj.attendees[k].responseStatus == "declined") {
                      flag = true;
                    }
                  }
                }
              }
            });
          if(response.length == 0 || flag) {

            if(this.authServiceLocal.getIsAuthenticated()){
              if(this.authServiceLocal.getUserId() == localStorage.getItem("userIdMeeting")){
                this.data = {
                  userId: localStorage.getItem('userIdMeeting'),
                  timeZone: localStorage.getItem('selectedTimeZone'),
                  eventType: localStorage.getItem('eventType'),
                  starttime: localStorage.getItem('userStartTime'),
                  endtime: localStorage.getItem('userEndTime'),
                  date: localStorage.getItem('selectedDate'),
                  schedulerName: this.meetingUserInfoForm.value.fullName,
                  schedulerEmail: this.meetingUserInfoForm.value.email,
                  schedulerPhone: this.meetingUserInfoForm.value.phone,
                  schedulerDescription: this.meetingUserInfoForm.value.description,
                  reschedulerName: localStorage.getItem('fullName'),
                  Meeting_owner: Meeting_owner,
                  createdDate: curDate,
                  userTimeZone : this.userTimeZone
                };
              }else{
                this.data = {
                  userId: localStorage.getItem('userIdMeeting'),
                  timeZone: localStorage.getItem('selectedTimeZone'),
                  eventType: localStorage.getItem('eventType'),
                  starttime: localStorage.getItem('userStartTime'),
                  endtime: localStorage.getItem('userEndTime'),
                  date: localStorage.getItem('selectedDate'),
                  schedulerName: this.meetingUserInfoForm.value.fullName,
                  schedulerEmail: this.meetingUserInfoForm.value.email,
                  schedulerPhone: this.meetingUserInfoForm.value.phone,
                  schedulerDescription: this.meetingUserInfoForm.value.description,
                  reschedulerName: this.meetingUserInfoForm.value.fullName,
                  Meeting_owner: Meeting_owner,
                  createdDate: curDate,
                  userTimeZone : this.userTimeZone
                };
              }
            }else{
              this.data = {
                userId: localStorage.getItem('userIdMeeting'),
                timeZone: localStorage.getItem('selectedTimeZone'),
                eventType: localStorage.getItem('eventType'),
                starttime: localStorage.getItem('userStartTime'),
                endtime: localStorage.getItem('userEndTime'),
                date: localStorage.getItem('selectedDate'),
                schedulerName: this.meetingUserInfoForm.value.fullName,
                schedulerEmail: this.meetingUserInfoForm.value.email,
                schedulerPhone: this.meetingUserInfoForm.value.phone,
                schedulerDescription: this.meetingUserInfoForm.value.description,
                reschedulerName: this.meetingUserInfoForm.value.fullName,
                Meeting_owner: Meeting_owner,
                createdDate: curDate,
                userTimeZone : this.userTimeZone
              };
            }

            // console.log("this.userTimeZone======",this.userTimeZone);
            this.meetIngData = {
              'subject': this.meetingUserInfoForm.value.fullName,
              'starttime': new Date(this.userStartTime),
              'endtime': new Date(this.userEndTime),
              'passwordrequired': false,
              'conferencecallinfo': 'hybrid',
              'timezonekey': localStorage.getItem('selectedTimeZone'),
              'meetingtype': 'scheduled'
            };
            if(this.btnValue == 'Schedule Event') {
              console.log("This is a Meeting platform : ", this.meetingPlatform);
              if (this.meetingPlatform == "SALESFORCE") {
                console.log("_------------------salesforce --- >> ");
              }
              else if (this.meetingPlatform == "ZOOM") {
                console.log("_------------------zoom --- >> ");
                this.meetingService.addMeetingWithZoom(this.meetIngData, this.data);
              }
              else if (this.meetingPlatform == "GTM") {
                console.log("_------------------gtm --- >> ", this.data);
                this.meetingService.getGoToMeeting(this.meetIngData, this.data);
              }
              else {
                console.log("calendar=================");
                this.meetingService.addMeetingToDatabase(this.meetIngData, this.data);
              }
            } else {
              /*this.data['reschedulerName'] = this.userName;*/
              this.data['rescheduleReason'] = this.meetingUserInfoForm.value.reasonOfRescheduling;
              this.data['eventId'] = localStorage.getItem("eventId");
              console.log('data-------------------->>', this.data);
              console.log('meetIngData-------------------->>', this.meetIngData);
              this.meetingService.rescheduleMeeting(this.data, this.meetIngData);
            }

          }else{
            this.message.create('warning', `This slot already booked.`);
            this.isLoadingOne = false;
          }
        },error1 => {
          this.message.create('warning', `Something went gone wrong.`);
          this.isLoadingOne = false;
        });
      }else{
        this.message.create('warning', `Something went gone wrong.`);
        this.isLoadingOne = false;
      }
    } else {
      this.message.create('warning', `Please fill all field`);
      this.isLoadingOne = false;
    }

  }
}
