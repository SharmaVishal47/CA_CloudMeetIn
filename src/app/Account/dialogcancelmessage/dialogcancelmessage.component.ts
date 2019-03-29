import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialogcancelmessage',
  templateUrl: './dialogcancelmessage.component.html',
  styleUrls: ['./dialogcancelmessage.component.css']
})
export class DialogcancelmessageComponent implements OnInit {
  cancelForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<DialogcancelmessageComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.cancelForm = new FormGroup({
      message: new FormControl(null, [Validators.required])
    });
  }
  cancelMeeting()
  {
    this.dialogRef.close(this.cancelForm.value.message);
  }

  buttonBack()
  {
    this.dialogRef.close("false");
  }
}

