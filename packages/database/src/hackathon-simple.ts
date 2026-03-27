import { db } from "./index";
import { sql } from "drizzle-orm";
import { users, grievances, departments, teams, infrastructure_assets, daily_metrics, sla_timers, audit_logs } from "./schema";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

function hashPasswordForSeed(plainText: string): string {
  return bcrypt.hashSync(plainText, 4);
}

async function hackathonSeed() {
  console.log("🚀 Hackathon Presentation Seeder");
  console.log("=================================");
  
  try {
    // Clear data
    console.log("Cleaning database...");
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

    // Insert departments
    console.log("Inserting departments...");
    const deptRows = await db.insert(departments).values([
      { name: "Public Works Department", code: "PWD", description: "Roads and infrastructure", email: "pwd@grievancegrid.local", phone: "+91-1200-000001", sla_response_hours: 24, sla_resolution_hours: 72 },
      { name: "Water Supply Department", code: "WSD", description: "Water supply and sewage", email: "wsd@grievancegrid.local", phone: "+91-1200-000002", sla_response_hours: 12, sla_resolution_hours: 48 },
      { name: "Sanitation Department", code: "SND", description: "Waste management", email: "snd@grievancegrid.local", phone: "+91-1200-000003", sla_response_hours: 18, sla_resolution_hours: 60 },
      { name: "Electricity Department", code: "ELD", description: "Power supply", email: "eld@grievancegrid.local", phone: "+91-1200-000004", sla_response_hours: 8, sla_resolution_hours: 24 },
      { name: "Public Transport Department", code: "PTD", description: "Bus services", email: "ptd@grievancegrid.local", phone: "+91-1200-000005", sla_response_hours: 16, sla_resolution_hours: 48 },
      { name: "Environment Department", code: "ENV", description: "Environmental protection", email: "env@grievancegrid.local", phone: "+91-1200-000006", sla_response_hours: 24, sla_resolution_hours: 96 }
    ]).returning({ id: departments.id, code: departments.code });

    // Insert teams
    console.log("Inserting teams...");
    await db.insert(teams).values([
      { department_id: deptRows[0].id, name: "PWD-Rapid-Response", description: "Road repair team", phone: "+91-1400-000001" },
      { department_id: deptRows[1].id, name: "WSD-Emergency", description: "Water emergency team", phone: "+91-1400-000002" },
      { department_id: deptRows[2].id, name: "SND-Cleaning", description: "Sanitation team", phone: "+91-1400-000003" },
      { department_id: deptRows[3].id, name: "ELD-Power", description: "Electrical team", phone: "+91-1400-000004" }
    ]);

    // Insert Infrastructure Assets for Predictive Alerts
    console.log("Inserting infrastructure assets...");
    const assetTypes = ["TRANSFORMER", "WATER_PIPE", "ROAD_BRIDGE", "STREET_LIGHT_GRID", "SEWAGE_PUMP"];
    const assets = [];
    for (const dept of deptRows) {
      for (let i = 0; i < 5; i++) {
        assets.push({
          department_id: dept.id,
          asset_type: assetTypes[Math.floor(Math.random() * assetTypes.length)],
          asset_name: `${dept.code}-Asset-${i + 1}`,
          location_lat: (28.5 + Math.random() * 0.3).toFixed(8),
          location_lng: (77.1 + Math.random() * 0.2).toFixed(8),
          complaint_count_7d: Math.floor(Math.random() * 15),
          complaint_count_30d: Math.floor(Math.random() * 50),
          unresolved_count: Math.floor(Math.random() * 10),
          failure_risk_score: (0.1 + Math.random() * 0.85).toFixed(2), // High risk for some
          predicted_failure_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
          is_active: true
        });
      }
    }
    await db.insert(infrastructure_assets).values(assets);

    // Mock password hash - using bcrypt like demo seed
    const hashPassword = (pass: string) => hashPasswordForSeed(pass);

    // Insert users
    console.log("Inserting users for all roles...");
    const userRows = await db.insert(users).values([
      // Admins
      { email: "admin1@example.com", name: "Raj Kumar", role: "ADMIN", auth_type: "BASIC", password_hash: hashPassword("admin1"), phone: "+91-98765-43215", is_active: true },
      { email: "admin2@example.com", name: "Priya Sharma", role: "ADMIN", auth_type: "BASIC", password_hash: hashPassword("admin2"), phone: "+91-98765-43216", is_active: true },
      
      // Officers
      { email: "officer1@example.com", name: "Amit Singh", role: "OFFICER", auth_type: "BASIC", password_hash: hashPassword("officer1"), phone: "+91-98765-43217", is_active: true },
      { email: "officer2@example.com", name: "Sunita Reddy", role: "OFFICER", auth_type: "BASIC", password_hash: hashPassword("officer2"), phone: "+91-98765-43218", is_active: true },
      { email: "officer3@example.com", name: "Vikram Patel", role: "OFFICER", auth_type: "BASIC", password_hash: hashPassword("officer3"), phone: "+91-98765-43219", is_active: true },
      
      // Crew
      { email: "crew1@example.com", name: "Ramesh Kumar", role: "CREW", auth_type: "BASIC", password_hash: hashPassword("crew1"), phone: "+91-98765-43220", is_active: true },
      { email: "crew2@example.com", name: "Anjali Devi", role: "CREW", auth_type: "BASIC", password_hash: hashPassword("crew2"), phone: "+91-98765-43221", is_active: true },
      { email: "crew3@example.com", name: "Mahesh Kumar", role: "CREW", auth_type: "BASIC", password_hash: hashPassword("crew3"), phone: "+91-98765-43222", is_active: true },
      
      // Auditors
      { email: "auditor1@example.com", name: "Kavita Nair", role: "AUDITOR", auth_type: "BASIC", password_hash: hashPassword("auditor1"), phone: "+91-98765-43223", is_active: true },
      { email: "auditor2@example.com", name: "Rohit Sharma", role: "AUDITOR", auth_type: "BASIC", password_hash: hashPassword("auditor2"), phone: "+91-98765-43224", is_active: true },
      
      // Citizens
      { email: "citizen1@example.com", name: "John Citizen", role: "CITIZEN", auth_type: "BASIC", password_hash: hashPassword("citizen1"), phone: "+91-98765-43210", is_active: true },
      { email: "citizen2@example.com", name: "Jane Smith", role: "CITIZEN", auth_type: "BASIC", password_hash: hashPassword("citizen2"), phone: "+91-98765-43211", is_active: true },
      { email: "citizen3@example.com", name: "Robert Johnson", role: "CITIZEN", auth_type: "BASIC", password_hash: hashPassword("citizen3"), phone: "+91-98765-43212", is_active: true },
      { email: "citizen4@example.com", name: "Maria Garcia", role: "CITIZEN", auth_type: "BASIC", password_hash: hashPassword("citizen4"), phone: "+91-98765-43213", is_active: true },
      { email: "citizen5@example.com", name: "David Lee", role: "CITIZEN", auth_type: "BASIC", password_hash: hashPassword("citizen5"), phone: "+91-98765-43214", is_active: true }
    ]).returning({ id: users.id, role: users.role, email: users.email });

    console.log(`Inserted ${userRows.length} users`);

    // Generate grievances
    console.log("Inserting grievances for presentation...");
    const categories = ["ROADS", "WATER_SUPPLY", "SANITATION", "ELECTRICITY", "PUBLIC_TRANSPORT", "ENVIRONMENT", "BUILDING_VIOLATION", "INFRASTRUCTURE", "OTHER"];
    const priorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
    const statuses = ["CREATED", "PENDING_CLASSIFICATION", "PENDING_ASSIGNMENT", "ASSIGNED", "IN_PROGRESS", "PENDING_VERIFICATION", "VERIFIED", "RESOLVED", "ESCALATED", "CONTESTED"];
    const titles = ["Broken road divider", "Pothole causing traffic", "Street light not working", "Water pipe burst", "Garbage overflow", "Illegal dumping", "Power outage", "Broken bus shelter", "Contaminated water", "Noise pollution"];
    
    const citizenUsers = userRows.filter(u => u.role === "CITIZEN");
    const officerUsers = userRows.filter(u => u.role === "OFFICER");
    
    const grievancesBatch = [];
    for (let i = 0; i < 200; i++) {
      const citizenUser = citizenUsers[Math.floor(Math.random() * citizenUsers.length)];
      const officerUser = officerUsers[Math.floor(Math.random() * officerUsers.length)];
      const departmentId = deptRows[Math.floor(Math.random() * deptRows.length)].id;
      
      grievancesBatch.push({
        grid_id: `GRI-2026-${(i + 1).toString().padStart(6, '0')}`,
        citizen_id: citizenUser.id,
        assigned_officer_id: Math.random() > 0.5 ? officerUser.id : null,
        assigned_department_id: departmentId,
        title: titles[Math.floor(Math.random() * titles.length)],
        description: "Issue reported by citizen requiring department attention",
        category: categories[Math.floor(Math.random() * categories.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        latitude: (28.5 + Math.random() * 0.3).toFixed(8),
        longitude: (77.1 + Math.random() * 0.2).toFixed(8),
        location_address: `Sector ${Math.floor(Math.random() * 30) + 1}`,
        ai_category: categories[Math.floor(Math.random() * categories.length)],
        ai_priority: priorities[Math.floor(Math.random() * priorities.length)],
        ai_summary: "AI analyzed grievance",
        damage_severity: (Math.random() * 0.9 + 0.1).toFixed(2),
        before_photo_url: `https://cdn.grievancegrid.local/before/${i}.jpg`,
        voice_recorded: Math.random() > 0.7,
        embedding_id: `emb-2026-${i}`,
        similar_cases_count: Math.floor(Math.random() * 20) + 1,
        created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }

    await db.insert(grievances).values(grievancesBatch as any);

    // Insert Daily Metrics for Trend Analysis
    console.log("Inserting daily metrics...");
    const metrics = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const total = 500 + Math.floor(Math.random() * 500);
      const resolved = Math.floor(total * (0.6 + Math.random() * 0.3));
      
      metrics.push({
        metric_date: date,
        total_grievances: total,
        new_grievances: 20 + Math.floor(Math.random() * 80),
        resolved_grievances: resolved,
        escalated_grievances: Math.floor(total * 0.05),
        contested_grievances: Math.floor(total * 0.02),
        avg_resolution_time_hours: (12 + Math.random() * 48).toFixed(2),
        sla_compliance_rate: (0.75 + Math.random() * 0.2).toFixed(2),
        category_breakdown: {
          "ROADS": Math.floor(total * 0.3),
          "WATER_SUPPLY": Math.floor(total * 0.2),
          "SANITATION": Math.floor(total * 0.15),
          "ELECTRICITY": Math.floor(total * 0.15),
          "OTHER": Math.floor(total * 0.2)
        }
      });
    }
    await db.insert(daily_metrics).values(metrics);

    console.log("\n🎉 Hackathon seeding completed!");
    console.log("\n📊 Dataset Summary:");
    console.log(`   Users: ${userRows.length}`);
    console.log(`   - Admins: ${userRows.filter(u => u.role === 'ADMIN').length}`);
    console.log(`   - Officers: ${userRows.filter(u => u.role === 'OFFICER').length}`);
    console.log(`   - Crew: ${userRows.filter(u => u.role === 'CREW').length}`);
    console.log(`   - Auditors: ${userRows.filter(u => u.role === 'AUDITOR').length}`);
    console.log(`   - Citizens: ${userRows.filter(u => u.role === 'CITIZEN').length}`);
    console.log(`   Departments: ${deptRows.length}`);
    console.log(`   Grievances: ${grievancesBatch.length}`);

    console.log("\n🔑 Demo Credentials:");
    console.log("   Admin: admin1@example.com / admin1");
    console.log("   Officer: officer1@example.com / officer1");
    console.log("   Crew: crew1@example.com / crew1");
    console.log("   Auditor: auditor1@example.com / auditor1");
    console.log("   Citizen: citizen1@example.com / citizen1");

  } catch (error) {
    console.error("❌ Hackathon seeding failed:", error);
  }
}

hackathonSeed();
