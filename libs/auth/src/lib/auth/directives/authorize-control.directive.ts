import { Directive, ElementRef, HostBinding, Inject, Input } from '@angular/core';

import { AUTH_SERVICE } from '../auth.tokens';
import { User } from '../models';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[authorizeControl]'
})
export class AuthorizeControlDirective {
  @Input() disabled;
  @HostBinding('attr.disabled') get attrDisabled() {
    return this.disabled ? true : undefined;
  }
  
  constructor(
    private elementRef: ElementRef,
    @Inject(AUTH_SERVICE) private authService: AuthService<User>
  ) {}

  @Input()
  set authorizeControl(claim: string | string[]) {
    if (this.disabled)
      return;
    if (!this.authService.authorize(claim)) {
        this.disabled = true;
        if (typeof(this.elementRef.nativeElement.disabled) !== 'boolean') {
            this.elementRef.nativeElement.style = 'pointer-events: none; opacity: 0.5;';
        }
    }
  }
}
