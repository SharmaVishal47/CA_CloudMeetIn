import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-scheduling-page',
  templateUrl: './scheduling-page.component.html',
  styleUrls: ['./scheduling-page.component.css']
})
export class SchedulingPageComponent implements OnInit {
  email: string;
  Meeting_owner = 'Sumit Kumar';
  meeting_time15 = '15 Minute Meeting';
  meeting_time30 = '30 Minute Meeting';
  meeting_time60 = '60 Minute Meeting';
  headingTitle = `Welcome to my scheduling page.
Please follow the instructions to add an event to my calendar`;
  findId =  false;
  userId : string;
  currentDate;
  constructor(private router:Router,private httpClient: HttpClient,private route: ActivatedRoute,private fb: FormBuilder) { }

  ngOnInit() {
    this.currentDate = new Date();
    this.route.params.subscribe((params: Params) => {
      this.userId = params['userId'];
      console.log("this.userId====",this.userId);
      let data = {userId: this.userId};
      this.httpClient.post<{message: string,data: []}>('http://localhost:3000/user/checkuser',data).subscribe((responseData)=>{
        console.log("responseData====",responseData.data);
        if(responseData.data.length>0){
          this.findId = true;
          this.Meeting_owner = responseData.data["0"].fullName;
          this.email = responseData.data["0"].fullName;
        }else{
          this.findId = false;
          this.email = null;
        }
      },error => {
        console.log("error====",error);
      });
    });
  }

  setEvent(event: string) {
    localStorage.setItem('eventType', event);
    localStorage.setItem('userId', this.userId);
    localStorage.setItem('fullName',this.Meeting_owner);
    this.router.navigate([this.userId + '/' + event]);// + '/meetingDate'
  }
}
