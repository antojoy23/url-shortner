import { getUrl, updateUrlVists } from '@/app/lib/db/database';
import whitelist from 'validator/es/lib/whitelist';

export async function GET(request: Request, { params }: { params: { url_hash: string } }) {
    let santizedUrlHash = whitelist(params.url_hash, "a-zA-Z0-9")
    const urls = await getUrl(santizedUrlHash);
    if (urls[0]) {
        await updateUrlVists(santizedUrlHash, urls[0].visits + 1);
        return Response.redirect(new URL(urls[0].url, request.url))
    }
    return Response.json(
        { success: false, message: 'Invalid url' },
        { status: 404 }
    )
}