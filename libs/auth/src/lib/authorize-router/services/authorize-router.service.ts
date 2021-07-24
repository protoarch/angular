import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router, UrlSegmentGroup } from '@angular/router';

import { CLAIM_FULL_ACCESS, EXCEPTION_ROUTER_LINK, REGEXP_ACCESS_TYPE, REGEXP_ALL_OCCURRENCES, RULES } from '../../auth.constants';
import { AUTH_SERVICE } from '../../auth/auth.tokens';
import { User } from '../../auth/models';
import { AuthService } from '../../auth/services/auth.service';
import { AccessTypeEnum } from '../models';

@Injectable()
export class AuthorizeRouterService {
    constructor(
        @Inject(AUTH_SERVICE)
        private authService: AuthService<User>,
        private router: Router,
    ) {}

    authorize(routerLink: string): boolean {
        if (!this.authService.isAuthenticated()) {
            return false;
        }

        const claims = this.getClaims();

        return (
            claims.includes(CLAIM_FULL_ACCESS) ||
            claims.some(claim => this.claimMatch(claim, routerLink))
        );
    }

    serializeUrl(routerLink: string | any[], route: ActivatedRoute): string {
        routerLink = routerLink instanceof Array ? routerLink : routerLink.match(/.*?\/|.+$/g);
        
        const urlTree = this.router.createUrlTree(routerLink, {
            relativeTo: route,
        });
        urlTree.root.children = { primary: urlTree.root.children.primary };

        return this.router.serializeUrl(urlTree);
    }

    getAppliedClaim(routerLink: string): string {
        const claims = this.getClaims();

        return claims.find(claim => this.claimMatch(claim, routerLink));
    }

    private getClaims(): string[] {
        const currentUser = this.authService.getUser();

        if (!currentUser.claims) {
            return;
        }

        const claims: string[] = currentUser.claims instanceof Array ? currentUser.claims : [currentUser.claims];

        return claims;
    }

    private claimMatch(claim: string, routerLink: string): boolean {
        const template = this.getClaimTemplate(claim);

        routerLink = routerLink.replace(/^\//, '') + '/';

        return !this.hasException(claim) && this.hasAccessType(claim) && !!routerLink.match(new RegExp(`^${template}$`));
    }

    private hasAccessType(claim: string): boolean {
        const type = claim.match(REGEXP_ACCESS_TYPE) ? claim.match(REGEXP_ACCESS_TYPE)[1] : null;

        return type === AccessTypeEnum.read || type === AccessTypeEnum.write;
    }

    private hasException(claim: string): boolean {
        return EXCEPTION_ROUTER_LINK.some(item => claim.match(new RegExp(`\\${item.exception}`)))
    }

    private getClaimUrl(claim: string) {
        return claim.replace(REGEXP_ACCESS_TYPE, '');
    }

    private getClaimTemplate(claim: string) {
        let template = this.getClaimUrl(claim);

        RULES.forEach(item => {
            template = template.replace(item.rule, item.template)

            template += item.rule !== REGEXP_ALL_OCCURRENCES ? '/' : ''
        });

        return template;
    }
}
