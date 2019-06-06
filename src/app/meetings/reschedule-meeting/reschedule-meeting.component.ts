import {Component, OnInit} from '@angular/core';
import {DateAdapter, MatDialog} from '@angular/material';
import {MeetingService} from '../meeting.service';
import * as moment from 'moment-timezone';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {MessageServiceService} from '../../Auth/message-service.service';

@Component({
  selector: 'app-reschedule-meeting',
  templateUrl: './reschedule-meeting.component.html',
  styleUrls: ['./reschedule-meeting.component.css']
})
export class RescheduleMeetingComponent<D> implements OnInit {
  maxDate ;
  Meeting_owner;
  meeting_time;
  isSpinning: boolean = true;
  minDate: D = this._dateAdapter.today();
  selected: D = this._dateAdapter.today();
  myFilter;
  meetingType;
  timeZone: string;
  selectedTimeZone: string;
  availableSlot = [];
  availableSlotTemp = [];
  selectedCardIndex;
  userTimeSlot = [];
  userTimeZone: string;
  selectedTimeSlot = {
    startTime: 1554337800000,
    endTime: 1554337800000
  };
  checkUTC;
  confirmBoxSlot = false;
  meetingId;
  private subscriptions: Array<Subscription> = [];
  startDate = new Date();
  availableDays;
  checkEventId = false;

  profilePic;
  description;


  eventId;
  eventType;
  meetingDate;
  meetingEndTime;
  meetingTime;
  schedulerDescription;
  schedulerEmail;
  schedulerName;
  schedulerPhone;
  timeZoneMeeting;
  userId;
  g2mMeetingId;
  cancel;
  g2mMeetingUrl;
  g2mMeetingCallNo;

  zoomMeetingId;
  zoomMeetingUrl ;
  zoomMeetingCallNo;
  constructor(private messageService:MessageServiceService,
              private _dateAdapter: DateAdapter<D>,
              private meetingService: MeetingService,
              private router: Router,
              private route: ActivatedRoute,
              private dialog: MatDialog,private authServiceLocal: AuthServiceLocal
  ) { }

