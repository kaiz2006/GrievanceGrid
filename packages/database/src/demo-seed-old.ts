#!/usr/bin/env node

/**
 * Demo Seed Script for GrievanceGrid
 * Creates test data matching the LoginPage demo credentials
 */

import * as dotenv from "dotenv";
import { db } from "./index";
import { users, departments, teams, grievances } from "./schema";

dotenv.config({ path: ".env.local" });

async function demoSeed() {
  console.log("[demo-seed] Starting demo database seed...");
  console.log("[demo-seed] Environment:", process.env.NODE_ENV);
  console.log("[demo-seed] Database URL:", process.env.DATABASE_URL ? "SET" : "NOT SET");

  try {
    // Clear existing data
    console.log("[demo-seed] Clearing existing data...");
    await db.execute(`
      TRUNCATE TABLE grievances, users, teams, departments RESTART IDENTITY CASCADE
    `);

    // Insert departments
    console.log("[demo-seed] Inserting departments...");
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
      {
        name: "Public Transport Department",
        code: "PTD",
        description: "Bus services and public transport",
        email: "ptd@grievancegrid.local",
        phone: "+91-1200-000005",
        sla_response_hours: 24,
        sla_resolution_hours: 72,
      },
      {
        name: "Environment Department",
        code: "ENV",
        description: "Environmental issues and pollution control",
        email: "env@grievancegrid.local",
        phone: "+91-1200-000006",
        sla_response_hours: 24,
        sla_resolution_hours: 96,
      },
    ]).returning({ id: departments.id, code: departments.code });

    console.log(`[demo-seed] Inserted ${deptRows.length} departments`);

    // Insert teams
    console.log("[demo-seed] Inserting teams...");
    const teamRows = await db.insert(teams).values([
      {
        department_id: deptRows[0].id, // PWD
        name: "PWD-Response-Team-1",
        description: "Public Works rapid response team",
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
        name: "WSD-Emergency-Team",
        description: "Water Supply emergency response",
        phone: "+91-1400-000002",
        service_area: {
          type: "Polygon",
          coordinates: [[
            [77.1, 28.4], [77.2, 28.4], [77.2, 28.5], [77.1, 28.5], [77.1, 28.4]
          ]],
        },
      },
      {
        department_id: deptRows[2].id, // SND
        name: "SND-Cleaning-Team",
        description: "Sanitation and cleaning team",
        phone: "+91-1400-000003",
        service_area: {
          type: "Polygon",
          coordinates: [[
            [77.2, 28.4], [77.3, 28.4], [77.3, 28.5], [77.2, 28.5], [77.2, 28.4]
          ]],
        },
      },
      {
        department_id: deptRows[3].id, // ELD
        name: "ELD-Line-Team",
        description: "Electricity line maintenance team",
        phone: "+91-1400-000004",
        service_area: {
          type: "Polygon",
          coordinates: [[
            [77.3, 28.4], [77.4, 28.4], [77.4, 28.5], [77.3, 28.5], [77.3, 28.4]
          ]],
        },
      },
    ]).returning({ id: teams.id, department_id: teams.department_id });

    console.log(`[demo-seed] Inserted ${teamRows.length} teams`);

    // Insert users matching demo credentials
    console.log("[demo-seed] Inserting demo users...");
    const userRows = await db.insert(users).values([
      {
        email: "admin1@example.com",
        name: "Admin User",
        role: "ADMIN",
        auth_type: "BASIC",
        password_hash: "$2a$04$examplehash", // In production, use real bcrypt hash
        phone: "+91-98765-43215",
        is_active: true,
      },
      {
        email: "officer1@example.com",
        name: "Officer Rajesh",
        role: "OFFICER",
        auth_type: "BASIC",
        password_hash: "$2a$04$examplehash",
        phone: "+91-98765-43213",
        is_active: true,
      },
      {
        email: "crew1@example.com",
        name: "Crew Member",
        role: "CREW",
        auth_type: "BASIC",
        password_hash: "$2a$04$examplehash",
        phone: "+91-98765-43216",
        is_active: true,
      },
      {
        email: "auditor1@example.com",
        name: "Audit Officer",
        role: "AUDITOR",
        auth_type: "BASIC",
        password_hash: "$2a$04$examplehash",
        phone: "+91-98765-43217",
        is_active: true,
      },
      {
        email: "citizen1@example.com",
        name: "Citizen User",
        role: "CITIZEN",
        auth_type: "BASIC",
        password_hash: "$2a$04$examplehash",
        phone: "+91-98765-43210",
        is_active: true,
      },
      {
        email: "citizen2@example.com",
        name: "Jane Citizen",
        role: "CITIZEN",
        auth_type: "BASIC",
        password_hash: "$2a$04$examplehash",
        phone: "+91-98765-43211",
        is_active: true,
      },
      {
        email: "citizen3@example.com",
        name: "John Citizen",
        role: "CITIZEN",
        auth_type: "BASIC",
        password_hash: "$2a$04$examplehash",
        phone: "+91-98765-43212",
        is_active: true,
      },
    ]).returning({ id: users.id, role: users.role, email: users.email });

    console.log(`[demo-seed] Inserted ${userRows.length} users`);

    // Find specific user IDs for assignment
    const adminUser = userRows.find(u => u.email === "admin1@example.com");
    const officerUser = userRows.find(u => u.email === "officer1@example.com");
    const crewUser = userRows.find(u => u.email === "crew1@example.com");
    const citizen1User = userRows.find(u => u.email === "citizen1@example.com");
    const citizen2User = userRows.find(u => u.email === "citizen2@example.com");
    const citizen3User = userRows.find(u => u.email === "citizen3@example.com");

    // Insert grievances
    console.log("[demo-seed] Inserting grievances...");
    const grievanceRows = await db.insert(grievances).values([
      // Officer-assigned grievances
      {
        grid_id: "GRI-2026-000001",
        citizen_id: citizen1User!.id,
        assigned_officer_id: officerUser!.id,
        assigned_department_id: deptRows[0].id, // PWD
        title: "Broken Road Divider",
        description: "Hazardous debris on Sector 14 flyover causing traffic jams and potential accidents.",
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
        citizen_id: citizen2User!.id,
        assigned_officer_id: officerUser!.id,
        assigned_department_id: deptRows[2].id, // Sanitation
        title: "Garbage Overflow",
        description: "Garbage collection has not happened for 3 days. Bin is overflowing and spreading bad odor.",
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
        before_photo_url: "https://cdn.grievancegrid.local/before/002.jpg",
        voice_recorded: true,
        voice_url: "https://cdn.grievancegrid.local/voice/002.wav",
        embedding_id: "emb-2026-002",
        similar_cases_count: 8,
        created_at: new Date(Date.now() - 172800000), // 2 days ago
        updated_at: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        grid_id: "GRI-2026-000003",
        citizen_id: citizen3User!.id,
        assigned_department_id: deptRows[3].id, // Electricity
        title: "Street Light Failure",
        description: "Entire street light line is down from Pole 12 to 24. Very dark at night causing safety concerns.",
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
        before_photo_url: "https://cdn.grievancegrid.local/before/003.jpg",
        voice_recorded: false,
        embedding_id: "emb-2026-003",
        similar_cases_count: 4,
        created_at: new Date(Date.now() - 259200000), // 3 days ago
        updated_at: new Date(Date.now() - 259200000),
      },
      // Critical grievances
      {
        grid_id: "GRI-2026-000004",
        citizen_id: citizen1User!.id,
        assigned_department_id: deptRows[1].id, // WSD
        title: "Major Pipe Burst",
        description: "Water leaking heavily onto the main road in Sector 10. Traffic disruption and water wastage.",
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
        before_photo_url: "https://cdn.grievancegrid.local/before/004.jpg",
        voice_recorded: true,
        voice_url: "https://cdn.grievancegrid.local/voice/004.wav",
        embedding_id: "emb-2026-004",
        similar_cases_count: 3,
        created_at: new Date(Date.now() - 1800000), // 30 minutes ago
        updated_at: new Date(Date.now() - 1800000),
      },
      {
        grid_id: "GRI-2026-000005",
        citizen_id: citizen2User!.id,
        assigned_department_id: deptRows[0].id, // PWD
        title: "Pothole on Main Highway",
        description: "Large pothole on NH-48 near Sector 27 causing accidents. Immediate repair needed.",
        category: "ROADS",
        priority: "CRITICAL",
        status: "AI_PROCESSED",
        latitude: "28.62000000",
        longitude: "77.25000000",
        location_address: "NH-48 Highway, Sector 27",
        ai_category: "ROADS",
        ai_priority: "CRITICAL",
        ai_summary: "AI analysis: Critical road damage requiring immediate repair",
        damage_severity: "0.85",
        before_photo_url: "https://cdn.grievancegrid.local/before/005.jpg",
        voice_recorded: false,
        embedding_id: "emb-2026-005",
        similar_cases_count: 7,
        created_at: new Date(Date.now() - 3600000), // 1 hour ago
        updated_at: new Date(Date.now() - 3600000),
      },
      // Other grievances
      {
        grid_id: "GRI-2026-000006",
        citizen_id: citizen3User!.id,
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
        before_photo_url: "https://cdn.grievancegrid.local/before/006.jpg",
        voice_recorded: false,
        embedding_id: "emb-2026-006",
        similar_cases_count: 2,
        created_at: new Date(Date.now() - 7200000), // 2 hours ago
        updated_at: new Date(Date.now() - 7200000),
      },
      {
        grid_id: "GRI-2026-000007",
        citizen_id: citizen1User!.id,
        assigned_officer_id: officerUser!.id,
        assigned_department_id: deptRows[1].id, // WSD
        title: "Contaminated Water Supply",
        description: "Water coming from taps is dirty and has unusual smell in Block A.",
        category: "WATER_SUPPLY",
        priority: "HIGH",
        status: "IN_PROGRESS",
        latitude: "28.57000000",
        longitude: "77.12000000",
        location_address: "Residential Block A",
        ai_category: "WATER_SUPPLY",
        ai_priority: "HIGH",
        ai_summary: "AI analysis: Water contamination issue requiring immediate testing",
        damage_severity: "0.70",
        before_photo_url: "https://cdn.grievancegrid.local/before/007.jpg",
        voice_recorded: false,
        embedding_id: "emb-2026-007",
        similar_cases_count: 6,
        created_at: new Date(Date.now() - 7200000), // 2 hours ago
        updated_at: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        grid_id: "GRI-2026-000008",
        citizen_id: citizen2User!.id,
        assigned_department_id: deptRows[4].id, // Public Transport
        title: "Broken Bus Shelter",
        description: "Bus shelter glass is broken and seats are damaged. No protection from rain.",
        category: "PUBLIC_TRANSPORT",
        priority: "NORMAL",
        status: "CREATED",
        latitude: "28.63000000",
        longitude: "77.19000000",
        location_address: "Bus Stop Sector 22",
        ai_category: "PUBLIC_TRANSPORT",
        ai_priority: "NORMAL",
        ai_summary: "AI analysis: Public transport infrastructure damage",
        damage_severity: "0.35",
        before_photo_url: "https://cdn.grievancegrid.local/before/008.jpg",
        voice_recorded: false,
        embedding_id: "emb-2026-008",
        similar_cases_count: 3,
        created_at: new Date(Date.now() - 10800000), // 3 hours ago
        updated_at: new Date(Date.now() - 10800000),
      },
      {
        grid_id: "GRI-2026-000009",
        citizen_id: citizen3User!.id,
        assigned_department_id: deptRows[5].id, // Environment
        title: "Illegal Dumping",
        description: "Construction debris being illegally dumped in open plot near residential area.",
        category: "ENVIRONMENT",
        priority: "NORMAL",
        status: "PENDING_CLASSIFICATION",
        latitude: "28.64000000",
        longitude: "77.16000000",
        location_address: "Open Plot Near Sector 15",
        ai_category: "ENVIRONMENT",
        ai_priority: "NORMAL",
        ai_summary: "AI analysis: Environmental violation - illegal dumping",
        damage_severity: "0.45",
        before_photo_url: "https://cdn.grievancegrid.local/before/009.jpg",
        voice_recorded: true,
        voice_url: "https://cdn.grievancegrid.local/voice/009.wav",
        embedding_id: "emb-2026-009",
        similar_cases_count: 4,
        created_at: new Date(Date.now() - 14400000), // 4 hours ago
        updated_at: new Date(Date.now() - 14400000),
      },
      {
        grid_id: "GRI-2026-000010",
        citizen_id: citizen1User!.id,
        assigned_department_id: deptRows[3].id, // Electricity
        title: "Power Outage",
        description: "Frequent power fluctuations and complete outage in Sector 18 since morning.",
        category: "ELECTRICITY",
        priority: "HIGH",
        status: "ASSIGNED",
        latitude: "28.66000000",
        longitude: "77.13000000",
        location_address: "Sector 18 Commercial Area",
        ai_category: "ELECTRICITY",
        ai_priority: "HIGH",
        ai_summary: "AI analysis: Power supply disruption affecting commercial area",
        damage_severity: "0.65",
        before_photo_url: "https://cdn.grievancegrid.local/before/010.jpg",
        voice_recorded: false,
        embedding_id: "emb-2026-010",
        similar_cases_count: 5,
        created_at: new Date(Date.now() - 5400000), // 1.5 hours ago
        updated_at: new Date(Date.now() - 5400000),
      },
    ]).returning({ id: grievances.id, status: grievances.status, assigned_officer_id: grievances.assigned_officer_id });

    console.log(`[demo-seed] Inserted ${grievanceRows.length} grievances`);

    // Summary
    console.log("\n[demo-seed] ✅ Demo seed completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Departments: ${deptRows.length}`);
    console.log(`   Teams: ${teamRows.length}`);
    console.log(`   Users: ${userRows.length}`);
    console.log(`   Grievances: ${grievanceRows.length}`);
    
    console.log("\n🎯 Demo Credentials (matching LoginPage):");
    console.log("   Admin: admin1@example.com / admin1");
    console.log("   Officer: officer1@example.com / officer1");
    console.log("   Crew: crew1@example.com / crew1");
    console.log("   Auditor: auditor1@example.com / auditor1");
    console.log("   Citizen: citizen1@example.com / citizen1");
    
    console.log("\n🔍 Officer-Assigned Grievances:");
    const officerGrievances = grievanceRows.filter(g => 
      g.assigned_officer_id === officerUser!.id || 
      ["IN_PROGRESS", "ASSIGNED", "ROUTED", "AI_PROCESSED"].includes(g.status) ||
      grievanceRows.find(gr => gr.id === g.id && 
        ["CRITICAL", "HIGH"].includes(grievanceRows.find(gr => gr.id === g.id)?.priority || "NORMAL"))
    );
    console.log(`   Count: ${officerGrievances.length}`);
    
    console.log("\n📋 Grievance Breakdown:");
    const statusCounts = grievanceRows.reduce((acc, g) => {
      acc[g.status] = (acc[g.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });

  } catch (error) {
    console.error("[demo-seed] ❌ Demo seed failed:", error);
    throw error;
  }
}

// Run the seed
if (import.meta.main) {
  demoSeed()
    .then(() => {
      console.log("\n🚀 Demo seeding completed! You can now test the application.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Demo seeding failed:", error);
      process.exit(1);
    });
}

export { demoSeed };
