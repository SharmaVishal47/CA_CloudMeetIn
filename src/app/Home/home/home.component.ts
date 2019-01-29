import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import * as moment from 'moment'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  signUp: FormGroup;
  email: string;
  constructor(private route: ActivatedRoute,private router:Router) { }

  ngOnInit() {
    this.signUp = new FormGroup({
      email: new FormControl(null, [Validators.required])
    });
    this.route.params.subscribe((params: Params) => {
      this.email = params['email'];
      this.signUp.patchValue({email: this.email});
    });
   /* var newYork    = moment.parseZone("2014-06-01 12:00", "America/New_York").date();
    console.log(newYork);*/
  }

  onSubmit() {
    this.router.navigate(['signup/'+this.signUp.value.email]);
  }
}

/*routerLink="/signup"*/
/*this.router.navigate(["availability/"+this.email]);*/
