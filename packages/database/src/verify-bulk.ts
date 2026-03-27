import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import { sql } from "drizzle-orm";

import { db } from "./index";
import { grievances, users } from "./schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

async function verifyBulkData(): Promise<void> {
  console.log("🔍 Verifying bulk grievance data...\n");

  try {
    // Get total counts
    const totalGrievances = await db.select().from(grievances);
    const totalUsers = await db.select().from(users);
    
    console.log(`📊 Database Overview:`);
    console.log(`   Total Grievances: ${totalGrievances.length}`);
    console.log(`   Total Users: ${totalUsers.length}\n`);

    // Status breakdown
    const statusBreakdown = totalGrievances.reduce((acc, g) => {
      acc[g.status] = (acc[g.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(`📋 Status Breakdown:`);
    Object.entries(statusBreakdown)
      .sort(([,a], [,b]) => b - a)
      .forEach(([status, count]) => {
        const percentage = ((count / totalGrievances.length) * 100).toFixed(1);
        console.log(`   ${status}: ${count} (${percentage}%)`);
      });

    // Priority breakdown
    const priorityBreakdown = totalGrievances.reduce((acc, g) => {
      acc[g.priority] = (acc[g.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(`\n🔥 Priority Breakdown:`);
    Object.entries(priorityBreakdown)
      .sort(([,a], [,b]) => b - a)
      .forEach(([priority, count]) => {
        const percentage = ((count / totalGrievances.length) * 100).toFixed(1);
        console.log(`   ${priority}: ${count} (${percentage}%)`);
      });

    // Category breakdown
    const categoryBreakdown = totalGrievances.reduce((acc, g) => {
      acc[g.category] = (acc[g.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(`\n📂 Category Breakdown:`);
    Object.entries(categoryBreakdown)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        const percentage = ((count / totalGrievances.length) * 100).toFixed(1);
        console.log(`   ${category}: ${count} (${percentage}%)`);
      });

    // Officer assigned grievances
    const officerAssigned = totalGrievances.filter(g => g.assigned_officer_id);
    console.log(`\n👮 Officer Assigned Grievances: ${officerAssigned.length} (${((officerAssigned.length / totalGrievances.length) * 100).toFixed(1)}%)`);

    // Recent grievances (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
    const recentGrievances = totalGrievances.filter(g => new Date(g.created_at) > sevenDaysAgo);
    console.log(`\n🕐 Recent Grievances (7 days): ${recentGrievances.length} (${((recentGrievances.length / totalGrievances.length) * 100).toFixed(1)}%)`);

    // High priority unresolved
    const highPriorityUnresolved = totalGrievances.filter(g => 
      g.priority === "CRITICAL" || g.priority === "HIGH"
    ).filter(g => 
      !["RESOLVED", "CLOSED"].includes(g.status)
    );
    console.log(`\n⚠️  High Priority Unresolved: ${highPriorityUnresolved.length} (${((highPriorityUnresolved.length / totalGrievances.length) * 100).toFixed(1)}%)`);

    console.log(`\n✅ Admin dashboard is ready with ${totalGrievances.length} grievances for testing!`);
    console.log(`\n🎯 Key Metrics for Dashboard Testing:`);
    console.log(`   - Active grievances: ${totalGrievances.filter(g => !["RESOLVED", "CLOSED"].includes(g.status)).length}`);
    console.log(`   - Critical issues: ${totalGrievances.filter(g => g.priority === "CRITICAL").length}`);
    console.log(`   - Officer workload: ${officerAssigned.length}`);
    console.log(`   - Recent activity: ${recentGrievances.length}`);

  } catch (error) {
    console.error("❌ Verification failed:", error);
  }
}

verifyBulkData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Verification failed", error);
    process.exit(1);
  });