  ngOnInit() {

    let curDate = new Date();
    this.maxDate = new Date(curDate.setMonth(curDate.getMonth()+2));

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

    if(this.authServiceLocal.getIsAuthenticated()){
      this.meetingService.removeHeader(false);
    }else{
      this.meetingService.removeHeader(true);
    }

    // console.log("meetingId=========",this.route.snapshot.paramMap.get('id')); // Print the parameter to the console.
    this.meetingId = this.route.snapshot.paramMap.get('id');

    const newSubs1 = this.meetingService.availabileSlot.subscribe((availableSlot)=> {
      // console.log("Getting Available slot===========",availableSlot);
      if(availableSlot != null){
        /* availableSlot.splice(0,1);*/
        this.availableSlot = [];
        this.availableSlotTemp = [];

        this.availableSlot = availableSlot;
        this.availableSlotTemp = availableSlot;

        let tempSlot = this.availableSlotTemp;

        /*     let currentTime = new Date();
             currentTime.setHours(currentTime.getHours()+3);
             let userCurrentTime = new Date(currentTime).toLocaleString('en-US', {timeZone: this.userTimeZone});
             // console.log("userCurrentTime================",userCurrentTime);*/

        let systemCurrentTime = new Date();
        let userTimeZoneTime = moment(systemCurrentTime).tz(this.userTimeZone).format();
        //// console.log("userTimeZoneTime=========",userTimeZoneTime);
        let currentTime = new Date(userTimeZoneTime);
        currentTime.setHours(currentTime.getHours()+4);
        //// console.log("currentTime client=========",currentTime);
        let userTimeAddFour = moment(currentTime).tz(this.userTimeZone).format();
        //// console.log("userTimeAddFour=========",userTimeAddFour);

        let slotForFilter = tempSlot.filter(item => Date.parse(item.startTime) >= Date.parse(userTimeAddFour));
        tempSlot = slotForFilter;

        tempSlot.sort((a,b) => Date.parse(a.startTime) - Date.parse(b.startTime));
        this.userTimeSlot = tempSlot;

        // console.log("before availableSlot1===================",this.availableSlot);
        // console.log("before convert availableSlot1===================",this.userTimeSlot);
        /*// console.log("filter availableSlot===================",tempSlot);*/
        this.availableSlot = [];
        tempSlot.forEach(item => {
          let dateStart = new Date(new Date(item.startTime)).toLocaleString('en-US', {timeZone: this.selectedTimeZone});
          let dateEnd = new Date(new Date(item.endTime)).toLocaleString('en-US', {timeZone: this.selectedTimeZone});
          let data = {
            startTime:dateStart,
            endTime:dateEnd
          };
          this.availableSlot.push(data);
        });
        // console.log("Show Slot==========", this.availableSlot);

        if(this.availableSlot.length == 0){
          let curdate = new Date(this.selected.toString());
          beginning: while(true) {
            curdate.setDate(curdate.getDate() + 1);
            let curweekDay = curdate.getDay().toString();
            if(this.availableDays.indexOf(curweekDay)>-1){
              this.selected = this._dateAdapter.createDate(curdate.getFullYear(),curdate.getMonth(),curdate.getDate());
              this.meetingService.getCalendarEventSlot(this.meetingType,this.selected.toString(),this.userTimeZone);
              break;
            }else{
              continue beginning;
            }
          }
        }else{
          this.isSpinning = false;
        }
      }
      let timeZone = moment.tz.guess();
      // console.log("timeZoneOffset======",timeZone);
      if(timeZone == "Asia/Calcutta"){
        this.timeZone = "Asia/Kolkata";
      }else{
        this.timeZone = timeZone;
      }
    });
    this.subscriptions.push(newSubs1);

    const newSubs3 = this.meetingService.meetingAvailableDay.subscribe((res: any) => {
      // console.log(res.data);
      if (res.data.length > 0) {
        localStorage.setItem('email',res.data[0].email);

        this.timeZone = res.data[0].timeZone;

        this.selectedTimeZone = res.data[0].timeZone;
        this.userTimeZone = res.data[0].timeZone;
        this.Meeting_owner = res.data[0].fullName;
        this.profilePic = res.data[0].profilePic;
        this.description = res.data[0].welcomeMessage;
        this.startDate = new Date(new Date().toLocaleString('en-US', {timeZone: this.timeZone}));
        if (res.data[0].availableDays) {
          this.availableDays = res.data[0].availableDays.split(',');
          if (this.availableDays.length > 0) {
            let todayDate = new Date();
            let weekDay = todayDate.getDay().toString();

            if(this.availableDays.indexOf(weekDay)>-1){
              // console.log("weekDay if=============",weekDay);
              this. isSpinning =true;
              this.meetingService.getCalendarEventSlot(this.meetingType,this.selected.toString(),this.userTimeZone);
            }else{
              // console.log("weekDay else=============",weekDay);
              let curdate = new Date();
              beginning: while(true) {
                curdate.setDate(curdate.getDate() + 1);
                let curweekDay = curdate.getDay().toString();
                if(this.availableDays.indexOf(curweekDay)>-1){
                  this.selected = this._dateAdapter.createDate(curdate.getFullYear(),curdate.getMonth(),curdate.getDate());
                  this. isSpinning = true;
                  this.meetingService.getCalendarEventSlot(this.meetingType,this.selected.toString(),this.userTimeZone);
                  break;
                }else{
                  continue beginning;
                }
              }
            }
            this.myFilter = (d: Date): boolean => {
              let day = d.getDay();
              if (this.availableDays.indexOf(day.toString()) > -1) {
                let day = this.availableDays.indexOf(d.getDay());
                return day !== this.availableDays[day];
              }
            };
          } else {
            this.meetingService.getCalendarEventSlot(this.meetingType,this.selected.toString(),this.userTimeZone);
            this.myFilter = (d: Date): boolean => {
              const day = d.getDay();
              return day !== 0 && day !== 1 && day !== 2 && day !== 3 && day !== 4 && day !== 5 && day !== 6;
            };
          }
        } else {
          this.meetingService.getCalendarEventSlot(this.meetingType,this.selected.toString(),this.userTimeZone);
          this.myFilter = (d: Date): boolean => {
            const day = d.getDay();
            return day !== 0 && day !== 1 && day !== 2 && day !== 3 && day !== 4 && day !== 5 && day !== 6;
          };
        }
      }
    }, error => {
      // console.log('error====', error);
      this.messageService.generateErrorMessage(error)
      /* const dialogConfig = new MatDialogConfig();
       dialogConfig.data = error;
       this.dialog.open(MessagedialogComponent, dialogConfig);*/
    });
    this.subscriptions.push(newSubs3);



    this.meetingService.getMeetingRecords(this.meetingId).subscribe(response => {
      this.isSpinning = false;
      // console.log("MeetingDetail=========",response);
      if(response != null && response != undefined){
        if(response.data.length > 0){
          this.eventType = response.data[0].eventType;
          this.meetingType = +response.data[0].eventType.split("m")[0];
          this.meeting_time = response.data[0].eventType.split("m")[0]+" Minute Meeting";
          this.meetingDate = response.data[0].meetingDate;
          this.meetingEndTime = response.data[0].meetingEndTime;
          this.meetingTime = response.data[0].meetingTime;
          this.eventId = response.data[0].eventID;
          this.schedulerDescription = response.data[0].schedulerDescription;
          this.schedulerEmail = response.data[0].schedulerEmail;
          this.schedulerName = response.data[0].schedulerName;
          this.schedulerPhone = response.data[0].schedulerPhone;
          this.timeZoneMeeting = response.data[0].timeZoneMeeting;
          this.userId = response.data[0].userId;
          this.g2mMeetingId = response.data[0].g2mMeetingId;
          this.g2mMeetingUrl = response.data[0].g2mMeetingUrl;
          this.g2mMeetingCallNo = response.data[0].g2mMeetingCallNo;
          this.zoomMeetingId  = response.data[0].zoomMeetingId;
          this.zoomMeetingUrl = response.data[0].ZoomMeetingUrl;
          this.zoomMeetingCallNo = response.data[0].zoomMeetingCallNo;
          this.cancel = response.data[0].cancel;
          if(this.cancel != "true"){
            this.checkEventId = true;
            // console.log("this.userId===========",this.userId);
            this.meetingService.getMeetingAvailableDay(this.userId);
          }else{
            this.router.navigate(['error']);
            this.checkEventId = false;
          }
        }else{
          this.router.navigate(['error']);
          this.checkEventId = false;
        }
      }else{
        this.router.navigate(['error']);
        this.checkEventId = false;
      }
    },error1 => {
      this.isSpinning = false;
    });
  }

