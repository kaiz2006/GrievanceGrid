#!/usr/bin/env node
/**
 * Database seed script for GrievanceGrid
 * Creates initial departments, teams, and sample data
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

// Load environment from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

// Verify environment is loaded
const dbUrl = process.env.DATABASE_URL;
console.log("DATABASE_URL loaded:", dbUrl ? "✓ Found" : "✗ Not found");
if (dbUrl) {
  console.log("URL:", dbUrl.replace(/password[^@]*/, "password:***"));
}

import { db } from "./index";
import {
  users,
  departments,
  teams,
  team_members,
  grievances,
  sla_timers,
} from "./schema";
import { v4 as uuidv4 } from "uuid";

async function seed() {
  console.log("🌱 Starting database seed...\n");

  try {
    // 1. Create Departments
    console.log("📁 Creating departments...");
    const deptResults = await db.insert(departments).values([
      {
        id: uuidv4(),
        name: "Public Works",
        code: "PWD",
        description: "Roads, potholes, street maintenance",
        email: "pwd@grievances.local",
        phone: "+91-1234-567890",
        sla_response_hours: 24,
        sla_resolution_hours: 72,
      },
      {
        id: uuidv4(),
        name: "Water Supply",
        code: "WSU",
        description: "Water leaks, supply issues, contamination",
        email: "wsu@grievances.local",
        phone: "+91-1234-567891",
        sla_response_hours: 12,
        sla_resolution_hours: 48,
      },
      {
        id: uuidv4(),
        name: "Sanitation",
        code: "SAN",
        description: "Garbage collection, sewage, drainage",
        email: "san@grievances.local",
        phone: "+91-1234-567892",
        sla_response_hours: 24,
        sla_resolution_hours: 72,
      },
      {
        id: uuidv4(),
        name: "Electricity",
        code: "ELE",
        description: "Power outages, fallen wires, supply issues",
        email: "ele@grievances.local",
        phone: "+91-1234-567893",
        sla_response_hours: 6,
        sla_resolution_hours: 24,
      },
      {
        id: uuidv4(),
        name: "Transport",
        code: "TRN",
        description: "Public transport, bus routes, stops",
        email: "trn@grievances.local",
        phone: "+91-1234-567894",
        sla_response_hours: 48,
        sla_resolution_hours: 120,
      },
    ]).returning();

    const deptMap: Record<string, string> = {};
    deptResults.forEach((d) => {
      deptMap[d.code] = d.id;
    });
    console.log(`✅ Created ${deptResults.length} departments\n`);

    // 2. Create Teams
    console.log("👥 Creating teams...");
    const teamResults = await db.insert(teams).values([
      {
        id: uuidv4(),
        department_id: deptMap["PWD"],
        name: "PWD Team Alpha",
        description: "Main road maintenance team",
        phone: "+91-9876-543210",
        service_area: {
          type: "Polygon",
          coordinates: [
            [
              [28.5244, 77.1855],
              [28.5244, 77.2155],
              [28.5544, 77.2155],
              [28.5544, 77.1855],
              [28.5244, 77.1855],
            ],
          ],
        },
      },
      {
        id: uuidv4(),
        department_id: deptMap["WSU"],
        name: "Water Team Alpha",
        description: "Water supply maintenance",
        phone: "+91-9876-543211",
      },
      {
        id: uuidv4(),
        department_id: deptMap["SAN"],
        name: "Sanitation Team Alpha",
        description: "Garbage and sewage management",
        phone: "+91-9876-543212",
      },
      {
        id: uuidv4(),
        department_id: deptMap["ELE"],
        name: "Electricity Team Alpha",
        description: "Emergency response team",
        phone: "+91-9876-543213",
      },
    ]).returning();

    const teamMap: Record<string, string> = {};
    teamResults.forEach((t) => {
      teamMap[t.name] = t.id;
    });
    console.log(`✅ Created ${teamResults.length} teams\n`);

    // 3. Create Users
    console.log("👤 Creating users...");
    const userResults = await db.insert(users).values([
      {
        id: uuidv4(),
        email: "citizen@example.com",
        name: "Rajesh Kumar",
        role: "CITIZEN",
        auth_type: "BASIC",
        password_hash: "$2b$10$...", // Placeholder - will be hashed in API
        phone: "+91-9999-111111",
        is_active: true,
      },
      {
        id: uuidv4(),
        email: "officer@example.com",
        name: "Priya Singh",
        role: "OFFICER",
        auth_type: "BASIC",
        password_hash: "$2b$10$...", // Placeholder
        phone: "+91-9999-222222",
        is_active: true,
      },
      {
        id: uuidv4(),
        email: "admin@example.com",
        name: "Dr. Amit Patel",
        role: "ADMIN",
        auth_type: "BASIC",
        password_hash: "$2b$10$...", // Placeholder
        phone: "+91-9999-333333",
        is_active: true,
      },
      {
        id: uuidv4(),
        email: "crew@example.com",
        name: "Mohan Lal",
        role: "CREW",
        auth_type: "BASIC",
        password_hash: "$2b$10$...", // Placeholder
        phone: "+91-9999-444444",
        is_active: true,
      },
    ]).returning();

    const userMap: Record<string, string> = {};
    userResults.forEach((u) => {
      userMap[u.email] = u.id;
    });
    console.log(`✅ Created ${userResults.length} users\n`);

    // 4. Assign team members
    console.log("🔗 Assigning team members...");
    await db.insert(team_members).values([
      {
        id: uuidv4(),
        team_id: teamMap["PWD Team Alpha"],
        user_id: userMap["officer@example.com"],
        role: "LEAD",
      },
      {
        id: uuidv4(),
        team_id: teamMap["PWD Team Alpha"],
        user_id: userMap["crew@example.com"],
        role: "MEMBER",
      },
    ]);
    console.log("✅ Team members assigned\n");

    // 5. Create sample grievances
    console.log("📋 Creating sample grievances...");
    const grievanceResults = await db.insert(grievances).values([
      {
        id: uuidv4(),
        grid_id: "GRI-2026-000001",
        citizen_id: userMap["citizen@example.com"],
        assigned_team_id: teamMap["PWD Team Alpha"],
        assigned_officer_id: userMap["officer@example.com"],
        title: "Large pothole on Main Street",
        description: "There is a dangerous pothole that is causing accidents",
        category: "ROADS",
        priority: "HIGH",
        status: "ASSIGNED",
        latitude: "28.5244",
        longitude: "77.1855",
        location_address: "Main Street, Near Central Market",
        ai_category: "ROADS",
        ai_priority: "HIGH",
        ai_summary: "Major road damage requiring urgent attention",
        damage_severity: "0.85",
        assigned_department_id: deptMap["PWD"],
      },
      {
        id: uuidv4(),
        grid_id: "GRI-2026-000002",
        citizen_id: userMap["citizen@example.com"],
        title: "Water leakage from main pipe",
        description: "Significant water wastage due to pipeline leak",
        category: "WATER_SUPPLY",
        priority: "MEDIUM",
        status: "CREATED",
        latitude: "28.5350",
        longitude: "77.1950",
        location_address: "South Block, Residential Area",
        ai_category: "WATER_SUPPLY",
        ai_priority: "MEDIUM",
        ai_summary: "Water supply infrastructure issue",
        assigned_department_id: deptMap["WSU"],
      },
    ]).returning();

    console.log(`✅ Created ${grievanceResults.length} grievances\n`);

    // 6. Create SLA timers
    console.log("⏱️  Creating SLA timers...");
    const now = new Date();
    const responseDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    const resolutionDeadline = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 72 hours

    const slaTimersData = grievanceResults.flatMap((g) => [
      {
        id: uuidv4(),
        grievance_id: g.id,
        sla_type: "RESPONSE" as const,
        deadline_at: responseDeadline,
        is_breached: false,
      },
      {
        id: uuidv4(),
        grievance_id: g.id,
        sla_type: "RESOLUTION" as const,
        deadline_at: resolutionDeadline,
        is_breached: false,
      },
    ]);

    await db.insert(sla_timers).values(slaTimersData);
    console.log("✅ SLA timers created\n");

    console.log("═══════════════════════════════════════════");
    console.log("✅ Database seeding completed successfully!");
    console.log("═══════════════════════════════════════════\n");

    console.log("📊 Summary:");
    console.log(`  • Departments: ${deptResults.length}`);
    console.log(`  • Teams: ${teamResults.length}`);
    console.log(`  • Users: ${userResults.length}`);
    console.log(`  • Grievances: ${grievanceResults.length}`);
    console.log(`  • SLA Timers: ${grievanceResults.length * 2}\n`);

    console.log("🔑 Test Credentials:");
    console.log("  Citizen:  citizen@example.com");
    console.log("  Officer:  officer@example.com");
    console.log("  Admin:    admin@example.com");
    console.log("  Crew:     crew@example.com\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
