import {Inject, Injectable} from '@angular/core';
import {fromEvent, ReplaySubject} from 'rxjs';
import {AUTHORIZE_PROMPT_SETTINGS} from '../auth.tokens';
import {AuthorizePromptOptions} from '../models';

@Injectable({providedIn: 'root'})
export class AuthorizePromptService {
    private _enableDev = false;

    readonly toggle$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        @Inject(AUTHORIZE_PROMPT_SETTINGS)
        private settings: AuthorizePromptOptions,
    ) {
        fromEvent(window, 'keydown').subscribe((e: any) => {
            if (this.settings.enableDevHotkey && e.ctrlKey && e.key === 'F7') {
                this._enableDev = !this._enableDev;

                this.toggle$.next(this._enableDev);
            }
        });
    }

    respondToVisibility(
        element: HTMLElement,
        callback: (a: boolean) => void,
    ): IntersectionObserver | undefined {
        if (!element) {
            return;
        }

        const options = {
            root: document.documentElement,
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                callback(!!entry.boundingClientRect.height);
            });
        }, options);

        observer.observe(element);

        return observer;
    }
}
