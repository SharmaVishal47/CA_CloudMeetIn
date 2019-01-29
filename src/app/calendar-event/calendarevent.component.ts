import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-calendarevent',
  templateUrl: './calendarevent.component.html',
  styleUrls: ['./calendarevent.component.css']
})
export class CalendareventComponent implements OnInit {
  calendarForm: FormGroup;
  selectedOption;
  constructor(public dialogRef: MatDialogRef<CalendareventComponent>,@Inject(MAT_DIALOG_DATA) public data: [],private fb: FormBuilder) { }

  ngOnInit() {
    this.calendarForm = this.fb.group({
      eventType: this.fb.array([])
    });
  }

  checkSelectedData() {
    this.dialogRef.close(this.selectedOption);
  }

  checkAnswer(item: string) {
    this.selectedOption = item;
  }
}
