import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { IApiModuleOptions, ISerializer } from './api.options';
import { Api } from './api.service';
import * as ApiTokens from './api.tokens';
import { BlobErrorHttpInterceptor } from './blob-error-http.interceptor';

export function nullSerializerFactory(): ISerializer {
  return {
    serialize: (data) => data,
    deserialize: (data) => data,
  };
}
@NgModule({
  imports: [HttpClientModule],
  providers: [Api],
})
export class ApiModule {
  static forRoot(
    options: IApiModuleOptions = {}
  ): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        Api,
        {
          provide: ApiTokens.API_ENDPOINT,
          useValue: options.endpoint || '',
        },
        options.serializeProvider || {
          provide: ApiTokens.API_SERIALIZER,
          useFactory: nullSerializerFactory,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: BlobErrorHttpInterceptor,
          multi: true,
        },
      ],
    };
  }
}
