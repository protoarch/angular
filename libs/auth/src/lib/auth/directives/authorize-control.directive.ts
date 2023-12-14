import {Directive, ElementRef, HostBinding, Inject, Input} from '@angular/core';
import {AUTH_SERVICE} from '../auth.tokens';
import {User} from '../models';
import {AuthService} from '../services/auth.service';

@Directive({
    selector: '[authorizeControl]',
})
export class AuthorizeControlDirective {
    @Input() disabled = false;
    @HostBinding('attr.disabled') get attrDisabled() {
        return this.disabled ? true : undefined;
    }

    constructor(
        private readonly elementRef: ElementRef,
        @Inject(AUTH_SERVICE) private readonly authService: AuthService<User>,
    ) {}

    @Input()
    set authorizeControl(claim: string | string[]) {
        if (this.disabled) return;
        const authorize = this.authService.authorize(claim);
        if (!authorize) {
            this.disabled = true;
            if (typeof this.elementRef.nativeElement.disabled !== 'boolean') {
                this.elementRef.nativeElement.style = 'pointer-events: none; opacity: 0.5;';
            }
        }
    }
}
