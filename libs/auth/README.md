# @protoarch.angular/auth

AuthModule allows to add authentication/authorization mechanism (based on security token service) to your project.

## Features
- JWT integration
- Custom user support
- Extensibility auth logic (Custom auth service support)
- Available two ways of token storage - via localstorage (by default) or cookie  


## Setup
AuthModule works in pair with JwtModule.

Setup example:
```typescript
    export function jwtOptionsFactory(authTokenService: AuthTokenService) {
        return {
            tokenGetter: () => {
                return authTokenService.getToken();
            },
            allowedDomains: environment.allowedDomains
        };
    }
    // ...
    JwtModule.forRoot({
        jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [AuthTokenService]
        }
    }),
    AuthModule.forRoot({
        oauthRequestParams: {
            client_id: 'your_client_id',
            client_secret: 'some_secret',
            scope: 'your scopes divided with space'
        },
        tokenEndpoint:
            environment.identityServerUrl + AUTH_OPTIONS_DEFAULTS.tokenEndpoint 
    })
```

Options:
```typescript
export interface AuthOptions<T> {
    userType?: new() => T; // User class. default: User
    tokenName?: string; // token storage name. default: 'access_token'
    tokenEndpoint?: string; // token endpoint url. default: '/identity/connect/token'
    oauthRequestParams?: OAuthParams;
}
export interface OAuthParams {
   scope: string;
   client_id: string;
   client_secret: string;
}
```

It is possible to use custom user that extends class User:
```typescript
export class CustomUser extends User {
  public custom_claim: string;
}
```

To access the claim display mode, you need to pass the enableDevHotkey parameter:
```typescript
    AuthModule.forRoot({
        ...,
        { enableDevHotkey: true }
    })
```
To enable the mode, press the key combination Ctrl+F7.

## Usage

### AuthService

AuthService is the main part of authentication and authorization control.

```typescript
@Inject(AUTH_SERVICE) private authService: AuthService<User>
```

```typescript
login(login: string, password: string): Observable<T> // http call for login and update user
logout(): T // logout (clear store and update user$)
authorize(claim: string | string[] = null) // check user claims
getUser(): T // current user entity from store

user$:  BehaviorSubject<T>; // automatically updating user entity
```
### Authorize directive

Checks user claims and removes inner html if user hasn't got specified claim:
```html
<li routerLinkActive="active" *authorize="'app.debtors'">
    content
</li>
```
You might want to hide content for anonymous users:
```html
<li routerLinkActive="active" *authorize>
    content
</li>
```

### AuthorizeControl directive

Checks user claims and set 'disabled' attribute for button/input/form, etc.
```html
<button type="button" authorizeControl="users:roles_EDIT">
    Button
</button>
```
Checks user claims and set 'disabled' attribute and styles (pointer-events, opacity) for span/i
```html
<span authorizeControl="users:list_EDIT">
    X
</span>
```

**You must handle http statuses by your own**. It's project specific. Implement HttpInterceptor and provide it.

reason: <https://limezaim.atlassian.net/browse/KRNL-22>

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private injector: Injector // https://github.com/angular/angular/issues/18224
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authService = this.injector.get(AUTH_SERVICE);
        const router = this.injector.get(Router);
        return next.handle(req)
            .catch(error => {
                if (error && error.status === 401) {
                    authService.logout();
                    router.navigateByUrl('/');
                }
                return throwError(error);
            });
    }
}

```
```typescript
{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
}
```


### Custom AuthService implementation example

```typescript
class CustomAuthService<T extends User> extends AuthService<T> {

    private logoutStatus = false;

    constructor (
        authApi: AuthApiService,
        authTokenService: AuthTokenService,
        jwtHelperService: JwtHelperService,
        @Inject(AUTH_OPTIONS) options: AuthOptions<T>
      ) {
        super(authApi, authTokenService, jwtHelperService, options);
    }

    get getLogoutStatus(): boolean {
        return this.logoutStatus;
    }

    logout() {
      const logoutResult = super.logout();
      this.logoutStatus = true;
      return logoutResult;
    }
}
```
```typescript
    AuthModule.forRoot({ userType: User }, CustomAuthService)
```

## Cookie storage



```typescript
    npm install ngx-cookie@^4.1.2
```

## Commands

Tests
> npm run test
> npm run test:watch

Build
> npm run build

Release
> npm run release
