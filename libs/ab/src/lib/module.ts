import {ModuleWithProviders, NgModule} from '@angular/core';
import {CookieHandler, CrawlerDetector, RandomExtractor} from './classes';
import {ABVersionDirective} from './directive';
import {AbGuard} from './guard';
import {CONFIG} from './injection-tokens';
import {AbPipe} from './pipe';
import {AbService} from './service';
import {ABOptions} from './interfaces';

@NgModule({
    declarations: [ABVersionDirective, AbPipe],
    exports: [ABVersionDirective, AbPipe],
})
export class AbModule {
    static forRoot(configs?: ABOptions[]): ModuleWithProviders<AbModule> {
        return {
            ngModule: AbModule,
            providers: [
                AbService,
                {provide: CONFIG, useValue: configs || []},
                CookieHandler,
                CrawlerDetector,
                RandomExtractor,
                AbGuard,
            ],
        };
    }
}
