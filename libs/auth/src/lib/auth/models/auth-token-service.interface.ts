export interface IAuthTokenServiceInterface {
    saveToken(token: string, expires: number | null): void;
    getToken(): string | null;
    remove(): void;
}
