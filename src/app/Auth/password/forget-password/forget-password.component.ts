import {OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule, Routes} from '@angular/router';
import {Component} from '@angular/core';
import {AuthServiceLocal} from '../../auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  loginForm: FormGroup;
  param1;
  constructor(private fb: FormBuilder,private router: Router, private route: ActivatedRoute, private  authService:AuthServiceLocal) { }

  ngOnInit() {

    this.loginForm = this.fb.group({
      emailId: [ null, [ Validators.required ] ]
    })

  }
  submitForm(): void {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[ i ].markAsDirty();
      this.loginForm.controls[ i ].updateValueAndValidity();
    }

    console.log('Datas--------->', this.loginForm.value);
    this.authService.validateUser(this.loginForm.value);

  }
}
