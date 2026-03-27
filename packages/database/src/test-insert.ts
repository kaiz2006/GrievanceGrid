import { db } from "./index";
import { users, grievances, departments, teams } from "./schema";
import { eq } from "drizzle-orm";

async function main() {
  const [user] = await db.select().from(users).limit(1);
  const [dept] = await db.select().from(departments).limit(1);

  if (!user || !dept) return;

  try {
    const data = {
      grid_id: "GRI-TEST-1",
      citizen_id: user.id,
      title: "Test",
      description: "Test",
      category: "ROADS" as any,
      priority: "MEDIUM" as any,
      status: "CREATED" as any,
      latitude: "28.45000000",
      longitude: "77.05000000",
      location_address: "Sector 1",
      ai_category: "ROADS" as any,
      ai_priority: "MEDIUM" as any,
      ai_summary: "Summary",
      damage_severity: "0.50",
      assigned_department_id: dept.id,
      before_photo_url: "url",
      voice_recorded: false,
      embedding_id: "emb-1",
      similar_cases_count: 0,
      created_at: new Date(),
      updated_at: new Date()
    };
    console.log("Inserting grievance...");
    await db.insert(grievances).values(data);
    console.log("Success!");
  } catch (err: any) {
    console.error("FAILED", err.code, err.message);
    if (err.detail) console.log("DETAIL", err.detail);
    if (err.hint) console.log("HINT", err.hint);
  }
}

main().catch(console.error).finally(() => process.exit());
