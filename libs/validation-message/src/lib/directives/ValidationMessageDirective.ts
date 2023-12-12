import {
    AfterViewInit,
    ComponentRef,
    Directive,
    Inject,
    OnDestroy,
    Optional,
    Type,
    ViewContainerRef,
} from '@angular/core';
import {FormControlName, NgControl} from '@angular/forms';

import {ValidationMessageComponent} from './../components/ValidationMessageComponent';

@Directive({
    selector: '[formControlName][prtValidationMessage],[formGroupName][prtValidationMessage]',
})
export class ValidationMessageDirective implements AfterViewInit, OnDestroy {
    private _validationMessageComponent: ComponentRef<ValidationMessageComponent> | null = null;

    constructor(
        private viewContainer: ViewContainerRef,
        @Inject(ValidationMessageComponent) private vmComp: Type<ValidationMessageComponent>,
        @Optional() private formControlName: FormControlName,
    ) {}

    ngAfterViewInit(): void {
        // eslint-disable-next-line @angular-eslint/no-lifecycle-call
        this.ngOnDestroy();
        this._validationMessageComponent = this.viewContainer.createComponent(this.vmComp);

        const control: NgControl = this.formControlName;
        this._validationMessageComponent.instance.for = control;
        this._validationMessageComponent.changeDetectorRef.detectChanges();
    }

    ngOnDestroy(): void {
        if (this._validationMessageComponent) {
            this._validationMessageComponent.changeDetectorRef.detach();
        }
    }
}
