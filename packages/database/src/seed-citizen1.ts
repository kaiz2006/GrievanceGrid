import { db } from "./index";
import { users, grievances, departments, teams, audit_logs } from "./schema";
import { eq } from "drizzle-orm";

async function main() {
  const email = "citizen1@example.com";
  console.log(`[seed-citizen1] Seeding 10 grievances for ${email}`);

  // 1. Get User
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    console.error(`User ${email} not found!`);
    process.exit(1);
  }

  // 2. Get Depts and Teams
  const deptList = await db.select().from(departments);
  const teamList = await db.select().from(teams);

  if (deptList.length === 0) {
    console.error("No departments found!");
    process.exit(1);
  }

  const categories = [
    "ROADS", "WATER_SUPPLY", "SANITATION", "ELECTRICITY", 
    "PUBLIC_TRANSPORT", "ENVIRONMENT", "BUILDING_VIOLATION", 
    "INFRASTRUCTURE", "OTHER"
  ] as const;

  const priorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
  const statuses = ["CREATED", "PENDING_ASSIGNMENT", "IN_PROGRESS", "RESOLVED"] as const;

  const categoryToDept: Record<string, string> = {
    ROADS: "PWD",
    WATER_SUPPLY: "WSU",
    SANITATION: "SAN",
    ELECTRICITY: "ELE",
    PUBLIC_TRANSPORT: "TRN",
    ENVIRONMENT: "ENV",
    BUILDING_VIOLATION: "BLD",
    INFRASTRUCTURE: "INF",
    OTHER: "CIV"
  };

  const newGrievances = [];
  const timestamp = Date.now();

  for (let i = 1; i <= 10; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const deptCode = categoryToDept[category];
    const dept = deptList.find(d => d.code === deptCode) || deptList[0];
    
    // Pick a team for this department if exists
    const deptTeams = teamList.filter(t => t.department_id === dept.id);
    const team = deptTeams.length > 0 ? deptTeams[Math.floor(Math.random() * deptTeams.length)] : null;

    const gridId = `GRI-CIT1-${timestamp}-${i}`;

    newGrievances.push({
      grid_id: gridId,
      citizen_id: user.id,
      title: `${category.replace('_', ' ')} issue at Sector ${Math.floor(Math.random() * 50) + 1}`,
      description: `Automatically seeded grievance #${i} for user testing. This is a ${category.toLowerCase()} related issue requiring attention. Captured via citizen portal.`,
      category: category,
      priority: priority,
      status: status,
      assigned_department_id: dept.id,
      assigned_team_id: team?.id || null,
      latitude: (28.4 + Math.random() * 0.1).toFixed(8),
      longitude: (77.0 + Math.random() * 0.1).toFixed(8),
      location_address: `Sector ${Math.floor(Math.random() * 50) + 1}, Zone-${Math.floor(Math.random() * 5) + 1}`,
      created_at: new Date(Date.now() - (10 - i) * 3600000), // Staggered by 1hr
      updated_at: new Date(),
      ai_category: category,
      ai_priority: priority,
      ai_summary: `AI generated summary for grievance #${i}. Potential ${category.toLowerCase()} issue identified.`
    });
  }

  console.log(`[seed-citizen1] Inserting 10 grievances...`);
  const inserted = await db.insert(grievances).values(newGrievances).returning({ id: grievances.id, grid_id: grievances.grid_id });
  
  // Add audit logs for them
  type GrievanceStatus = "CREATED" | "PENDING_CLASSIFICATION" | "PENDING_ASSIGNMENT" | "ASSIGNED" | "IN_PROGRESS" | "PENDING_VERIFICATION" | "VERIFIED" | "RESOLVED" | "ESCALATED" | "CONTESTED" | "CLOSED";

  const logs = inserted.map((g, index) => ({
    grievance_id: g.id,
    event_type: "CREATED",
    new_status: "CREATED" as GrievanceStatus,
    description: "Grievance seeded for user testing",
    metadata: { source: "seed-citizen1" },
    created_at: newGrievances[index].created_at
  }));

  console.log(`[seed-citizen1] Adding audit logs...`);
  await db.insert(audit_logs).values(logs);

  console.log(`[seed-citizen1] Successfully seeded 10 grievances for citizen1@example.com!`);
  console.log(`[seed-citizen1] Grid IDs: ${inserted.map(g => g.grid_id).join(", ")}`);
}

main().catch(console.error).finally(() => process.exit());
