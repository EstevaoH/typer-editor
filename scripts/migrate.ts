
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load .env from root
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

// Re-implement getTursoClient to avoid import issues with relative paths in this script
const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
    console.error("TURSO_DATABASE_URL not found in .env");
    process.exit(1);
}

const client = createClient({
    url,
    authToken,
});

async function runMigration() {
    const queries = [
        "ALTER TABLE users ADD COLUMN plan TEXT DEFAULT 'FREE'",
        "ALTER TABLE users ADD COLUMN customer_id TEXT",
        "ALTER TABLE users ADD COLUMN subscription_id TEXT",
        "ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'INACTIVE'"
    ];

    console.log("Running migrations...");

    for (const query of queries) {
        try {
            await client.execute(query);
            console.log(`Success: ${query}`);
        } catch (e: any) {
            if (e.message?.includes("duplicate column name")) {
                console.log(`Skipped (already exists): ${query}`);
            } else {
                console.error(`Error executing ${query}:`, e.message);
            }
        }
    }
    console.log("Migration finished.");
}

runMigration();
