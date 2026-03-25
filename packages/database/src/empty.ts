#!/usr/bin/env node
/**
 * Empty database tables for local/dev/hackathon reset.
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import { sql } from "drizzle-orm";

import { db } from "./index";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

async function emptyDb(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL;
  console.log("[db:empty] DATABASE_URL loaded:", dbUrl ? "yes" : "no");
  if (dbUrl) {
    console.log("[db:empty] target:", dbUrl.replace(/:[^:@/]+@/, ":***@"));
  }

  if (dbUrl && /prod|production/i.test(dbUrl) && process.env.DB_EMPTY_ALLOW_PROD !== "true") {
    throw new Error(
      "Production-like DATABASE_URL detected. Refusing to empty DB unless DB_EMPTY_ALLOW_PROD=true"
    );
  }

  await db.execute(sql`
    TRUNCATE TABLE
      sessions,
      daily_metrics,
      vector_references,
      infrastructure_assets,
      cluster_members,
      geo_clusters,
      audit_logs,
      verifications,
      sla_timers,
      grievances,
      team_members,
      teams,
      departments,
      users
    RESTART IDENTITY CASCADE
  `);

  console.log("[db:empty] done: all application tables truncated");
}

emptyDb()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[db:empty] failed", error);
    process.exit(1);
  });
