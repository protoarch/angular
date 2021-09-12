import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import {GuardData, GuardDataTest} from './interfaces';
import {AbService} from './service';

@Injectable()
export class AbGuard implements CanActivate, CanActivateChild {
    constructor(private router: Router, private service: AbService) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canGoToPage(next, state);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canGoToPage(childRoute, state);
    }

    private flat<T>(arr: any[]): T[] {
      return arr.reduce((flat, next) => flat.concat(next), [])
    }

    private canGoToPage(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const {ab} = next.data as GuardData;
        const tests = ab ? this.flat<GuardDataTest>(ab instanceof Array? ab : [ab]) : [];

        if (!tests.length) {
            return true;
        }

        const testPage = tests.find(n => n.redirectUrls);

        tests?.forEach(({scope, redirectUrls, ...rest}) => {
          if (scope) {
              this.service.setTest(scope, rest);

              if (!testPage) {
                  this.service.emitTestStarted(scope, this.service.getVersion(scope));
              }
          }
        });

        if (!testPage) {
            return true;
        }

        const {versions, scope, redirectUrls} = testPage;

        const v = this.service.getVersion(scope);

        if (redirectUrls) {
            const urlForRedirect = redirectUrls[v];

            if (!urlForRedirect || versions.length !== Object.keys(redirectUrls).length) {
                return true;
            }

            const search = new RegExp(`${urlForRedirect}($|\\?|\\/)`);

            if (state.url.search(search) !== -1) {
                this.service.emitTestStarted(<string>scope, this.service.getVersion(scope));

                return true;
            }

            this.router.navigateByUrl(urlForRedirect);
        }

        return false;
    }
}
