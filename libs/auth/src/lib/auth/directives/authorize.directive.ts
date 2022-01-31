import {Directive, Inject, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AUTH_SERVICE} from '../auth.tokens';
import {User} from '../models';
import {AuthService} from '../services/auth.service';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[authorize]',
})
export class AuthorizeDirective {
    private _hasView = false;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        @Inject(AUTH_SERVICE) private authService: AuthService<User>,
    ) {}

    @Input()
    set authorize(claim: string | string[]) {
        const authorized = this.authService.authorize(claim);
        if (authorized && !this._hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this._hasView = true;
        } else if (!authorized && this._hasView) {
            this.viewContainer.clear();
            this._hasView = false;
        }
    }
}
