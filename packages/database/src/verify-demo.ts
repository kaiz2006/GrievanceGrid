import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import { sql } from "drizzle-orm";

import { db } from "./index";
import { grievances, users, departments, teams } from "./schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

async function verifyDemoSeed(): Promise<void> {
  console.log("🔍 Verifying demo seed data...\n");

  try {
    // Get total counts
    const totalGrievances = await db.select().from(grievances);
    const totalUsers = await db.select().from(users);
    const totalDepartments = await db.select().from(departments);
    const totalTeams = await db.select().from(teams);
    
    console.log(`📊 Demo Seed Overview:`);
    console.log(`   Total Grievances: ${totalGrievances.length}`);
    console.log(`   Total Users: ${totalUsers.length}`);
    console.log(`   Total Departments: ${totalDepartments.length}`);
    console.log(`   Total Teams: ${totalTeams.length}\n`);

    // Demo credentials verification
    const demoUsers = totalUsers.filter(u => 
      ['admin1@example.com', 'officer1@example.com', 'crew1@example.com', 'auditor1@example.com', 'citizen1@example.com'].includes(u.email)
    );

    console.log(`🎯 Demo Credentials (LoginPage):`);
    demoUsers.forEach(user => {
      console.log(`   ${user.role}: ${user.email} ✅`);
    });

    // User breakdown
    const userBreakdown = totalUsers.reduce((acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(`\n👥 User Breakdown:`);
    Object.entries(userBreakdown).forEach(([role, count]) => {
      console.log(`   ${role}: ${count}`);
    });

    // Status breakdown
    const statusBreakdown = totalGrievances.reduce((acc, g) => {
      acc[g.status] = (acc[g.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(`\n📋 Status Breakdown:`);
    Object.entries(statusBreakdown).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });

    // Priority breakdown
    const priorityBreakdown = totalGrievances.reduce((acc, g) => {
      acc[g.priority] = (acc[g.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(`\n🔥 Priority Breakdown:`);
    Object.entries(priorityBreakdown).forEach(([priority, count]) => {
      console.log(`   ${priority}: ${count}`);
    });

    // Officer assigned grievances
    const officerAssigned = totalGrievances.filter(g => g.assigned_officer_id);
    console.log(`\n👮 Officer Assigned Grievances: ${officerAssigned.length}`);

    // Department breakdown
    const deptBreakdown = totalGrievances.reduce((acc, g) => {
      if (g.assigned_department_id) {
        const dept = totalDepartments.find(d => d.id === g.assigned_department_id);
        const deptName = dept ? dept.name : 'Unknown';
        acc[deptName] = (acc[deptName] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    console.log(`\n🏢 Department Assignment:`);
    Object.entries(deptBreakdown).forEach(([dept, count]) => {
      console.log(`   ${dept}: ${count}`);
    });

    console.log(`\n✅ Demo seed verification completed!`);
    console.log(`\n🎯 Key Metrics for Officer Workflow:`);
    console.log(`   - Active grievances: ${totalGrievances.filter(g => !["RESOLVED", "CLOSED"].includes(g.status)).length}`);
    console.log(`   - Officer workload: ${officerAssigned.length}`);
    console.log(`   - Demo credentials verified: ${demoUsers.length}/5`);

  } catch (error) {
    console.error("❌ Verification failed:", error);
  }
}

verifyDemoSeed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Verification failed", error);
    process.exit(1);
  });
