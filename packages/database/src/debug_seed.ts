import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import { db } from "./index";
import { departments, teams, users, grievances } from "./schema";
import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

async function debug() {
  console.log("Starting debug seed...");
  try {
    // 1. Get a citizen
    const citizen = await db.select().from(users).where(sql`role = 'CITIZEN'`).limit(1);
    if (citizen.length === 0) {
      console.log("No citizens found, seeding one...");
      const newCitizen = await db.insert(users).values({
        email: `debug_citizen_${Date.now()}@example.com`,
        name: "Debug Citizen",
        role: "CITIZEN",
        auth_type: "BASIC",
      }).returning();
      citizen.push(newCitizen[0]);
    }

    // 2. Get a department
    const dept = await db.select().from(departments).limit(1);
    if (dept.length === 0) {
       console.log("No departments found, seeding one...");
       const newDept = await db.insert(departments).values({
         name: "Debug Dept",
         code: "DBG",
       }).returning();
       dept.push(newDept[0]);
    }

    console.log("Inserting one grievance...");
    await db.insert(grievances).values({
      grid_id: `GRI-DEBUG-${Date.now()}`,
      citizen_id: citizen[0].id,
      title: "Debug Grievance",
      description: "Debug description",
      category: "ROADS",
      priority: "MEDIUM",
      status: "CREATED",
      latitude: "28.4",
      longitude: "77.02",
      assigned_department_id: dept[0].id,
      created_at: new Date(),
      updated_at: new Date(),
    });
    console.log("Success!");
  } catch (error: any) {
    console.error("FAILED with error:");
    console.error(error);
    if (error.detail) console.error("Detail:", error.detail);
    if (error.hint) console.error("Hint:", error.hint);
    if (error.where) console.error("Where:", error.where);
  } finally {
    process.exit(0);
  }
}

debug();
