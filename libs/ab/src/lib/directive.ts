import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AbService } from './service';

@Directive({
  selector: '[prtAbVersion]',
})
export class ABVersionDirective implements OnInit {
  private _versions: string[];
  private _scope: string;
  private _forCrawlers = false;

  constructor(
    private _service: AbService,
    private _viewContainer: ViewContainerRef,
    private _templateRef: TemplateRef<any>
  ) {}

  ngOnInit() {
    if (
      this._service.shouldRender(this._versions, this._scope, this._forCrawlers)
    ) {
      this._viewContainer.createEmbeddedView(this._templateRef);
    }
  }

  @Input()
  set prtAbVersion(value: string) {
    this._versions = value.split(',');
  }

  @Input()
  set prtAbVersionScope(value: string) {
    this._scope = value;
  }

  @Input()
  set prtAbVersionForCrawlers(value: boolean) {
    this._forCrawlers = value;
  }
}
