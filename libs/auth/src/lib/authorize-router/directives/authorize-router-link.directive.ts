import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ATTR_AUTHORIZE_CLAIM } from '../../auth.constants';
import { AuthorizeRouterService } from '../services/authorize-router.service';

@Directive({selector: '[authorize-routerLink]'})
export class AuthorizeRouterLinkDirective {
    @Input()
    set routerLink(value: string | any[]) {
        if (!value) {
            return;
        }

        this.updateView(value);
    }

    get nativeElement(): HTMLElement {
        return this.elementRef.nativeElement instanceof Element
            ? this.elementRef.nativeElement
            : this.elementRef.nativeElement['previousElementSibling'];
    }

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private authorizeService: AuthorizeRouterService,
        private route: ActivatedRoute,
    ) {}

    private updateView(routerLink: string | any[]) {
        const serializeUrl = this.authorizeService.serializeUrl(routerLink, this.route);

        if (this.authorizeService.authorize(serializeUrl)) {
            const claim = this.authorizeService.getAppliedClaim(serializeUrl);

            this.renderer.setAttribute(this.nativeElement, ATTR_AUTHORIZE_CLAIM, claim);

            return;
        }

        this.renderer.removeChild(
            this.elementRef.nativeElement.parentNode,
            this.elementRef.nativeElement,
        );
    }
}
