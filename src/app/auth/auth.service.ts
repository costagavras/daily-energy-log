import { Subject } from 'rxjs';

import { User } from './user.model';
import { AuthData } from './auth-data.model';

export class AuthService {
    authChange = new Subject<boolean>();
    private user: User;

    registerUser(authData: AuthData) {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 1000).toString()
        };
        this.authChange.next(true); // true because boolean payload (true to registered user)
    }

    login(authData: AuthData) {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 1000).toString()
        };
        this.authChange.next(true); // true because boolean payload (true to registered user)
    }

    logout() {
        this.user = null;
        this.authChange.next(false); // true because boolean payload (true to registered user)
    }

    getUser() {
        return {...this.user};
    }

    isAuth() {
        return this.user !== null;
    }

}
