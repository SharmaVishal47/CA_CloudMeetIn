/*
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events-main-page',
  templateUrl: './events-main-page.component.html',
  styleUrls: ['./events-main-page.component.css']
})
export class EventsMainPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
*/
import { Component, OnInit } from '@angular/core';
import {AuthServiceLocal} from '../../Auth/auth.service';

@Component({
  selector: 'app-events-main-page',
  templateUrl: './events-main-page.component.html',
  styleUrls: ['./events-main-page.component.css']
})
export class EventsMainPageComponent implements OnInit {

  fullName: string;
  userId: string;
  constructor(private authService: AuthServiceLocal) { }
  ngOnInit() {
    this.fullName = this.authService.getFullName();
    this.userId = this.authService.getUserId();
  }
}
