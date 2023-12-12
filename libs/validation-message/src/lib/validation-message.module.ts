import {NgModule} from '@angular/core';
import {ValidationMessageComponent} from './components/ValidationMessageComponent';
import {ValidationMessageDirective} from './directives/ValidationMessageDirective';
import {ValidationErrorBuilder} from './services/errorBuilder/ValidationErrorBuilder';

export const declarations = [ValidationMessageDirective, ValidationMessageComponent];

@NgModule({
    declarations: declarations,
    exports: declarations,
    providers: [
        ValidationErrorBuilder,
        {
            provide: ValidationMessageComponent,
            useValue: ValidationMessageComponent,
        },
    ],
})
export class ValidationMessageModule {}
