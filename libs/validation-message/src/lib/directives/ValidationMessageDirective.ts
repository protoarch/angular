import {
    AfterViewInit,
    ComponentRef,
    Directive,
    Inject,
    OnDestroy,
    Type,
    ViewContainerRef,
} from '@angular/core';

import {ValidationMessageComponent} from './../components/ValidationMessageComponent';

@Directive({
    selector: '[prtValidationMessage]',
})
export class ValidationMessageDirective implements AfterViewInit, OnDestroy {
    private _validationMessageComponent: ComponentRef<ValidationMessageComponent> = null;

    constructor(
        private viewContainer: ViewContainerRef,
        @Inject(ValidationMessageComponent) private vmComp: Type<ValidationMessageComponent>,
    ) {}

    ngAfterViewInit(): void {
        // eslint-disable-next-line @angular-eslint/no-lifecycle-call
        this.ngOnDestroy();
        this._validationMessageComponent = this.viewContainer.createComponent(this.vmComp);
        this._validationMessageComponent.changeDetectorRef.detectChanges();
    }

    ngOnDestroy(): void {
        if (this._validationMessageComponent) {
            this._validationMessageComponent.changeDetectorRef.detach();
        }
    }
}
