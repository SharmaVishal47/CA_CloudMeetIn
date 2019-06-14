import { Component, OnInit } from '@angular/core';
import {SignUpService} from '../sign-up.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthServiceLocal} from '../auth.service';

@Component({
  selector: 'app-calenderoption-by-email',
  templateUrl: './calenderoption-by-email.component.html',
  styleUrls: ['./calenderoption-by-email.component.css']
})
export class CalenderoptionByEmailComponent implements OnInit {
  changPasswordForm: FormGroup;
  queryData;
  email;
  valid;
  param1;
  param;
  verified:boolean =false;
  constructor(private signUpService:SignUpService, private fb: FormBuilder,private router: Router,private activatedRoute: ActivatedRoute,private authService:AuthServiceLocal ) { }

  ngOnInit() {
    this.param = this.activatedRoute.snapshot.queryParamMap.get('signupData');
    this.param1 = this.activatedRoute.snapshot.queryParamMap.get('code');
    if(this.param){

      //this.email = params['email'];
      console.log(' QueryParams--->',this.param);

      this.signUpService.checkTokenData(this.param);
      this.signUpService.checkTokenSubject.subscribe((responseData)=>{
        this.verified = responseData;
        console.log("responseData Boolean ",responseData);
      });
    }
    console.log('Code------>', this.param1);
    if (this.param1) {
      this.email = localStorage.getItem('emailSignUp');

      this.signUpService.generateToken(this.param1,this.email);
      this.signUpService.getGenerateTokenListener().subscribe((responseData)=>{
        console.log("responseData token====",responseData);
        this.router.navigate(['settings']);
      });
    }
  }

  changeCalendar() {
    this.signUpService.generateGmailAuthUrlByEmail();
  }
}
