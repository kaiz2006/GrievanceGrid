import { db } from "./index";
import { sql } from "drizzle-orm";

async function main() {
  const r = await db.execute(sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'grievances'`);
  console.log(r.rows.map((row: any) => row.column_name));
}

main().catch(console.error).finally(() => process.exit());
