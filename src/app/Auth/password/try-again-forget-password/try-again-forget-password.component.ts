import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-try-again-forget-password',
  templateUrl: './try-again-forget-password.component.html',
  styleUrls: ['./try-again-forget-password.component.css']
})
export class TryAgainForgetPasswordComponent implements OnInit {
 param1;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.param1 = params['email'];
      console.log('Pramas -> '+this.param1 );
    });
  }

}