  select(value: D) {
    // console.log("DAte=====",value);
    this.selected = value;
    this. isSpinning = true;
    this.meetingService.getCalendarEventSlot(this.meetingType,this.selected.toString(),this.userTimeZone);
  }

  changeTimezone(timezone) {
    this.selectedTimeZone = timezone;
    let tempSlot = this.availableSlotTemp;
    // console.log("Permanent Slot=======",tempSlot);
    let systemCurrentTime = new Date();
    let userTimeZoneTime = moment(systemCurrentTime).tz(this.userTimeZone).format();
    //// console.log("userTimeZoneTime=========",userTimeZoneTime);
    let currentTime = new Date(userTimeZoneTime);
    currentTime.setHours(currentTime.getHours()+4);
    //// console.log("currentTime client=========",currentTime);
    let userTimeAddFour = moment(currentTime).tz(this.userTimeZone).format();

    /*let currentTime = new Date();
    currentTime.setHours(currentTime.getHours()+3);*/

    /*let userCurrentTime = new Date(currentTime).toLocaleString('en-US', {timeZone: this.userTimeZone});
    // console.log("User Current Time=========",userCurrentTime);*/

    let slotForFilter = tempSlot.filter(item => Date.parse(item.startTime) >= Date.parse(userTimeAddFour));
    // console.log("slotForFilter===================",slotForFilter);
    tempSlot = slotForFilter;
    tempSlot.sort((a,b) => Date.parse(a.startTime) - Date.parse(b.startTime));

    this.userTimeSlot = tempSlot;

    // console.log("before timeZone availableSlot===================",this.availableSlotTemp);
    // console.log("before userTimeSlot availableSlot===================",this.userTimeSlot);
    /*// console.log("filter availableSlot===================",tempSlot);*/
    this.availableSlot = [];
    tempSlot.forEach(item => {
      if(item.startTime != null && item.startTime != undefined && item.endTime != null && item.endTime != undefined ){
        let dateStart = new Date(new Date(item.startTime)).toLocaleString('en-US', {timeZone: timezone});
        let dateEnd = new Date(new Date(item.endTime)).toLocaleString('en-US', {timeZone: timezone});
        let data = {
          startTime:dateStart,
          endTime:dateEnd
        };
        this.availableSlot.push(data);
      }
    });

    //this.availableSlot.sort((a,b) => Date.parse(a.startTime) - Date.parse(b.startTime));
    // console.log("after timeZone availableSlot===================",this.availableSlot);

  }

