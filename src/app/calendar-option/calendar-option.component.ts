import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef } from "@angular/material";
import {MAT_DIALOG_DATA} from "@angular/material";
import {FormGroup, FormBuilder, FormArray, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-calendar-option',
  templateUrl: './calendar-option.component.html',
  styleUrls: ['./calendar-option.component.css']
})
export class CalendarOptionComponent implements OnInit {
  calendarForm: FormGroup;
  emailFormArray;
  constructor(public dialogRef: MatDialogRef<CalendarOptionComponent>,@Inject(MAT_DIALOG_DATA) public data: Map<string,string>,private fb: FormBuilder) { }

  ngOnInit() {
    this.calendarForm = this.fb.group({
      selectedOption: this.fb.array([], [Validators.required])
    });
  }

  onChange(email: string, isChecked: boolean) {
   const emailFormArray = <FormArray>this.calendarForm.controls.selectedOption;
    if (isChecked) {
      emailFormArray.push(new FormControl(email));
    } else {
      let index = emailFormArray.controls.findIndex(x => x.value == email)
      emailFormArray.removeAt(index);
    }
    this.emailFormArray = emailFormArray;
  }

  checkSelectedData() {
    this.dialogRef.close(this.emailFormArray.value);
  }
}
