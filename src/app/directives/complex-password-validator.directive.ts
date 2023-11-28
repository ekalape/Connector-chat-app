import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ComplexPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value?.trim() === "") return null
    const hasUppercase = /[A-Z]/.test(control.value);

    const hasNumber = /[0-9]/.test(control.value);
    const hasSpecialCharacter = /[@|?#!%£]/.test(control.value);

    const errors: ValidationErrors = {};


    if (!hasUppercase) errors['noUpperCaseLetters'] = 'The password should contain uppercase letters';
    if (!hasNumber) errors['noNumber'] = 'The password should contain numbers';
    if (!hasSpecialCharacter) errors['noSpecialCharacter'] = 'The password should contain special characters';
    if (control.value?.length < 8) errors['tooShort'] = 'The password should be minimum 8 symbols length';

    return Object.keys(errors).length > 0 ? { "weakPassword": "Should be minimum 8 symbols, with at least 1 capital letter, 1 digit and 1 special symbol " } : null


  };
}
