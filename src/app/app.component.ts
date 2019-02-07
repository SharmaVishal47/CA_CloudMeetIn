import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MeetingService} from './meetings/meeting.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private meetingService: MeetingService, private cdRef: ChangeDetectorRef) {
  }

  title = 'CA-Calendly';

  removeHeader: boolean;
  ngOnInit(): void {
    this.meetingService.authStatusListener.subscribe((response) => {
      this.removeHeader = response;
      console.log("Remove Header ---> ", this.removeHeader);
      this.cdRef.detectChanges();
    }, error1 => {
      console.log(error1);
    });

  }
}
