import {Injectable, Optional} from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {CookieHandler} from '../classes';

@Injectable({
    providedIn: 'root',
})
export class ServerCookieHandlerService implements CookieHandler {
    constructor(@Optional() private cookieService: CookieService) {}

    get(name: string): string {
        return this.cookieService?.get(name) ?? '';
    }

    set(name: string, value: string, domain?: string, expires?: number): void {
        if (this.cookieService) {
            this.cookieService.put(name, value, {
                domain,
                expires: expires
                    ? new Date(new Date().getTime() + expires * 1000 * 60 * 60 * 24)
                    : undefined,
            });
        }
    }
}
