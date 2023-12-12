import {Inject, Injectable} from '@angular/core';
import {AbstractUserAgentCrawlerDetector} from '../classes';

@Injectable({
    providedIn: 'root',
})
export class ServerCrawlerDetectorService extends AbstractUserAgentCrawlerDetector {
    constructor(@Inject('fixme') private httpRequest: any) {
        // FIXME: Fix SSR Inject Request or create handler
        super();
    }

    protected getUserAgentString(): string {
        if (this.httpRequest) {
            const useAgentHeader = this.httpRequest.headers['user-agent'];
            return Array.isArray(useAgentHeader) ? useAgentHeader[0] : useAgentHeader;
        }
        return '';
    }
}
