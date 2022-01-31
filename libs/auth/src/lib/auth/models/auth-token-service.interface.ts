export interface IAuthTokenServiceInterface {
    saveToken(token: string): void;
    getToken(): string | null;
    remove(): void;
}
