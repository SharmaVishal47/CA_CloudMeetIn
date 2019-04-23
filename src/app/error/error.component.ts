import { Component, OnInit } from '@angular/core';
import {MeetingService} from '../meetings/meeting.service';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(private meetingService: MeetingService) { }

  ngOnInit() {
    this.meetingService.removeHeader(true);


  }
  onHome() {
    this.meetingService.removeHeader(false);
  }

}
