import pg = require('pg');

async function migrate() {
    const client = new pg.Client({
        host: 'localhost',
        port: 5432,
        database: 'postgres', // on ne crée pas de base de données spécifique pour l'instant
        user: 'postgres',
        password: 'postgres',
    });

    try {
        await client.connect();

        await client.query(`
            CREATE TABLE IF NOT EXISTS todo_lists (
                id VARCHAR(255) PRIMARY KEY,
                description TEXT NOT NULL,
                name TEXT NOT NULL,
                status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'IN-PROGRESS', 'DONE'))
                );

            CREATE TABLE IF NOT EXISTS todo_items (
                id VARCHAR(255) PRIMARY KEY,
                description TEXT NOT NULL,
                status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'IN-PROGRESS', 'DONE')),
                "user" TEXT,
                list_id VARCHAR(255) REFERENCES todo_lists(id) ON DELETE CASCADE
                );
        `);

        process.exitCode = 0
    } catch(err) {
        console.error(err)
        process.exitCode = 1
    }

    await client.end()
}

migrate()