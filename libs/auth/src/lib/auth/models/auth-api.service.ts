import { Observable } from 'rxjs';

export interface AuthenticationRespose {
	[key: string]: string | undefined | number;

	access_token: string;
	token_type: string;
	id_token?: string;
	refresh_token?: string;
	state?: string;
	expires_in: number;
}

export interface IAuthApiService {
	login: (login: string, password: string) => Observable<AuthenticationRespose>;
	register?: (login: string, password: string) => Observable<AuthenticationRespose>;
	refresh?: (refreshToken: string) => Observable<AuthenticationRespose>;
}
