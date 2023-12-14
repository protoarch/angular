import {
    Directive,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {Subject, Subscription, fromEvent} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {ATTR_AUTHORIZE_CLAIM} from '../../auth.constants';
import {PROMPT_OPTIONS_DEFAULTS} from '../../auth/options-defaults.constants';
import {AUTHORIZE_PROMPT_SETTINGS} from '../auth.tokens';
import {AuthorizePromptOptions} from '../models';
import {AuthorizePromptService} from '../services/authorize-prompt.service';

/**
 * Selectors:
 * authorize: AuthorizeDirective;
 * authorizeControl: AuthorizeControlDirective;
 * authorize-routerLink: AuthorizeRouterLinkDirective;
 * authorize-claim: The attribute, the value of which must equal the claim;
 */
@Directive({
    selector: '[authorize],[authorize-routerLink],[authorize-claim],[authorizeControl]',
})
export class AuthorizePromptDirective implements OnDestroy, OnInit {
    private readonly _ngUnsubscribe$: Subject<void> = new Subject<void>();
    private _intersectionObserver$: IntersectionObserver | undefined;
    private _subscriptionCopy$: Subscription | undefined;

    @Input()
    authorize: string | string[] | undefined;

    @Input()
    authorizeControl: string | string[] | undefined;

    get claims(): string {
        const value =
            this.authorize ??
            this.authorizeControl ??
            this.nativeElement.getAttribute(ATTR_AUTHORIZE_CLAIM);

        return (value instanceof Array ? value : [value]).join(' | ');
    }

    get nativeElement(): HTMLElement {
        return this.elementRef.nativeElement instanceof Element
            ? this.elementRef.nativeElement
            : this.getElementRef(this.elementRef.nativeElement);
    }

    constructor(
        private readonly elementRef: ElementRef,
        private readonly renderer: Renderer2,
        private readonly promptService: AuthorizePromptService,
        private readonly viewContainerRef: ViewContainerRef,
        @Inject(AUTHORIZE_PROMPT_SETTINGS)
        private readonly settings: AuthorizePromptOptions,
    ) {}

    ngOnInit() {
        this.promptService.toggle$
            .pipe(takeUntil(this._ngUnsubscribe$))
            .subscribe(enable => this.togglePrompt(enable));
    }

    ngOnDestroy(): void {
        this._ngUnsubscribe$.next();
        this._ngUnsubscribe$.complete();
        this.unsubscribeObservers();
    }

    private togglePrompt(enable: boolean) {
        if (!this.nativeElement) {
            return;
        }

        if (!enable) {
            this.toggleStyle(this.nativeElement, enable);
            this.unsubscribeObservers();

            return;
        }

        this._subscriptionCopy$ = fromEvent(this.nativeElement, 'click')
            .pipe(
                map(async () => {
                    await navigator.clipboard.writeText(this.claims);
                }),
            )
            .subscribe();

        this._intersectionObserver$ = this.promptService.respondToVisibility(
            this.nativeElement,
            visible => this.toggleStyle(this.nativeElement, visible),
        );
    }

    private toggleStyle(el: HTMLElement, visible: boolean) {
        if (!visible) {
            this.renderer.removeStyle(el, 'outline');
            this.renderer.removeAttribute(el, 'title');

            return;
        }

        // To display the outline if it is a component
        if (
            !(this.elementRef.nativeElement instanceof Element) &&
            !this.elementRef.nativeElement.offsetHeight
        ) {
            const display = window.getComputedStyle(el).getPropertyValue('display');

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            display === 'inline' ? this.renderer.setStyle(el, 'display', 'block') : {};
        }

        this.renderer.setStyle(el, 'outline', this.settings.style ?? PROMPT_OPTIONS_DEFAULTS.style);
        this.renderer.setAttribute(el, 'title', this.claims);
    }

    private unsubscribeObservers() {
        this._intersectionObserver$?.disconnect();
        this._subscriptionCopy$?.unsubscribe();
    }

    /**
     * @param nativeElement parent element
     */
    private getElementRef(nativeElement: HTMLElement): any | null {
        // For structural directive
        if (nativeElement.previousElementSibling) {
            return nativeElement.previousElementSibling;
        }

        // This is the component tag
        const tag = (this.viewContainerRef as any)._hostTNode.tagName;

        return tag ? nativeElement?.parentElement?.querySelector(tag) : null;
    }
}
