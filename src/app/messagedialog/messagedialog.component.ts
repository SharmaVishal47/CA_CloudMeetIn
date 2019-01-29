import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-messagedialog',
  templateUrl: './messagedialog.component.html',
  styleUrls: ['./messagedialog.component.css']
})
export class MessagedialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MessagedialogComponent>,@Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {
  }
}
