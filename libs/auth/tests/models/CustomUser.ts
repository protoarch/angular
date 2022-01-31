import {User} from '../../src/lib/auth/models';

export class CustomUser extends User {
    // tslint:disable-next-line:variable-name
    public custom_claim?: string;
}
