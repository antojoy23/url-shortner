import { Urls, addUrl, getAllUrls, getUrlHashWithId } from '@/app/lib/db/database';
import isURL from 'validator/es/lib/isURL';
import { getHash } from '../utils/crypto';
import { checkAndSetCookie } from '../utils/cookie';

export async function GET() {
    let urls: Urls[] = []
    let { new_cookie, decrypted_cookie } = checkAndSetCookie(false);
    if (!new_cookie) urls = await getAllUrls(decrypted_cookie);
    return Response.json({ urls: urls })
}

export async function POST(request: Request) {
    const data = await request.json();
    const { url } = data;
    if (isURL(url)) {
        const urlHash = (await getHash(url)).substring(0, 15);
        let { decrypted_cookie } = checkAndSetCookie();
        try {
            const urls = await getUrlHashWithId(urlHash, decrypted_cookie);
            console.log('/URLS ', urls);
            if (urls.length > 0) {
                return Response.json({ status: "error", error: 'duplicate_entry', url: urls[0] })
            } else {
                await addUrl(url, urlHash, decrypted_cookie);
            }
        } catch (err) {
            // TODO: Move error types to constants
            return Response.json({ status: "error", error: 'unknown_error' })
        }
        return Response.json({ status: "ok", hash: urlHash });
    } else {
        return Response.json({ status: 'error', message: "Url is not valid" });
    }
}