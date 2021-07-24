import { Component, ElementRef, Input, NO_ERRORS_SCHEMA, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AUTH_SERVICE, AuthorizeControlDirective, AuthService, User } from '../../src';

@Component({
    template: `
      <button [authorizeControl]="prop">Button</button>
      <span [authorizeControl]="prop">Span</span>
      <button [disabled]="true" [authorizeControl]="prop">Button Disabled</button>
      <button [disabled]="false" [authorizeControl]="prop">Button Enabled</button>`
})
class TestAuthorizeControlComponent {
    @Input() prop = 'clients';
}

export class MockElementRef extends ElementRef {
    constructor() {
        super(null);
    }
}

describe('AuthorizeControlDirective', () => {
    let component: TestAuthorizeControlComponent;
    let fixture: ComponentFixture<TestAuthorizeControlComponent>;

    const authServiceStub: Partial<AuthService<User>> = {
        authorize: function (claim: string | string[] = null) {
            return !!claim;
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AuthorizeControlDirective,
                TestAuthorizeControlComponent
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                TemplateRef,
                ViewContainerRef,
                {provide: ElementRef, useClass: new MockElementRef()},
                {
                    provide: AUTH_SERVICE,
                    useValue: authServiceStub
                }
            ]
        });
        fixture = TestBed.createComponent(TestAuthorizeControlComponent);
        component = fixture.componentInstance;
    });

    it('should create componentAuthorizeControl', () => {
        expect(component).toBeDefined();
    });

    it('should disable control', () => {
        component.prop = '';
        fixture.detectChanges();
        expect(fixture.nativeElement.children[0].disabled).toBe(true);
        expect(fixture.nativeElement.children[1].attributes.disabled.value).toBe('true');
        expect(fixture.nativeElement.children[1].attributes.style.value).toBe('pointer-events: none; opacity: 0.5;');
    });

    it('shouldn\'t disable control', () => {
        component.prop = 'clients';
        fixture.detectChanges();
        expect(fixture.nativeElement.children[0].disabled).toBe(false);
        expect(fixture.nativeElement.children[1].attributes.disabled).toBeUndefined();
        expect(fixture.nativeElement.children[1].attributes.style).toBeUndefined();
    });

    it('shouldn\'t affect on disabling binding (true)', () => {
        component.prop = 'clients';
        fixture.detectChanges();
        expect(fixture.nativeElement.children[2].disabled).toBe(true);
    });

    it('shouldn\'t affect on disabling binding (false)', () => {
        component.prop = 'clients';
        fixture.detectChanges();
        expect(fixture.nativeElement.children[3].attributes.disabled).toBeUndefined();
    });
});
