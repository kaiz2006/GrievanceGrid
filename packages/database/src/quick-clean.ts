import { db } from "./index";
import { sql } from "drizzle-orm";

async function quickClean() {
  console.log("🧹 Quick Database Clean");
  
  try {
    console.log("Cleaning database...");
    
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
    
    console.log("✅ Database cleaned!");
  } catch (error) {
    console.error("❌ Clean failed:", error);
  }
}

quickClean();
