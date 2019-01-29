import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {
  settingForm: FormGroup;

  constructor() {
  }

  ngOnInit() {
    this.settingForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      welcome: new FormControl(null, [Validators.required]),
      language: new FormControl(null, [Validators.required]),
      dateFormat: new FormControl(null, [Validators.required]),
      timeFormat: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      timeZone: new FormControl(null, [Validators.required]),
      // Embed: new FormControl(null, [Validators.required]),
    });
  }

  submitForm() {
    console.log(this.settingForm.value)
  }
}
