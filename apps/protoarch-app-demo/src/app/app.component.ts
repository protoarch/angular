import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    selector: 'proto-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'protoarch-app-demo';
}
