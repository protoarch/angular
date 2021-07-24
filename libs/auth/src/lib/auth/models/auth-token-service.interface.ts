export interface IAuthTokenServiceInterface {
    saveToken(token: string);

    getToken(): string;

    remove();
}
