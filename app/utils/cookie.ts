import { decrypt, encrypt } from "./crypto"
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers'
import { URL_SHORTNER_COOKIE } from "../api/constants";

interface CheckCookieResult {
    new_cookie: boolean,
    cookie: string,
    decrypted_cookie: string
}

const getCookie = (): string | undefined => {
    const cookieStore = cookies();
    const cookie = cookieStore.get(URL_SHORTNER_COOKIE);
    return cookie?.value;
}

const createCookie = (): { cookie: string, decrypted_value: string } => {
    const uuid = uuidv4();
    return { cookie: encrypt(uuid), decrypted_value: uuid };
}

const setCookie = (cookie: string): void => {
    cookies().set({
        name: URL_SHORTNER_COOKIE,
        value: cookie,
        httpOnly: true,
        secure: true,
        path: '/',
    });
}

const isCookieValid = (cookieValue: string): undefined | string => {
    const decryptedVal = decrypt(cookieValue);
    return decryptedVal;
}

export const checkAndSetCookie = (canSetCookie: boolean = true): CheckCookieResult => {
    let cookie = getCookie();
    let decryptedCookie;
    if (cookie) decryptedCookie = isCookieValid(cookie);

    if (!decryptedCookie && !canSetCookie) return { new_cookie: true, cookie: '', decrypted_cookie: '' }

    if (!cookie || !decryptedCookie) {
        let { cookie: newCookie, decrypted_value } = createCookie();
        setCookie(newCookie);
        decryptedCookie = decrypted_value;
        cookie = newCookie;
    }
    return { new_cookie: false, cookie: cookie, decrypted_cookie: decryptedCookie }
}