import { Directive, Inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { AUTH_SERVICE } from '../auth.tokens';
import { User } from '../models';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[authorize]'
})
export class AuthorizeDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Inject(AUTH_SERVICE) private authService: AuthService<User>
  ) {}

  @Input()
  set authorize(claim: string | string[]) {
    const authorized = this.authService.authorize(claim);
    if (authorized && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!authorized && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
