import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import { sql } from "drizzle-orm";

import { db } from "./index";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

async function cleanDatabase(): Promise<void> {
  console.log("🧹 Database Cleaner");
  console.log("==================");
  
  try {
    console.log("[clean-db] Connecting to database...");
    
    // Get counts before cleaning
    console.log("\n[clean-db] 📊 Current Database State:");
    try {
      const userCount = await db.execute(sql`SELECT COUNT(*) as count FROM users`);
      const grievanceCount = await db.execute(sql`SELECT COUNT(*) as count FROM grievances`);
      const deptCount = await db.execute(sql`SELECT COUNT(*) as count FROM departments`);
      const teamCount = await db.execute(sql`SELECT COUNT(*) as count FROM teams`);
      
      console.log(`   Users: ${userCount.rows[0].count}`);
      console.log(`   Grievances: ${grievanceCount.rows[0].count}`);
      console.log(`   Departments: ${deptCount.rows[0].count}`);
      console.log(`   Teams: ${teamCount.rows[0].count}`);
    } catch (error) {
      console.log("   Could not fetch counts:", error.message);
    }

    console.log("\n⚠️  WARNING: This will delete ALL data in the database!");
    console.log("🚨 Starting database cleanup...");

    // Clear all data
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

    console.log("[clean-db] ✅ Database cleaned successfully!");
    
    // Verify cleanup
    console.log("\n[clean-db] 📊 Database State After Cleaning:");
    try {
      const userCount = await db.execute(sql`SELECT COUNT(*) as count FROM users`);
      const grievanceCount = await db.execute(sql`SELECT COUNT(*) as count FROM grievances`);
      const deptCount = await db.execute(sql`SELECT COUNT(*) as count FROM departments`);
      const teamCount = await db.execute(sql`SELECT COUNT(*) as count FROM teams`);
      
      console.log(`   Users: ${userCount.rows[0].count}`);
      console.log(`   Grievances: ${grievanceCount.rows[0].count}`);
      console.log(`   Departments: ${deptCount.rows[0].count}`);
      console.log(`   Teams: ${teamCount.rows[0].count}`);
    } catch (error) {
      console.log("   Could not verify cleanup");
    }

    console.log("\n🎯 Database is now empty and ready for fresh seeding!");
    console.log("\n💡 Next steps:");
    console.log("   npm run db:seed:demo      # Add demo data (10 grievances)");
    console.log("   npm run db:seed:bulk      # Add bulk data (900 grievances)");
    console.log("   npm run db:seed:admin      # Add demo + bulk data");

  } catch (error) {
    console.error("[clean-db] ❌ Database cleaning failed:", error);
    throw error;
  }
}

// Run the cleaner
if (import.meta.main) {
  cleanDatabase()
    .then(() => {
      console.log("\n🎉 Database cleaning completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Database cleaning failed:", error);
      process.exit(1);
    });
}
