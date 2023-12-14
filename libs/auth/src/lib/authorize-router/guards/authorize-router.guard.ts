import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    RouterStateSnapshot,
} from '@angular/router';
import {AuthorizeRouterService} from '../services/authorize-router.service';

@Injectable()
export class AuthorizeRouterGuard implements CanActivate, CanActivateChild {
    // FIXME: deprecated
    constructor(private readonly authorizeService: AuthorizeRouterService) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const url = state.url.replace(/\([^()]*\)/g, '');
        return await this.authorizeService.authorize(url);
    }

    async canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const data: any = childRoute.data;
        if (data?.authorize?.skip) {
            return true;
        }

        const url = state.url.replace(/\([^()]*\)/g, '');
        return await this.authorizeService.authorize(url);
    }
}
