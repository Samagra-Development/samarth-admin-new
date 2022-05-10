import {getCookie, setCookie} from "./index";

export class StorageService {

    public static get account() {
        return getCookie('account');
    }

    public static get token() {
        return getCookie('token');
    }

    public static set account(_account: string) {
        setCookie('account', _account, 100);
    }

    public static get user() {
        return getCookie('user') && getCookie('user') !== undefined && getCookie('user') !== "undefined" ? JSON.parse(getCookie('user')) : null;
    }

    public static set user(_user: any) {
        setCookie('user', JSON.stringify(_user || ''), 100);
    }

    public static set token(_token: string) {
        setCookie('token', _token, 100);
    }
}
