import {NgModule} from '@angular/core';
import {I18NextModule} from 'angular-i18next';
import {ValidationMessageComponent} from '../../components/ValidationMessageComponent';
import {ValidationMessageModule} from '../../ValidationMessageModule';
import {I18NextValidationMessageComponent} from './I18NextValidationMessageComponent';

const declarations = [I18NextValidationMessageComponent];

export const providers = [
    {
        provide: ValidationMessageComponent,
        useValue: I18NextValidationMessageComponent,
    },
];

@NgModule({
    declarations: declarations,
    entryComponents: declarations,
    exports: [declarations, ValidationMessageModule],
    imports: [I18NextModule, ValidationMessageModule],
    providers: providers,
})
export class I18NextValidationMessageModule {}
