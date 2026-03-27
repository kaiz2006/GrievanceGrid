import { db } from "./index";
import { users, grievances, departments } from "./schema";
import { eq } from "drizzle-orm";

async function main() {
  const [user] = await db.select().from(users).limit(1);
  const [dept] = await db.select().from(departments).limit(1);

  if (!user || !dept) return;

  try {
    const data: any = {
      grid_id: "GRI-TEST-2",
      citizen_id: user.id,
      title: "Test",
      description: "Test",
      category: "ROADS",
      priority: "MEDIUM",
      status: "CREATED",
      latitude: "28.45000000",
      longitude: "77.05000000",
      location_address: "Sector 1",
      assigned_department_id: dept.id,
      contest_audit_id: "audit-1", // THIS MIGHT FAIL
      created_at: new Date(),
      updated_at: new Date()
    };
    console.log("Inserting grievance with contest_audit_id...");
    await db.insert(grievances).values(data);
    console.log("Success!");
  } catch (err: any) {
    console.error("FAILED", err.code, err.message);
  }
}

main().catch(console.error).finally(() => process.exit());
