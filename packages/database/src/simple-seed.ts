#!/usr/bin/env node

/**
 * Simple seed script for GrievanceGrid
 * Only seeds essential data for testing
 */

import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { db } from "./index";
import { users, departments, teams, grievances } from "./schema";

dotenv.config({ path: ".env.local" });

function hashPasswordForSeed(plainText: string): string {
  return bcrypt.hashSync(plainText, 4);
}

async function simpleSeed() {
  console.log("[simple-seed] Starting simple database seed...");

  try {
    // Clear existing data
    console.log("[simple-seed] Clearing existing data...");
    await db.execute(`
      TRUNCATE TABLE grievances, users, teams, departments RESTART IDENTITY CASCADE
    `);

    // Insert departments
    console.log("[simple-seed] Inserting departments...");
    const deptRows = await db.insert(departments).values([
      {
        name: "Public Works Department",
        code: "PWD",
        description: "Roads, infrastructure, and public works",
        email: "pwd@grievancegrid.local",
        phone: "+91-1200-000001",
        sla_response_hours: 24,
        sla_resolution_hours: 72,
      },
      {
        name: "Water Supply Department",
        code: "WSD",
        description: "Water supply and sewage systems",
        email: "wsd@grievancegrid.local",
        phone: "+91-1200-000002",
        sla_response_hours: 12,
        sla_resolution_hours: 48,
      },
      {
        name: "Sanitation Department",
        code: "SND",
        description: "Waste management and sanitation",
        email: "san@grievancegrid.local",
        phone: "+91-1200-000003",
        sla_response_hours: 18,
        sla_resolution_hours: 60,
      },
      {
        name: "Electricity Department",
        code: "ELD",
        description: "Power supply and electrical infrastructure",
        email: "ele@grievancegrid.local",
        phone: "+91-1200-000004",
        sla_response_hours: 6,
        sla_resolution_hours: 24,
      },
    ]).returning({ id: departments.id, code: departments.code });

    console.log(`[simple-seed] Inserted ${deptRows.length} departments`);

    // Insert teams
    console.log("[simple-seed] Inserting teams...");
    const teamRows = await db.insert(teams).values([
      {
        department_id: deptRows[0].id, // PWD
        name: "PWD-Team-1",
        description: "Public Works response team 1",
        phone: "+91-1400-000001",
        service_area: {
          type: "Polygon",
          coordinates: [[
            [77.0, 28.4], [77.1, 28.4], [77.1, 28.5], [77.0, 28.5], [77.0, 28.4]
          ]],
        },
      },
      {
        department_id: deptRows[1].id, // WSD
        name: "WSD-Team-1",
        description: "Water Supply response team 1",
        phone: "+91-1400-000002",
        service_area: {
          type: "Polygon",
          coordinates: [[
            [77.1, 28.4], [77.2, 28.4], [77.2, 28.5], [77.1, 28.5], [77.1, 28.4]
          ]],
        },
      },
    ]).returning({ id: teams.id, department_id: teams.department_id });

    console.log(`[simple-seed] Inserted ${teamRows.length} teams`);

    // Insert users
    console.log("[simple-seed] Inserting users...");
    const userRows = await db.insert(users).values([
      {
        email: "officer1@example.com",
        name: "Rajesh Kumar",
        role: "OFFICER",
        auth_type: "BASIC",
        password_hash: hashPasswordForSeed("officer1"),
        phone: "+91-98765-43213",
        is_active: true,
      },
      {
        email: "admin@example.com",
        name: "System Administrator",
        role: "ADMIN",
        auth_type: "BASIC",
        password_hash: hashPasswordForSeed("admin"),
        phone: "+91-98765-43215",
        is_active: true,
      },
      {
        email: "citizen@example.com",
        name: "John Doe",
        role: "CITIZEN",
        auth_type: "BASIC",
        password_hash: hashPasswordForSeed("citizen"),
        phone: "+91-98765-43210",
        is_active: true,
      },
      {
        email: "citizen2@example.com",
        name: "Jane Smith",
        role: "CITIZEN",
        auth_type: "BASIC",
        password_hash: hashPasswordForSeed("citizen2"),
        phone: "+91-98765-43211",
        is_active: true,
      },
    ]).returning({ id: users.id, role: users.role, email: users.email });

    console.log(`[simple-seed] Inserted ${userRows.length} users`);

    // Insert grievances
    console.log("[simple-seed] Inserting grievances...");
    const grievanceRows = await db.insert(grievances).values([
      {
        grid_id: "GRI-2026-000001",
        citizen_id: userRows[2].id, // citizen@example.com
        assigned_officer_id: userRows[0].id, // officer1@example.com
        assigned_department_id: deptRows[0].id, // PWD
        title: "Broken Road Divider",
        description: "Hazardous debris on Sector 14 flyover causing traffic jams.",
        category: "ROADS",
        priority: "HIGH",
        status: "IN_PROGRESS",
        latitude: "28.60000000",
        longitude: "77.20000000",
        location_address: "Sector 14 Flyover",
        ai_category: "ROADS",
        ai_priority: "HIGH",
        ai_summary: "AI analysis: Road infrastructure damage requiring immediate attention",
        damage_severity: "0.75",
        before_photo_url: "https://cdn.grievancegrid.local/before/001.jpg",
        voice_recorded: false,
        embedding_id: "emb-2026-001",
        similar_cases_count: 5,
        created_at: new Date(Date.now() - 3600000), // 1 hour ago
        updated_at: new Date(Date.now() - 1800000), // 30 minutes ago
      },
      {
        grid_id: "GRI-2026-000002",
        citizen_id: userRows[3].id, // citizen2@example.com
        assigned_department_id: deptRows[1].id, // WSD
        title: "Major Pipe Burst",
        description: "Water leaking heavily onto the main road in Sector 10.",
        category: "WATER_SUPPLY",
        priority: "CRITICAL",
        status: "CREATED",
        latitude: "28.61000000",
        longitude: "77.22000000",
        location_address: "Sector 10 Market",
        ai_category: "WATER_SUPPLY",
        ai_priority: "CRITICAL",
        ai_summary: "AI analysis: Critical water supply infrastructure failure",
        damage_severity: "0.90",
        before_photo_url: "https://cdn.grievancegrid.local/before/002.jpg",
        voice_recorded: true,
        voice_url: "https://cdn.grievancegrid.local/voice/002.wav",
        embedding_id: "emb-2026-002",
        similar_cases_count: 3,
        created_at: new Date(Date.now() - 1800000), // 30 minutes ago
        updated_at: new Date(Date.now() - 1800000),
      },
      {
        grid_id: "GRI-2026-000003",
        citizen_id: userRows[2].id, // citizen@example.com
        assigned_officer_id: userRows[0].id, // officer1@example.com
        assigned_department_id: deptRows[2].id, // Sanitation
        title: "Garbage Overflow",
        description: "Garbage collection has not happened for 3 days. Bin is overflowing.",
        category: "SANITATION",
        priority: "NORMAL",
        status: "ASSIGNED",
        latitude: "28.58000000",
        longitude: "77.15000000",
        location_address: "Main Street, Block C",
        ai_category: "SANITATION",
        ai_priority: "NORMAL",
        ai_summary: "AI analysis: Waste management service delay",
        damage_severity: "0.40",
        before_photo_url: "https://cdn.grievancegrid.local/before/003.jpg",
        voice_recorded: false,
        embedding_id: "emb-2026-003",
        similar_cases_count: 8,
        created_at: new Date(Date.now() - 172800000), // 2 days ago
        updated_at: new Date(Date.now() - 172800000),
      },
      {
        grid_id: "GRI-2026-000004",
        citizen_id: userRows[3].id, // citizen2@example.com
        assigned_department_id: deptRows[3].id, // Electricity
        title: "Street Light Failure",
        description: "Entire street light line is down from Pole 12 to 24. Very dark at night.",
        category: "ELECTRICITY",
        priority: "HIGH",
        status: "ROUTED",
        latitude: "28.65000000",
        longitude: "77.10000000",
        location_address: "Industrial Area Phase II",
        ai_category: "ELECTRICITY",
        ai_priority: "HIGH",
        ai_summary: "AI analysis: Street lighting infrastructure failure",
        damage_severity: "0.60",
        before_photo_url: "https://cdn.grievancegrid.local/before/004.jpg",
        voice_recorded: false,
        embedding_id: "emb-2026-004",
        similar_cases_count: 4,
        created_at: new Date(Date.now() - 259200000), // 3 days ago
        updated_at: new Date(Date.now() - 259200000),
      },
      {
        grid_id: "GRI-2026-000005",
        citizen_id: userRows[2].id, // citizen@example.com
        assigned_department_id: deptRows[2].id, // Sanitation
        title: "Waste Collection Delay",
        description: "Regular waste collection has been delayed for 2 days in residential area.",
        category: "SANITATION",
        priority: "NORMAL",
        status: "PENDING",
        latitude: "28.59000000",
        longitude: "77.18000000",
        location_address: "Residential Block D",
        ai_category: "SANITATION",
        ai_priority: "NORMAL",
        ai_summary: "AI analysis: Waste collection service delay",
        damage_severity: "0.30",
        before_photo_url: "https://cdn.grievancegrid.local/before/005.jpg",
        voice_recorded: false,
        embedding_id: "emb-2026-005",
        similar_cases_count: 2,
        created_at: new Date(Date.now() - 7200000), // 2 hours ago
        updated_at: new Date(Date.now() - 7200000),
      },
    ]).returning({ id: grievances.id, status: grievances.status });

    console.log(`[simple-seed] Inserted ${grievanceRows.length} grievances`);

    // Summary
    console.log("\n[simple-seed] ✅ Simple seed completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Departments: ${deptRows.length}`);
    console.log(`   Teams: ${teamRows.length}`);
    console.log(`   Users: ${userRows.length}`);
    console.log(`   Grievances: ${grievanceRows.length}`);
    
    console.log("\n🎯 Test Credentials:");
    console.log("   Officer: officer1@example.com / officer1");
    console.log("   Admin: admin@example.com / admin");
    console.log("   Citizen: citizen@example.com / citizen");
    
    console.log("\n🔍 Officer-Assigned Grievances:");
    const officerGrievances = grievanceRows.filter(g => 
      ["IN_PROGRESS", "ASSIGNED", "ROUTED"].includes(g.status)
    );
    console.log(`   Count: ${officerGrievances.length}`);

  } catch (error) {
    console.error("[simple-seed] ❌ Seed failed:", error);
    throw error;
  }
}

// Run the seed
if (import.meta.main) {
  simpleSeed()
    .then(() => {
      console.log("\n🚀 Simple seeding completed! You can now test the application.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Simple seeding failed:", error);
      process.exit(1);
    });
}

export { simpleSeed };
