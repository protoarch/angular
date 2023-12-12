import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {ValidationMessageComponent} from '@protoarch.angular/validation-message';
import {I18NEXT_NAMESPACE} from 'angular-i18next';

@Component({
    selector: 'i18next-validation-message',
    template: `
        <div class="error-container">{{ i18nextKey | i18nextCap: firstMessage.params }}</div>
        <i class="error-icon"></i>
    `,
    styles: [
        `
            i18next-validation-message {
                display: none;
                width: 100%;
                position: relative;
            }
            i18next-validation-message.standalone,
            .ng-dirty.ng-invalid + i18next-validation-message {
                display: block;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class I18NextValidationMessageComponent extends ValidationMessageComponent {
    private _validationString = 'validation';

    constructor(@Inject(I18NEXT_NAMESPACE) private i18nextNamespace: string | string[]) {
        super();
    }

    get i18nextKey(): string | string[] {
        if (!this.firstMessage.key) return '';

        const specificKey = [
            this._validationString,
            ['control_specific', this.controlPath, this.firstMessage.key].join('.'),
        ].join(':');
        const commonKey = [this._validationString, this.firstMessage.key].join(':');

        const i18nextKeys = [];

        if (this.i18nextNamespace && this.i18nextNamespace !== this._validationString) {
            i18nextKeys.push([this.i18nextNamespace, specificKey].join('.'));
            i18nextKeys.push([this.i18nextNamespace, commonKey].join('.'));
        }
        i18nextKeys.push(specificKey);
        i18nextKeys.push(commonKey);

        return i18nextKeys;
    }
}
