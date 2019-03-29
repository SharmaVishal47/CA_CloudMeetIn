import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthServiceLocal} from '../../auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changPasswordForm: FormGroup;
  queryData;
  email;
  valid;
  constructor(private fb: FormBuilder,private router: Router,private activatedRoute: ActivatedRoute,private authService:AuthServiceLocal) { }
  ngOnInit() {
    this.changPasswordForm = this.fb.group({
      password: [ null, [ Validators.required ] ]
    });
    this.activatedRoute.queryParams.subscribe(params => {

      this.queryData = params['data'];
      this.email = params['email'];
      console.log(' QueryParams--->',this.queryData);
      console.log(' QueryParams email--->',this.email);

    });
   this.authService.checkTokenData(this.queryData,this.email);
  }
  submitForm(): void {
    for (const i in this.changPasswordForm.controls) {
      this.changPasswordForm.controls[ i ].markAsDirty();
      this.changPasswordForm.controls[ i ].updateValueAndValidity();
    }
    this.router.navigate(['/login']);
    console.log('Datas--------->', this.changPasswordForm.value.password);
    this.authService.updatePassword(this.changPasswordForm.value.password,this.email);

  }
}
