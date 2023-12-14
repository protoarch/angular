import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthModule } from '../auth/auth.module';
import { AuthorizeRouterLinkDirective } from './directives/authorize-router-link.directive';
import { AuthorizeRouterGuard } from './guards/authorize-router.guard';
import { AuthorizeRouterService } from './services';

const DIRECTIVES = [AuthorizeRouterLinkDirective];

@NgModule({
    imports: [AuthModule, RouterModule],
    exports: [DIRECTIVES],
    declarations: [DIRECTIVES],
    providers: [AuthorizeRouterGuard, AuthorizeRouterService],
})
export class AuthorizeRouterModule {}
