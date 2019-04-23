import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MeetingService} from '../../meetings/meeting.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  signUp: FormGroup;
  email: string;
  checkBoxCheck: false;
  checkboxValue: false;
  constructor(private fb: FormBuilder, private route: ActivatedRoute,private router:Router, private meetingService: MeetingService) { }


  ngOnInit() {
    let offset = new Date().getTimezoneOffset();
    console.log("TimeZone=====",offset);

    this.signUp = this.fb.group({
      email: [ null, [ Validators.required ] ],
    });
    this.route.params.subscribe((params: Params) => {
      this.email = params['email'];
      this.signUp.patchValue({email: this.email});
    });

  }

  onSubmit() {
    for (const i in this.signUp.controls) {
      this.signUp.controls[ i ].markAsDirty();
      this.signUp.controls[ i ].updateValueAndValidity();
    }
    this.router.navigate(['signup/'+this.signUp.value.email]);
  }
  checkCheckBoxvalue(event){
    console.log(this.checkboxValue)
  }
}
