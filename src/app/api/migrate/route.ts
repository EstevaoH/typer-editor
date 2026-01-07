
import { NextResponse } from "next/server";
import { getTursoClient } from "@/lib/turso";

export async function GET() {
    try {
        const client = getTursoClient();

        // Add columns if they don't exist
        // We use separate try-catch blocks or checks because SQLite doesn't support IF NOT EXISTS for ADD COLUMN directly in standard minimal SQL usually, 
        // but Turso/LibSQL should handle or we can just catch the error if column exists.

        const queries = [
            "ALTER TABLE users ADD COLUMN plan TEXT DEFAULT 'FREE'",
            "ALTER TABLE users ADD COLUMN customer_id TEXT",
            "ALTER TABLE users ADD COLUMN subscription_id TEXT",
            "ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'INACTIVE'"
        ];

        const results = [];
        for (const query of queries) {
            try {
                await client.execute(query);
                results.push({ query, status: "success" });
            } catch (e: any) {
                // Ignore if column already exists
                if (e.message?.includes("duplicate column name")) {
                    results.push({ query, status: "skipped (already exists)" });
                } else {
                    results.push({ query, status: "error", error: e.message });
                }
            }
        }

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
