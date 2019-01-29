/*
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-your-link-component',
  templateUrl: './share-your-link-component.component.html',
  styleUrls: ['./share-your-link-component.component.css']
})
export class ShareYourLinkComponentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
*/

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthServiceLocal} from '../Auth/auth.service';

@Component({
  selector: 'app-share-your-link-component',
  templateUrl: './share-your-link-component.component.html',
  styleUrls: ['./share-your-link-component.component.css']
})
export class ShareYourLinkComponentComponent implements OnInit {
  myForm: FormGroup;
  userId:string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string,private authService: AuthServiceLocal) { }

  ngOnInit() {
    this.userId = window.location.host +'/'+ this.authService.getUserId();
    this.myForm = new FormGroup({
      copyLink: new FormControl(null, [Validators.required]),
      emailLink: new FormControl(null, [Validators.required]),
    });
    this.myForm.patchValue({
      copyLink:this.userId,
      emailLink: this.userId,
    });
  }
}
