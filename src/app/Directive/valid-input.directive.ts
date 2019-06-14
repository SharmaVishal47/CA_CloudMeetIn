import {Directive} from '@angular/core';
import {AbstractControl} from '@angular/forms';

@Directive({
  selector: '[appValidInput]'
})
export class ValidInputDirective {

  constructor() { }
  /* This functions use for validation on the all the input text*/
  static input(control: AbstractControl):{ [key: string]: boolean } | null {
    if(typeof (control.value) === 'string') {
      if (control.value !== undefined && control.value.toString().trim().length === 0) {
        return { 'success': true };
      }
      return null;
    }
    return null;
  }

  /* This functions use for validation on the userid*/
  static userId (control: AbstractControl):{ [key: string]: boolean } | null {
    if( /[^a-zA-Z0-9\-]/.test( control.value ) ) {
      return { 'success': true };
    }
    return null;
  }
}
