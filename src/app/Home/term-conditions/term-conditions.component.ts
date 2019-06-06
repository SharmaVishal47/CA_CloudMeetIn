import {Component, OnInit} from '@angular/core';
import {MeetingService} from '../../meetings/meeting.service';
import {HttpClient} from '@angular/common/http';
import {MessageServiceService} from '../../Auth/message-service.service';

@Component({
  selector: 'app-term-conditions',
  templateUrl: './term-conditions.component.html',
  styleUrls: ['./term-conditions.component.css']
})
export class TermConditionsComponent implements OnInit {

  terms_conditions;

  constructor(private meetingService: MeetingService,
              private httpClient : HttpClient,
              private messageService: MessageServiceService) { }

  ngOnInit() {
    this.meetingService.removeHeader(true);

      this.httpClient.get<any>('https://dev.cloudmeetin.com/policy/terms-conditions').subscribe((responseData)=>{
        this.terms_conditions = responseData.data;
      },error => {
        this.messageService.generateErrorMessage(JSON.stringify(error));
      });
    }


}
