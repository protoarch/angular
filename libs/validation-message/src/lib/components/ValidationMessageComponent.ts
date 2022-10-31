/* eslint-disable @angular-eslint/component-max-inline-declarations */
/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import {Component, HostBinding, Input, Optional, ViewEncapsulation} from '@angular/core';
import {
    AbstractControl,
    AbstractControlDirective,
    FormControlName,
    FormGroupName,
} from '@angular/forms';

import {ValidationMessage} from './model/ValidationMessage';

@Component({
    selector: 'validation-message',
    template: `
        <div class="error-container">
            {{ firstMessage.key + (firstMessage.params ? '(' + firstMessage.params + ')' : '') }}
        </div>
        <i class="error-icon"></i>
    `,
    styles: [
        `
            validation-message {
                display: none;
                width: 100%;
            }
            validation-message.standalone,
            .ng-dirty.ng-invalid + validation-message {
                display: block;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class ValidationMessageComponent {
    @HostBinding('class.standalone') get standalone(): boolean {
        return this.acd == null;
    }

    @Input() for: AbstractControl = null;

    get messages(): ValidationMessage[] {
        return this.getValidationMessages();
    }

    get firstMessage(): ValidationMessage {
        return this.messages[0] ? this.messages[0] : new ValidationMessage();
    }

    get controlPath(): string {
        if (this.acd == null) return '';
        return this.acd.path.join('.');
    }

    acd: AbstractControlDirective;

    constructor(
        @Optional() public formControlName: FormControlName,
        @Optional() formGroupName: FormGroupName,
    ) {
        this.acd = formControlName || formGroupName;
        if (this.acd != null) this.for = this.acd.control;
    }

    private getValidationMessages(): ValidationMessage[] {
        if (this.for == null || this.for.errors == null) return [];
        const messages: ValidationMessage[] = [];
        const keys = Object.keys(this.for.errors);
        keys.forEach(k => {
            const errValue = this.for.errors[k];
            let params = null;
            if (errValue instanceof Object) params = errValue;
            else if (errValue !== true) {
                params = {};
                params[k] = errValue;
            }
            messages.push(new ValidationMessage(k, params));
        });
        return messages;
    }
}
