import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';



@Component({
  selector: 'app-try-again-forget-password',
  templateUrl: './try-again-forget-password.component.html',
  styleUrls: ['./try-again-forget-password.component.css']
})
export class TryAgainForgetPasswordComponent implements OnInit {
  param1;
  userEmail;
  flagStatus: boolean = true;
  message: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.param1 = params['email'];
      console.log('Pramas1 -> ', this.param1);

      if(this.validateEmail(this.param1)) {
        this.flagStatus = false;
        this.userEmail =  this.param1;
        this.message = 'to reset your password.';
      } else {
        this.message = 'your given email for verification.';
      }
      this.param1 =  this.userEmail;
    });
  }
  validateEmail($email) {
    const emailRegex = /^[a-zA-Z]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test( $email )) {
      return false;
    } else {
      return true;
    }
  }
}
