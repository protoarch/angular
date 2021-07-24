import { Inject, Injectable } from '@angular/core';
import { fromEvent, ReplaySubject } from 'rxjs';

import { AUTHORIZE_PROMPT_SETTINGS } from '../auth.tokens';
import { AuthorizePromptOptions } from '../models';

@Injectable({providedIn: 'root'})
export class AuthorizePromptService {
    private _enableDev: boolean = false;

    readonly toggle$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        @Inject(AUTHORIZE_PROMPT_SETTINGS)
        private settings: AuthorizePromptOptions,
    ) {
        fromEvent(window, 'keydown').subscribe((e: KeyboardEvent) => {
            if (this.settings.enableDevHotkey && e.ctrlKey && e.key === 'F7') {
                this._enableDev = !this._enableDev;

                this.toggle$.next(this._enableDev);
            }
        });
    }

    respondToVisibility(element, callback): IntersectionObserver {
        if (!element) {
            return;
        }

        let options = {
            root: document.documentElement,
        };

        let observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                callback(!!entry.boundingClientRect.height);
            });
        }, options);

        observer.observe(element);

        return observer;
    }
}
