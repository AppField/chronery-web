import {Injectable} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';

@Injectable()
export class CustomValidators {

  static matchPasswordValidator(control: FormControl): any {
    if (control.parent) {
      const password = control.parent.controls['password'].value;
      const repeatPassword = control.value;
      return password === repeatPassword ? true : {mismatch: true};
    }
    return null;
  }

  static hasLengthEight(control: FormControl): any {
    return (new RegExp('^.{8,}$').test(control.value)) ? true : {mismatchLength: true};
  }

  static containsNumbersValidator(control: FormControl): any {
    return (new RegExp('[0-9]{1,}').test(control.value)) ? true : {missingNumber: true};
  }

  static containsUpperValidator(control: FormControl): any {
    return (new RegExp('[A-Z]{1,}').test(control.value)) ? true : {missingUpper: true};
  }

  static containsLowerValidator(control: FormControl): any {
    return (new RegExp('[a-z]{1,}').test(control.value)) ? true : {missingLower: true};
  }

  static getPasswordErrorMessage(control: AbstractControl): string {
    const mismatchLength = control.hasError('mismatchLength');
    const missingNumber = control.hasError('missingNumber');
    const missingUpper = control.hasError('missingUpper');
    const missingLower = control.hasError('missingLower');

    if (missingNumber && missingUpper && missingLower && mismatchLength) {
      return 'Required';
    } else if (missingNumber) {
      return 'One number is required';
    } else if (missingUpper) {
      return 'One upper letter is required';
    } else if (missingLower) {
      return 'One lower letter is required';
    } else if (mismatchLength) {
      return 'Minimum 8 characters are required';
    }
  }
}
