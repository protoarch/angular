export class ValidationMessage {
    public key = '';
    public params: any;

    constructor(key: string = '', params: any = null) {
        this.key = key;
        this.params = params;
    }
}
