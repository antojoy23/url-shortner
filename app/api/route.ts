import { Urls, apiGet, apiPost } from '@/app/lib/db/database';
import isURL from 'validator/es/lib/isURL';
import { getHash } from '../utils/crypto';
import { checkAndSetCookie } from '../utils/cookie';

export async function GET() {
    let urls: Urls[] = []
    let { new_cookie, decrypted_cookie } = checkAndSetCookie(false);
    if (!new_cookie) urls = await apiGet(`SELECT id, url, url_hash, visits FROM urls where uuid = '${decrypted_cookie}'`);
    return Response.json({ urls: urls })
}

export async function POST(request: Request) {
    const data = await request.json();
    const { url } = data;
    if (isURL(url)) {
        const urlHash = (await getHash(url)).substring(0, 15);
        let { decrypted_cookie } = checkAndSetCookie();
        await apiPost(`INSERT INTO urls (url, url_hash, uuid) values (?, ?, ?)`, [url, urlHash, decrypted_cookie]);
        return Response.json({ status: "ok", hash: urlHash });
    } else {
        return Response.json({ status: 'error', message: "Url is not valid" });
    }
}