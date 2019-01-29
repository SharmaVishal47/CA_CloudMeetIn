import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';

@Component({
  selector: 'app-availbility',
  templateUrl: './availbility.component.html',
  styleUrls: ['./availbility.component.css']
})
export class AvailbilityComponent implements OnInit {
  form: FormGroup;
  dayFormArray: FormArray;
  email: string;
  constructor(private router:Router,private httpClient: HttpClient,private route: ActivatedRoute,private fb: FormBuilder,private dialog: MatDialog) {}
  ngOnInit() {
    this.form = new FormGroup({
      inTime: new FormControl(null,[Validators.required]),
      outTime: new FormControl(null,[Validators.required]),
      selectedOption: this.fb.array([],[Validators.required])
    });

    this.route.params.subscribe((params: Params) => {
      this.email = params['email'];
      console.log("this.email====",this.email);
    });
  }

  updateConfiguration() {
    this.form.value['email'] = this.email;
    console.log("Value=====",this.form.value);
    this.httpClient.post<any>('http://localhost:3000/user/updateConfiguration',this.form.value).subscribe((responseData)=>{
      console.log("responseData====",responseData);
      this.router.navigate(["userRole/"+this.email]);
    },error => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = error;
      this.dialog.open(MessagedialogComponent, dialogConfig);
    });
  }

  onChange(email: string, isChecked: boolean) {
    const emailFormArray = <FormArray>this.form.controls.selectedOption;
    if (isChecked) {
      emailFormArray.push(new FormControl(email));
    } else {
      let index = emailFormArray.controls.findIndex(x => x.value == email)
      emailFormArray.removeAt(index);
    }
    this.dayFormArray = emailFormArray;
  }

  setUpLater() {
    this.router.navigate(["userRole/"+this.email]);
  }
}

/*
routerLink="/dashboard"*/

/*this.router.navigate(["availability/"+this.email]);*/
