import { db } from './database';

export const migrate = () => {
    db.serialize(() => {
        db.run(
            `
        CREATE TABLE IF NOT EXISTS urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            url_hash VARCHAR(10) NOT NULL UNIQUE,
            uuid VARCHAR(100) NOT NULL,
            visits INTEGER DEFAULT 0 NOT NULL
          );
        `,
            (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log('urls table created successfully');
                }
            }
        );
        db.run(
            `
        CREATE INDEX IF NOT EXISTS idx_url_hash
            ON urls(url_hash);
        `,
            (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log('urls table index created successfully');
                }
            }
        );
        db.run(
            `
        CREATE INDEX IF NOT EXISTS idx_uuid
            ON urls(uuid);
        `,
            (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log('urls table index created successfully');
                }
            }
        )
    })
}