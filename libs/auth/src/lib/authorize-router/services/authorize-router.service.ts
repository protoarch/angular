import {Inject, Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
    EXCEPTION_ROUTER_LINK,
    PERMISSION_FULL_ACCESS,
    REGEXP_ACCESS_TYPE,
    REGEXP_ALL_OCCURRENCES,
    RULES,
} from '../../auth.constants';

import {AUTH_SERVICE} from '../../auth/auth.tokens';
import {User} from '../../auth/models';
import {AuthService} from '../../auth/services/auth.service';
import {AccessTypeEnum} from '../models';

@Injectable()
export class AuthorizeRouterService {
    constructor(
        @Inject(AUTH_SERVICE)
        private readonly authService: AuthService<User>,
        private readonly router: Router,
    ) {}

    async authorize(routerLink: string): Promise<boolean> {
        const perms = await this.getPermissions();

        return (
            perms.includes(PERMISSION_FULL_ACCESS) ||
            perms.some(p => this.permsMatch(p, routerLink)) ||
            false
        );
    }

    serializeUrl(routerLink: string | any[] | null | undefined, route: ActivatedRoute): string {
        routerLink = routerLink instanceof Array ? routerLink : routerLink?.match(/.*?\/|.+$/g);
        if (!routerLink) {
            return '';
        }

        const urlTree = this.router.createUrlTree(routerLink, {
            relativeTo: route,
        });
        urlTree.root.children = {primary: urlTree.root.children['primary']};

        return this.router.serializeUrl(urlTree);
    }

    async getAppliedPermission(routerLink: string) {
        const perms = await this.getPermissions();
        return perms.find(p => this.permsMatch(p, routerLink));
    }

    private async getPermissions() {
        const currentUser = await this.authService.getUser();
        return [...(currentUser.permissions ?? [])];
    }

    private permsMatch(claim: string, routerLink: string): boolean {
        const template = this.getClaimTemplate(claim);

        routerLink = routerLink.replace(/^\//, '') + '/';

        return (
            !this.hasException(claim) &&
            this.hasAccessType(claim) &&
            !!routerLink.match(new RegExp(`^${template}$`))
        );
    }

    private hasAccessType(claim: string): boolean {
        let type;
        const match = claim.match(REGEXP_ACCESS_TYPE);
        if (match) {
            type = match[1];
        } else {
            type = null;
        }

        return type === AccessTypeEnum.read || type === AccessTypeEnum.write;
    }

    private hasException(claim: string): boolean {
        return EXCEPTION_ROUTER_LINK.some(item => claim.match(new RegExp(`\\${item.exception}`)));
    }

    private getClaimUrl(claim: string) {
        return claim.replace(REGEXP_ACCESS_TYPE, '');
    }

    private getClaimTemplate(claim: string) {
        let template = this.getClaimUrl(claim);

        RULES.forEach(item => {
            template = template.replace(item.rule, item.template);

            template += item.rule !== REGEXP_ALL_OCCURRENCES ? '/' : '';
        });

        return template;
    }
}
