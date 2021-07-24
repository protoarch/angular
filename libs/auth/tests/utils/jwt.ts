import * as jwt from 'jsonwebtoken';

export function generateToken() {
        const now = new Date();
        const expiresIn = 3600;
        const expiration = now.getTime() + expiresIn;
        const payload = {
            'iss': 'http://192.168.1.210:20011/identity',
            'aud': 'http://192.168.1.210:20011/identity/resources',
            'exp': expiration, // 1511155508
            'nbf': 1511151908,
            'client_id': 'ClientAPI',
            'scope': 'ClientApiScope',
            'sub': '191f170d-3b90-4e6d-803f-34034458212e',
            'auth_time': 1511151908,
            'idp': 'idsrv',
            'preferred_username': '79119111113',
            'user_client_id': '43',
            'name': 'Иван Иванов',
            'given_name': 'Иван',
            'family_name': 'Иванов',
            'father_name': 'Иванович',
            'custom_claim': 'custom_claim',
            'role': 'client',
            'amr': [
                'password'
            ]
        };
        const token = jwt.sign(payload, 'secretPassword');
        return {
            'access_token': token,
            'expires_in': expiresIn,
            'token_type': 'Bearer'
        };
}
