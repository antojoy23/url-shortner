import { Pool, QueryResult } from 'pg';
export interface Urls extends QueryResult {
    id: number,
    url: string,
    url_hash: string,
    uuid?: string,
    visits: number
}

interface DbPool {
    pool: Pool | null
}

declare global {
    var db: DbPool
}

if (!global.db) {
    global.db = { pool: null };
}

export const runQuery = async (query: string, values: string[] = []): Promise<Urls[] | undefined> => {
    try {
        if (!global.db.pool) {
            const pool = new Pool({
                connectionString: process.env.URL_SHORTNER_POSTGRES_URL,
            });
            console.log('DB POOL CREATED');
            global.db.pool = pool;
        }
        const result = await global.db.pool.query(query, values);
        return result.rows;
    } catch (ex) {
        console.error('Query error ', ex);
    }
}

export const getAllUrls = async (uuid: string): Promise<Urls[]> => {
    const result = await runQuery(`SELECT id, url, url_hash, visits FROM urls where uuid = '${uuid}'`);
    if (!result) return [];
    return result;
}

export const getUrl = async (urlHash: string) => {
    const result = await runQuery(`SELECT url, visits from urls where url_hash='${urlHash}'`);
    if (!result) return []
    return result;
}

export const updateUrlVists = async (urlHash: string, visits: number) => {
    await runQuery(`Update urls set visits=$1 where url_hash=$2`, [visits.toString(), urlHash]);
}

export const getUrlHashWithId = async (urlHash: string, uuid: string) => {
    const result = await runQuery(`SELECT url_hash FROM urls where url_hash = $1 and uuid = $2`, [urlHash, uuid]);
    if (!result) return [];
    return result;
}

export const addUrl = async (url: string, urlHash: string, uuid: string) => {
    const result = runQuery(`INSERT INTO urls (url, url_hash, uuid) values ($1, $2, $3)`, [url, urlHash, uuid]);
    if (!result) return [];
    return result;
}

export const seed = async () => {
    await runQuery(`CREATE TABLE IF NOT EXISTS urls (
        id SERIAL  PRIMARY KEY,
        url TEXT NOT NULL,
        url_hash VARCHAR(50) NOT NULL,
        uuid VARCHAR(100) NOT NULL,
        visits INTEGER DEFAULT 0 NOT NULL
      );`)
    await runQuery(`CREATE INDEX IF NOT EXISTS idx_uuid_url_hash
    ON urls(url_hash, uuid);`);
}