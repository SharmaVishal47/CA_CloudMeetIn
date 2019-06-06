import { Component, OnInit } from '@angular/core';
import {MeetingService} from '../meetings/meeting.service';
import {MessageServiceService} from '../Auth/message-service.service';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  message : string;
  constructor(private meetingService: MeetingService, private messageService: MessageServiceService) { }

  ngOnInit() {
    this.message =  typeof (this.messageService.getErrorMessage()) === 'string' && this.messageService.getErrorMessage() !== 'undefined'
    && this.messageService.getErrorMessage().split('').length > 0
      ? this.messageService.getErrorMessage() : 'The page you are looking for might have been removed had its name changed or is temporarily unavailable.';

    this.meetingService.removeHeader(true);


  }
  onHome() {
    this.meetingService.removeHeader(false);
  }

}