  onCardClick(selectedTimeSlot: any,index: number){
    this.selectedTimeSlot = selectedTimeSlot;
    this.selectedCardIndex = index;
    // console.log("user time=====",this.userTimeSlot[index]);
    // console.log("selected time time=====",selectedTimeSlot);
    this.checkUTC= moment(selectedTimeSlot.startTime).tz(this.selectedTimeZone ).format();
    this.confirmBoxSlot =  true;
  }

  ngOnDestroy() {
    this.meetingService.deleteListTimeArray();
    // console.log("Call on destroy");
    for (const subs of this.subscriptions) {
      subs.unsubscribe();
    }
  }

  closePopup() {
    this.confirmBoxSlot =  false;
  }

  confirmMeeting() {

    // console.log("Selected=============",this.selectedTimeSlot);
    let rescheduleRecords = {
      meetingTime: this.meetingTime,
      meetingDate: this.meetingDate,
      timeZone: this.timeZoneMeeting,
      meetingEndTime: this.meetingEndTime,
      g2mMeetingId: this.g2mMeetingId,
      g2mMeetingCallNo: this.g2mMeetingCallNo,
      g2mMeetingUrl: this.g2mMeetingUrl,
      schedulerEmail: this.schedulerEmail,
      schedulerName: this.schedulerName,
      schedulerPhone: this.schedulerPhone,
      zoomMeetingId: this.zoomMeetingId,
      zoomMeetingUrl: this.zoomMeetingUrl,
      zoomMeetingCallNo: this.zoomMeetingCallNo,
      Meeting_owner: localStorage.setItem('fullName', this.Meeting_owner)
    };
    localStorage.setItem('rescheduleRecord',JSON.stringify(rescheduleRecords));

    let date = new Date(this.selected.toString());
    date.setHours(0,0,0);
    localStorage.setItem('selectedDate', date.toString());
    /*localStorage.setItem('selectedDate', this.selected.toString());*/
    localStorage.setItem('userTimeZone', this.userTimeZone);
    localStorage.setItem('reschduleMeetingId', this.meetingId);
    localStorage.setItem('eventId', this.eventId);

    localStorage.setItem('description', this.description);
    localStorage.setItem('imagePreview', this.profilePic);
    localStorage.setItem('eventType', this.eventType);
    localStorage.setItem('userIdMeeting', this.userId);
    localStorage.setItem('fullName', this.Meeting_owner);


    localStorage.setItem('selectedTimeZone', this.selectedTimeZone);
    localStorage.setItem('selectedStartTime', ""+this.selectedTimeSlot.startTime);
    localStorage.setItem('selectedEndTime', ""+this.selectedTimeSlot.endTime);

    localStorage.setItem('userStartTime', ""+this.userTimeSlot[this.selectedCardIndex].startTime);
    localStorage.setItem('userEndTime', ""+this.userTimeSlot[this.selectedCardIndex].endTime);
    this.confirmBoxSlot =  false;
    this.router.navigate([this.userId+"/"+this.eventType+"/schedulingPage"]);
  }
}
