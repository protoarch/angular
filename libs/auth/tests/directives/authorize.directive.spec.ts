import { Component, ElementRef, Input, NO_ERRORS_SCHEMA, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AUTH_SERVICE, AuthorizeDirective, AuthService, User } from '../../src';

@Component({
    template: `
      <div *authorize="prop">content</div>`
})
class TestAuthorizeComponent {
    @Input() prop = '';
}


describe('AuthorizeDirective', () => {
    let component: TestAuthorizeComponent;
    let fixture: ComponentFixture<TestAuthorizeComponent>;

    const authServiceStub: Partial<AuthService<User>> = {
        authorize: function (claim: string | string[] = null) {
            return !!claim;
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AuthorizeDirective,
                TestAuthorizeComponent
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: AUTH_SERVICE,
                    useValue: authServiceStub
                }
            ]
        });
        fixture = TestBed.createComponent(TestAuthorizeComponent);
        component = fixture.componentInstance;
    });

    it('should create componentAuthorize', () => {
        expect(component).toBeDefined();
    });

    it('should show content initially', () => {
        component.prop = 'value';
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).not.toBe('');
    });

    it('should hide content initially', () => {
        component.prop = 'value';
        component.prop = '';
        fixture.detectChanges();
        expect(fixture.nativeElement.children.length).toBe(0);
    });

    it('should show/hide content dynamically', () => {
        component.prop = 'value';
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).not.toBe('');
        component.prop = '';
        fixture.detectChanges();
        expect(fixture.nativeElement.children.length).toBe(0);
    });

});
