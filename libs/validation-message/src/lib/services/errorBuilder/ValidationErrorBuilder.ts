/* eslint-disable no-prototype-builtins */
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';

import {ValidationError} from './ValidationError';

export class ValidationErrorBuilder {
    build(form: FormGroup | FormArray, prevKey?: string): ValidationError[] {
        let validationErrors: ValidationError[] = [];
        const formControls = form.controls;
        for (const key in formControls) {
            if (formControls.hasOwnProperty(key)) {
                const fullKey = prevKey ? [prevKey, key].join('.') : key;
                const ctrl: AbstractControl = (<any>formControls)[key];
                if (ctrl instanceof FormControl) {
                    if (!ctrl.valid) {
                        for (const erKey in ctrl.errors) {
                            if (ctrl.errors.hasOwnProperty(erKey)) {
                                const valError = new ValidationError();
                                valError.control = ctrl;
                                valError.controlKey = fullKey;
                                valError.errorKey = erKey;
                                validationErrors.push(valError);
                            }
                        }
                    }
                } else {
                    const group = <FormGroup | FormArray>ctrl;
                    validationErrors = validationErrors.concat(this.build(group, fullKey));
                }
            }
        }
        return validationErrors;
    }
}
