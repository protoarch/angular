import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgControl} from '@angular/forms';
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
    @Input() for: NgControl | null = null;

    get messages(): ValidationMessage[] {
        return this.getValidationMessages();
    }

    get firstMessage(): ValidationMessage {
        return this.messages[0] ? this.messages[0] : new ValidationMessage();
    }

    get controlPath(): string {
        if (this.for == null) return '';
        return this.for.path?.join('.') || '';
    }

    private getValidationMessages(): ValidationMessage[] {
        if (this.for == null || this.for.errors == null) return [];
        const messages: ValidationMessage[] = [];
        const keys = Object.keys(this.for.errors);
        keys.forEach(k => {
            const errValue = (<any>this.for?.errors)[k];
            let params = null;
            if (errValue instanceof Object) params = errValue;
            else if (errValue !== true) {
                params = {};
                (<any>params)[k] = errValue;
            }
            messages.push(new ValidationMessage(k, params));
        });
        return messages;
    }
}
