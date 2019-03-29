import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog-change-account-password',
  templateUrl: './dialog-change-account-password.component.html',
  styleUrls: ['./dialog-change-account-password.component.css']
})
export class DialogChangeAccountPasswordComponent implements OnInit {
  cancelForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<DialogChangeAccountPasswordComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.cancelForm = new FormGroup({
      currentP: new FormControl(null, [Validators.required]),
      newP: new FormControl(null, [Validators.required]),
      confirmP: new FormControl(null, [Validators.required])
    });
  }
  cancelMeeting()
  {
    this.dialogRef.close(this.cancelForm.value);
  }

  buttonBack()
  {
    this.dialogRef.close("false");
  }
}

