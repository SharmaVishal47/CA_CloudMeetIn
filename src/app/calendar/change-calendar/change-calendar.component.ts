import { Component, OnInit } from '@angular/core';
import {AuthService} from 'angular-6-social-login';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material';
import {SignUpService} from '../../Auth/sign-up.service';

@Component({
  selector: 'app-change-calendar',
  templateUrl: './change-calendar.component.html',
  styleUrls: ['./change-calendar.component.css']
})
export class ChangeCalendarComponent implements OnInit {


  constructor(
    private socialAuthService: AuthService,
    private router:Router,
    private httpClient: HttpClient,private route: ActivatedRoute,private dialog: MatDialog,private signUpService: SignUpService) { }

  ngOnInit() {

  }

  changeCalendar() {
    this.signUpService.generateGmailAuthUrl();

  }
}
