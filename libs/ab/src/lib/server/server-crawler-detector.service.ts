import {Inject, Injectable} from '@angular/core';
import {REQUEST} from '@nguniversal/express-engine/tokens';
import {AbstractUserAgentCrawlerDetector} from '../classes';

@Injectable({
    providedIn: 'root',
})
export class ServerCrawlerDetectorService extends AbstractUserAgentCrawlerDetector {
    constructor(@Inject(REQUEST) private httpRequest: any) {
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
