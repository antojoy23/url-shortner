import path from "path";
import sqlite3 from "sqlite3";
import { migrate } from "./migrations";

export interface Urls {
    id: number,
    url: string,
    url_hash: string,
    uuid?: string,
    visits: number
}

const dbPath = path.join(process.cwd(), "url_shortner.db");
export const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Connected to urls database');
        }
    }
)

migrate();

export const apiGet = async (query: string): Promise<Urls[]> => {
    return await new Promise((resolve, reject) => {
        db.all(query, (err, row: Urls[]) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(row);
        });
    });
};

export const apiPost = async (query: string, values: string[]) => {
    return await new Promise((resolve, reject) => {
        db.run(query, values, function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(null);
        });
    });
};