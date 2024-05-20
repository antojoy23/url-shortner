import { apiGet } from '@/app/lib/db/database'

import whitelist from 'validator/es/lib/whitelist';

export async function GET(request: Request, { params }: { params: { url_hash: string } }) {
    let santizedUrlHash = whitelist(params.url_hash, "a-zA-Z0-9")
    const urls = await apiGet(`SELECT url from urls where url_hash='${santizedUrlHash}'`)
    if (urls[0]) {
        return Response.redirect(new URL(urls[0].url, request.url))
    }
    return Response.json(
        { success: false, message: 'Invalid url' },
        { status: 404 }
    )
}