import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    RouterStateSnapshot
} from '@angular/router';
import { AuthorizeRouterService } from '../services/authorize-router.service';

@Injectable()
export class AuthorizeRouterGuard implements CanActivate, CanActivateChild {
    constructor(private authorizeService: AuthorizeRouterService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.authorizeService.authorize(state.url);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (childRoute.data?.authorize?.skip) {
            return true;
        }

        return this.authorizeService.authorize(state.url);
    }
}
