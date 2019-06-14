import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MeetingService} from './meetings/meeting.service';
import {AdminService} from './Admin/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private meetingService: MeetingService, private cdRef: ChangeDetectorRef, private adminService: AdminService) {
  }

  title = 'CloudMeetIn';

  removeHeader: boolean;
  ngOnInit(): void {
    /*this.adminService.autoAuthListener();*/
    this.meetingService.authStatusListener.subscribe((response) => {
      this.removeHeader = response;
      this.cdRef.detectChanges();
    }, error1 => {
      // console.log(error1);
    });

  }
}
