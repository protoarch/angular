import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ATTR_AUTHORIZE_CLAIM} from '../../auth.constants';
import {AuthorizeRouterService} from '../services/authorize-router.service';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({selector: '[authorize-routerLink]'})
export class AuthorizeRouterLinkDirective {
    // eslint-disable-next-line accessor-pairs
    @Input()
    set routerLink(value: string | any[]) {
        if (!value) {
            return;
        }

        this.updateView(value).then(() => {});
    }

    get nativeElement(): HTMLElement {
        return this.elementRef.nativeElement instanceof Element
            ? this.elementRef.nativeElement
            : this.elementRef.nativeElement.previousElementSibling;
    }

    constructor(
        private readonly elementRef: ElementRef,
        private readonly renderer: Renderer2,
        private readonly authorizeService: AuthorizeRouterService,
        private readonly route: ActivatedRoute,
    ) {}

    private async updateView(routerLink: string | any[]) {
        const serializeUrl = this.authorizeService.serializeUrl(routerLink, this.route);

        if (await this.authorizeService.authorize(serializeUrl)) {
            const claim = await this.authorizeService.getAppliedPermission(serializeUrl);
            if (claim) {
                this.renderer.setAttribute(this.nativeElement, ATTR_AUTHORIZE_CLAIM, claim);
            }
            return;
        }

        this.renderer.removeChild(
            this.elementRef.nativeElement.parentNode,
            this.elementRef.nativeElement,
        );
    }
}
