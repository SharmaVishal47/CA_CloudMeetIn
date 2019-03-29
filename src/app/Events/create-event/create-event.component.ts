import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventService} from "../event.service";
import {AuthServiceLocal} from '../../Auth/auth.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit,OnDestroy {

  /**/
  datePickerFiled  = new FormArray([]);
  selectedDate:Date;
  editMode: boolean = false;
  editEventId: string;
  editEventIndex: number;
  userId: string;
  cardStatus: boolean = true;
  checkActiveCard : boolean = true;
  secondCard : boolean = false;
  defaultEventType = '30 min';
  default_secret_event = 'true';
  user_select_range;
  custom_event_Time;
  custom_eventTime = false;
  date_range_status:number = 0;
  meetingIntegrationStatus: boolean = false;
  meetingIntegrationPlatFormName: string;
  meetingIntegrationPlatFormLink: string;
  colorIndex = 0;
  location: string;
  event_colorList = ['#8207e0', '#f00', '#b30089', '#008d18', '#008993','#d3be00'];

  /*listDataMap = {
     eight : [
       { type: 'success', content: '09:00 AM - 05:00 PM' }
     ]
   };*/
  listDataMap = [];
  defaultTimeSlot = [];
  isVisible = false;
  date_range = false;
  event_timeZone = false;
  event_timeZone_Status = 0;

  _timeZone: string = "Asia/Kolkata";
  radioValue = 'A';
  selectTimeZoneValue = 'Local';
  style = {
    display : 'block',
    height : '30px',
    lineHeight: '0px'
  };
  selectedValue = new Date ();
  index1 = 0;
  languages: string[] = ['English','French','Spanish','German','Dutch','Portuguese(Brazil)','Italian'];

  eventLink: string = 'localhost:4200/sumitkrsharma195/';
  color = '#278ce2';
  validateForm: FormGroup;
  eventBuffersSlot = [
    {event_type: '0 min'}, {event_type: '5 min'}, {event_type: '10 min'}, {event_type: '15 min'},
    {event_type: '30 min'}, {event_type: '45 min'}, {event_type: '1 hr'}, {event_type: '1 hr 30 min'},
    {event_type: '2 hrs'}, {event_type: '2 hrs 30 min'}, {event_type: '3 hrs'}
  ];

  eventTimeSlot = [
    {event_type: '5 min'}, {event_type: '10 min'}, {event_type: '15 min'},
    {event_type: '30 min'}, {event_type: '45 min'}, {event_type: '60 min'}
  ];

  /* This is use for add dynamic hours input*/
  addAvailabilityForm: FormGroup;
  controlArray: Array<{ id: number, controlInstance: string, controlInstance2: string}> = [];
  availabilityAdvanceForm: FormGroup;
  dateRangeForm: FormGroup;
  defaultDateRange: string ='day';
  dateRange = [];
  eventTimeZoneForm: FormGroup;
  _userSelectTimeZone;

  eventStartTime = new Date();
  endTime =  new Date(1403454068850);

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthServiceLocal,
    private message: NzMessageService
  ) { }


  handleOk(): void {
    this.isVisible = false;
    this.datePickerFiled  = new FormArray([]);
    console.log("handleOk -- > ");
  }

  handleCancel(): void {
    this.date_range = false;
    this.isVisible = false;
    this.event_timeZone = false;
    this.datePickerFiled  = new FormArray([]);
    console.log("handleCancel -- > ");
  }
  getMonthData(date: Date): number | null {
    if (date.getMonth() === 8) {
      return 1394;
    }
    return null;
  }

  /* addField(e?: MouseEvent): void {
     if (e) {
       e.preventDefault();
     }
     const id = (this.controlArray.length > 0) ? this.controlArray[ this.controlArray.length - 1 ].id + 1 : 0;

     const control = {
       id,
       controlInstance: `passenger${id}`,
       controlInstance2:`passenger${id}`
     };
     const index = this.controlArray.push(control);
     console.log(this.controlArray[ this.controlArray.length - 1 ]);
     this.addAvailabilityForm.addControl(this.controlArray[ index - 1 ].controlInstance, new FormControl(null, Validators.required));
   }
   removeField(i: { id: number, controlInstance: string }, e: MouseEvent): void {
     e.preventDefault();
     if (this.controlArray.length > 1) {
       const index = this.controlArray.indexOf(i);
       this.controlArray.splice(index, 1);
       console.log(this.controlArray);
       this.addAvailabilityForm.removeControl(i.controlInstance);
     }
   }*/

 /* getFormControl(name: string): AbstractControl {
    return this.addAvailabilityForm.controls[ name ];
  }*/

  submitFormAvailability(): void {
    for (const i in this.addAvailabilityForm.controls) {
      this.addAvailabilityForm.controls[ i ].markAsDirty();
      this.addAvailabilityForm.controls[ i ].updateValueAndValidity();
    }
    this.eventService.addSlotsInSDate(this.addAvailabilityForm.value, this.editEventId, this.selectedDate).subscribe((response) => {
      console.log("Response of slots value -- > ", response);
    })
  }
  /*End*/

  selectChange(select: Date, selectedDate:Date, dates: string): void {

    console.log("selected Data", select);
    console.log(`Select value: ${select}`);
    console.log(`Seleted adates ------------------>>>>:`, dates);
    console.log("selected Date --------------", selectedDate);
    console.log("this.editEventId --------------", this.editEventId);
    this.selectedDate = selectedDate;
    this.addAvailabilityForm = new FormGroup({
      datePicker : this.datePickerFiled
    });
    this.eventService.getSelectedDateSlot(this.editEventId, selectedDate).subscribe((response) => {
      console.log("Response from the getselecteddateslot Api --->  ", response);
      if(response.data.length > 0) {
         let fromTime  = response.data['0'].startTime.split(',');
         let toTime = response.data['0'].endTime.split(',');
         console.log("IF Status --> ");
        for (let i = 0; i < fromTime.length; i++) {
          this.datePickerFiled.push(
            new FormGroup( {
              'fromTime' : new FormControl(new Date(+fromTime[i]), Validators.required),
              'toTime' : new FormControl(new Date(+toTime[i]), Validators.required)
            })
          );
        }
        console.log("Length of date picker filed 1 -- > ", this.datePickerFiled.length);
      } else {

        console.log("ELSE  Status --> ");
        let startTime = this.eventService.convertTimePickerFormat(this.defaultTimeSlot[0].startTime, selectedDate);
        let endTime = this.eventService.convertTimePickerFormat(this.defaultTimeSlot[0].endTime, selectedDate);
        this.datePickerFiled.push(
          new FormGroup( {
            'fromTime' : new FormControl(startTime, Validators.required),
            'toTime' : new FormControl(endTime, Validators.required)
          })
        );
        console.log("Length of date picker filed -- > ", this.datePickerFiled.length);
      }
    });
    this.isVisible = true;
  }

  ngOnInit() {
    this.datePickerFiled  = new FormArray([]);
    this.editEventId  =  this.eventService.returnEventId();
    this.editEventIndex  =  this.eventService.returnEventIndex();
    console.log("EventId is 11--> ",  this.editEventId, 'and event index is ---> ', this.editEventIndex);
    this.userId = this.authService.getUserId();
    this.eventService.getAvailabilitySlotTime().subscribe(
      res => {
        console.log("Response of get Availability time --- > ", res);

        if(res.data.length > 0) {
          console.log("New StartTime", this.eventStartTime);
          /* this.startTime=  res.data['0'].startTime;
         this.endTime=  res.data['0'].endTime;*/
          this.defaultTimeSlot.push({
            startTime: res.data['0'].startTime,
            endTime: res.data['0'].endTime,
          });
          console.log("Return", this.eventService.convertTimeInto12(res.data['0'].startTime, res.data['0'].endTime));
          this.listDataMap.push(this.eventService.convertTimeInto12(res.data['0'].startTime, res.data['0'].endTime));
        }
        console.log("All data -- > ", this.listDataMap);
      });
      this.validateForm = new FormGroup({
      eventName: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      eventLink: new FormControl(null, [Validators.required]),
      location_display: new FormControl(null, [Validators.required]),
    });

   /*  this.eventService.editEventRecords.subscribe(({event_id, eventIndex})=> {
       console.log("EventId is --> ", event_id, 'and event index is ---> ', eventIndex)
     });
*/


    this.eventTimeZoneForm = this.fb.group({
      timeZone: [ null, [ Validators.required ] ],
    });
    this.dateRangeForm = this.fb.group({
      availability: [ null, [ Validators.required ] ],
      rolling_days: [ null, [ Validators.required ] ],
      range_dates: [ null, [ Validators.required ] ],
    });
    this.dateRangeForm.patchValue({
      rolling_days: 60
    });
    this.availabilityAdvanceForm = this.fb.group({
      show_availability: [ null, [ Validators.required ] ],
      show_availability_buffer_before_event: [ null, [ Validators.required ] ],
      show_availability_buffer_after_event: [ null, [ Validators.required ] ],
      event_max_per_day : [null, [ Validators.required ]],
      minimum_scheduling_notice : [null, [ Validators.required ]]
    });
    this.availabilityAdvanceForm.patchValue({
      show_availability : '30 min',
      event_max_per_day: 0,
      minimum_scheduling_notice : 4,
      show_availability_buffer_before_event : '0 min',
      show_availability_buffer_after_event : '0 min',
    });


    this.addAvailabilityForm = new FormGroup({
      datePicker : this.datePickerFiled
    });
  /*  this.addAvailabilityForm = this.fb.group({});
     this.addField();*/

    if(this.editEventId) {
      this.eventService.getOneEventRecords(this.editEventId).subscribe((oneEventResponse ) => {
        console.log("One Event records ==== > ", oneEventResponse.data[0]);
        this.editMode =  true;
        this.validateForm.patchValue({
          eventName: oneEventResponse.data[0].name,
          location: oneEventResponse.data[0].location,
          description: oneEventResponse.data[0].description,
          eventLink: oneEventResponse.data[0].link,
          location_display: oneEventResponse.data[0].location_display,
        });

        this.availabilityAdvanceForm.patchValue({
          show_availability : oneEventResponse.data[0].event_availability_increments,
          event_max_per_day: oneEventResponse.data[0].event_max_per_day,
          minimum_scheduling_notice : oneEventResponse.data[0].event_scheduling_notice,
          show_availability_buffer_before_event : oneEventResponse.data[0].event_buffer_before_event,
          show_availability_buffer_after_event : oneEventResponse.data[0].event_buffer_after_event,
        });
      });
    }


  }



  onChangeColor(event: string) {
    this.color = event;
  }
  getEventTypeColor (index: number) {
    this.colorIndex = index;
    console.log("this.c", this.colorIndex);
  }
  submitForm () {
    this.checkActiveCard = false;
    if(this.editMode) {
      this.colorIndex === 0 ? this.validateForm.value['color'] = this.event_colorList[this.colorIndex] : this.validateForm.value['color'] = this.event_colorList[this.colorIndex];
      this.eventService.updateEvent(this.validateForm.value, this.editEventId);
      this.message.create('success', `The event have  successfully updated`);
    } else {
      this.colorIndex === 0 ? this.validateForm.value['color'] = this.event_colorList[this.colorIndex] : this.validateForm.value['color'] = this.event_colorList[this.colorIndex];
      this.eventService.createEvent(this.validateForm.value);
      this.submitAdvancedForm(false);
      this.message.create('success', `The event have  successfully saved`);
      // this.validateForm.reset();
    }
  }
  checkMeetingPlatformAvailability (index: number) {
    this.eventService.checkMeetingPlatform();
    this.eventService.checkMeetingPlatformAvailability.subscribe((response) => {
      if (response.data.length > 0) {
        switch (index) {
          case 1 :
            if (response.data[0].go2meeting === 'true') {
              this.validateForm.patchValue({
                location: 'GTM'
              });
              this.meetingIntegrationStatus = false;
            } else {
              this.validateForm.patchValue({
                location: 'GTM'
              });
              this.meetingIntegrationStatus = true;
              this.meetingIntegrationPlatFormName = 'GoToMeeting';
              this.meetingIntegrationPlatFormLink = 'gotomeeting';
            }
            break;
          case 2 :
            if (response.data[0].zoom === 'true') {
              this.validateForm.patchValue({
                location: 'Zoom'
              });
              this.meetingIntegrationStatus = false;
            } else {
              this.validateForm.patchValue({
                location: 'Zoom'
              });
              this.meetingIntegrationStatus = true;
              this.meetingIntegrationPlatFormName = 'Zoom';
              this.meetingIntegrationPlatFormLink = 'zoommeeting';
            }
            break;

          default:
            this.validateForm.patchValue({
              location: 'GTM'
            });
            this.meetingIntegrationStatus = true;
            this.meetingIntegrationPlatFormName = 'GoToMeeting';
            this.meetingIntegrationPlatFormLink = 'gotomeeting';
        }
      }
    });

  }

  /* Second Form (Date Range) */
  onDateRange() {
    this.date_range = true;
  }
  availabilityChange(events: {}) {
    console.log("Events ----------> ", events);
    switch (events) {
      case 'day' : {
        this.date_range_status = 1;
        break
      }
      case 'date_range' : {
        this.date_range_status = 2;
        break
      }
      case 'indefinitely' : {
        this.date_range_status = 3;
        break
      }
      default: {
        this.date_range_status = 3;
        console.log("indefinitely");
      }
    }
  }

  onEventTimeZone() {
    this.event_timeZone =  true;
  }
  /*Date Range submit functions*/
  submitDateRangeForm() {
    this.date_range = false;
    console.log("--------->", this.dateRangeForm.value.availability);
    return this.dateRangeForm.value;
  }

  submitEventTimeZoneForm() {
    this.event_timeZone = false;
    this.secondCard =  true;
    console.log("submitEventTimeZoneForm ---- > ", this.eventTimeZoneForm.value.timeZone);
    if(this.eventTimeZoneForm.value.timeZone == 'Local') {
      this.event_timeZone_Status = 1;
      this._userSelectTimeZone = 'Asia/Kolkata';
      return this._userSelectTimeZone;
    }
  }
  changeTimezone(selectTimeZone: string) {
    this._userSelectTimeZone  =  typeof selectTimeZone === 'string' && selectTimeZone.split('').length > 0 ? selectTimeZone : false;

  }

  OnAddEventTime() {
    this.custom_eventTime = true;
  }

  onEventTime(event_type: string) {
    console.log("Event Type", event_type);
    this.defaultEventType = event_type;
  }
  /* This is Main Submit Function*/
  submitAdvancedForm(checkStatus: any) {

    console.log("Event Type  ---- > ", this.defaultEventType);
    console.log("default_secret_event  ---- > ", this.default_secret_event);
    console.log("Value Of Advanced page ---- > ", this.availabilityAdvanceForm.value);
    console.log("Value of Date Range Form -----> " , this.submitDateRangeForm());
    this.user_select_range= this.submitDateRangeForm();
    console.log("submitEventTimeZoneForm-----1 > " , this.submitEventTimeZoneForm());
    console.log("User Select Time Zone --- > ", this._userSelectTimeZone);
    console.log("checkStatus--- > ", checkStatus);

    this.eventService.onSaveInDatabase(
      this.defaultEventType,
      this.default_secret_event,
      this._userSelectTimeZone,
      this.user_select_range,
      this.availabilityAdvanceForm.value, checkStatus, this.editEventId)

  }

  OnCancelEventAdvancedFrom() {
    this.eventService.eventCancel();
  }

  ngOnDestroy(): void {
    this.eventService.removeEventData();
  }


  addField() {
    (<FormArray>this.addAvailabilityForm.get('datePicker')).push(
      new FormGroup({
        'fromTime': new FormControl(null, Validators.required),
        'toTime': new FormControl(null, Validators.required),
      })
    )
  }

  get datePicker() { return <FormArray>this.addAvailabilityForm.get('datePicker'); }

  onDeleteTimePicker(index: number) {
    (<FormArray>this.addAvailabilityForm.get('datePicker')).removeAt(index);
  }
}
