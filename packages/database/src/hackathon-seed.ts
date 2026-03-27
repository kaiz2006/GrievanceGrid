import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import { sql } from "drizzle-orm";

import { db } from "./index";
import { users, grievances, departments, teams } from "./schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

// Mock data generators
const generateGridId = () => `GRI-2026-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

// Comprehensive data for hackathon presentation
const CATEGORIES = ["ROADS", "WATER_SUPPLY", "SANITATION", "ELECTRICITY", "PUBLIC_TRANSPORT", "ENVIRONMENT", "BUILDING_VIOLATION", "INFRASTRUCTURE", "OTHER"] as const;
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
const STATUSES = ["CREATED", "PENDING_CLASSIFICATION", "PENDING_ASSIGNMENT", "ASSIGNED", "IN_PROGRESS", "PENDING_VERIFICATION", "VERIFIED", "RESOLVED", "ESCALATED", "CONTESTED"] as const;

const TITLES = [
  "Broken road divider on highway",
  "Pothole causing traffic congestion", 
  "Street light not working for 3 days",
  "Water pipe burst flooding area",
  "Garbage overflow in residential area",
  "Illegal dumping near school",
  "Power outage affecting commercial area",
  "Broken bus shelter glass",
  "Contaminated water supply",
  "Noise pollution from construction",
  "Sewage blockage in main road",
  "Damaged public park equipment",
  "Street sign missing at intersection",
  "Drainage system failure",
  "Public toilet maintenance needed",
  "Traffic signal malfunction",
  "Building code violation",
  "Tree falling on power line",
  "Blocked fire hydrant",
  "Damaged footbridge"
];

const DESCRIPTIONS = [
  "Issue reported by multiple citizens and requires immediate attention from concerned department.",
  "Problem has been persistent for several days despite complaints to local authorities.",
  "Safety hazard that could lead to accidents if not addressed promptly.",
  "Infrastructure damage that needs urgent repair before it worsens.",
  "Public facility maintenance issue that needs departmental action.",
  "Environmental concern affecting quality of life in the area.",
  "Critical infrastructure failure affecting daily operations.",
  "Health and safety violation requiring immediate intervention."
];

const LOCATIONS = [
  "Sector 1, Main Road",
  "Sector 5, Market Area", 
  "Sector 12, Residential Block",
  "Sector 8, Commercial Complex",
  "Sector 15, School Zone",
  "Sector 3, Industrial Area",
  "Sector 22, Bus Terminal",
  "Sector 7, Park Area",
  "Sector 18, Hospital Road",
  "Sector 10, Government Office"
];

function getRandomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateGrievance(index: number, citizenId: string, departmentId?: string, officerId?: string) {
  const status = getRandomItem(STATUSES);
  const priority = getRandomItem(PRIORITIES);
  const category = getRandomItem(CATEGORIES);
  
  // Create realistic timeline based on status
  const now = new Date();
  const createdAt = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000); // Random within 90 days
  
  let updatedAt = new Date(createdAt);
  if (status !== "CREATED") {
    updatedAt = new Date(createdAt.getTime() + Math.random() * (now.getTime() - createdAt.getTime()));
  }

  return {
    grid_id: generateGridId(),
    citizen_id: citizenId,
    assigned_officer_id: status === "ASSIGNED" || status === "IN_PROGRESS" ? officerId : null,
    assigned_department_id: departmentId || null,
    title: getRandomItem(TITLES),
    description: getRandomItem(DESCRIPTIONS),
    category: category,
    priority: priority,
    status: status,
    latitude: (28.5 + Math.random() * 0.3).toFixed(8),
    longitude: (77.1 + Math.random() * 0.2).toFixed(8),
    location_address: getRandomItem(LOCATIONS),
    ai_category: category,
    ai_priority: priority,
    ai_summary: `AI analysis: ${category.toLowerCase()} issue requiring ${priority.toLowerCase()} priority attention`,
    damage_severity: (Math.random() * 0.9 + 0.1).toFixed(2),
    before_photo_url: `https://cdn.grievancegrid.local/before/${index}.jpg`,
    voice_recorded: Math.random() > 0.7,
    voice_url: Math.random() > 0.7 ? `https://cdn.grievancegrid.local/voice/${index}.wav` : null,
    embedding_id: `emb-2026-${index}`,
    similar_cases_count: Math.floor(Math.random() * 20) + 1,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

async function hackathonSeed(): Promise<void> {
  console.log("🚀 Hackathon Presentation Seeder");
  console.log("=================================");
  
  try {
    console.log("[hackathon-seed] Connecting to database...");
    
    // Clear existing data
    console.log("[hackathon-seed] Cleaning existing data...");
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
    console.log("[hackathon-seed] Inserting departments...");
    const deptRows = await db.insert(departments).values([
      {
        name: "Public Works Department",
        code: "PWD",
        description: "Roads, infrastructure, and public works maintenance",
        email: "pwd@grievancegrid.local",
        phone: "+91-1200-000001",
        sla_response_hours: 24,
        sla_resolution_hours: 72,
      },
      {
        name: "Water Supply Department",
        code: "WSD", 
        description: "Water supply, sewage systems, and drainage",
        email: "wsd@grievancegrid.local",
        phone: "+91-1200-000002",
        sla_response_hours: 12,
        sla_resolution_hours: 48,
      },
      {
        name: "Sanitation Department",
        code: "SND",
        description: "Waste management, cleaning, and sanitation services",
        email: "snd@grievancegrid.local", 
        phone: "+91-1200-000003",
        sla_response_hours: 18,
        sla_resolution_hours: 60,
      },
      {
        name: "Electricity Department",
        code: "ELD",
        description: "Power supply, street lighting, and electrical infrastructure",
        email: "eld@grievancegrid.local",
        phone: "+91-1200-000004",
        sla_response_hours: 8,
        sla_resolution_hours: 24,
      },
      {
        name: "Public Transport Department",
        code: "PTD",
        description: "Bus services, transport infrastructure, and traffic management",
        email: "ptd@grievancegrid.local",
        phone: "+91-1200-000005",
        sla_response_hours: 16,
        sla_resolution_hours: 48,
      },
      {
        name: "Environment Department",
        code: "ENV",
        description: "Environmental protection, pollution control, and green spaces",
        email: "env@grievancegrid.local",
        phone: "+91-1200-000006",
        sla_response_hours: 24,
        sla_resolution_hours: 96,
      }
    ]).returning({ id: departments.id, code: departments.code });

    // Insert teams
    console.log("[hackathon-seed] Inserting teams...");
    const teamRows = await db.insert(teams).values([
      {
        department_id: deptRows[0].id, // PWD
        name: "PWD-Rapid-Response-Team",
        description: "Emergency road repair and infrastructure response team",
        phone: "+91-1400-000001",
        service_area: {
          type: "Polygon",
          coordinates: [[[77.0, 28.4], [77.1, 28.4], [77.1, 28.5], [77.0, 28.5], [77.0, 28.4]]]
        },
      },
      {
        department_id: deptRows[1].id, // WSD
        name: "WSD-Emergency-Response",
        description: "Water supply emergency and maintenance team",
        phone: "+91-1400-000002",
        service_area: {
          type: "Polygon", 
          coordinates: [[[77.1, 28.4], [77.2, 28.4], [77.2, 28.5], [77.1, 28.5], [77.1, 28.4]]]
        },
      },
      {
        department_id: deptRows[2].id, // SND
        name: "SND-Cleaning-Squad",
        description: "Waste management and sanitation response team",
        phone: "+91-1400-000003",
        service_area: {
          type: "Polygon",
          coordinates: [[[77.2, 28.4], [77.3, 28.4], [77.3, 28.5], [77.2, 28.5], [77.2, 28.4]]]
        },
      },
      {
        department_id: deptRows[3].id, // ELD
        name: "ELD-Power-Restoration",
        description: "Electrical emergency and power restoration team",
        phone: "+91-1400-000004",
        service_area: {
          type: "Polygon",
          coordinates: [[[77.3, 28.4], [77.4, 28.4], [77.4, 28.5], [77.3, 28.5], [77.3, 28.4]]]
        },
      }
    ]).returning({ id: teams.id, department_id: teams.department_id });

    // Hash password helper
    const hashPassword = (password: string): string => {
      // Simple mock hash for demo - in production use bcrypt
      return `$2a$04$${password.split('').map(c => c.charCodeAt(0).toString(16)).join('')}`;
    };

    // Insert users for all roles
    console.log("[hackathon-seed] Inserting users for all roles...");
    const userRows = await db.insert(users).values([
      // Admin users
      {
        email: "admin1@example.com",
        name: "Raj Kumar",
        role: "ADMIN",
        auth_type: "BASIC",
        password_hash: hashPassword("admin1"),
        phone: "+91-98765-43215",
        is_active: true,
      },
      {
        email: "admin2@example.com", 
        name: "Priya Sharma",
        role: "ADMIN",
        auth_type: "BASIC",
        password_hash: hashPassword("admin2"),
        phone: "+91-98765-43216",
        is_active: true,
      },
      
      // Officer users
      {
        email: "officer1@example.com",
        name: "Amit Singh",
        role: "OFFICER", 
        auth_type: "BASIC",
        password_hash: hashPassword("officer1"),
        phone: "+91-98765-43217",
        is_active: true,
      },
      {
        email: "officer2@example.com",
        name: "Sunita Reddy",
        role: "OFFICER",
        auth_type: "BASIC", 
        password_hash: hashPassword("officer2"),
        phone: "+91-98765-43218",
        is_active: true,
      },
      {
        email: "officer3@example.com",
        name: "Vikram Patel",
        role: "OFFICER",
        auth_type: "BASIC",
        password_hash: hashPassword("officer3"),
        phone: "+91-98765-43219",
        is_active: true,
      },
      
      // Crew users
      {
        email: "crew1@example.com",
        name: "Ramesh Kumar",
        role: "CREW",
        auth_type: "BASIC",
        password_hash: hashPassword("crew1"),
        phone: "+91-98765-43220",
        is_active: true,
      },
      {
        email: "crew2@example.com",
        name: "Anjali Devi",
        role: "CREW",
        auth_type: "BASIC",
        password_hash: hashPassword("crew2"),
        phone: "+91-98765-43221",
        is_active: true,
      },
      {
        email: "crew3@example.com",
        name: "Mahesh Kumar",
        role: "CREW",
        auth_type: "BASIC",
        password_hash: hashPassword("crew3"),
        phone: "+91-98765-43222",
        is_active: true,
      },
      
      // Auditor users
      {
        email: "auditor1@example.com",
        name: "Kavita Nair",
        role: "AUDITOR",
        auth_type: "BASIC",
        password_hash: hashPassword("auditor1"),
        phone: "+91-98765-43223",
        is_active: true,
      },
      {
        email: "auditor2@example.com",
        name: "Rohit Sharma",
        role: "AUDITOR",
        auth_type: "BASIC",
        password_hash: hashPassword("auditor2"),
        phone: "+91-98765-43224",
        is_active: true,
      },
      
      // Citizen users
      {
        email: "citizen1@example.com",
        name: "John Citizen",
        role: "CITIZEN",
        auth_type: "BASIC",
        password_hash: hashPassword("citizen1"),
        phone: "+91-98765-43210",
        is_active: true,
      },
      {
        email: "citizen2@example.com",
        name: "Jane Smith",
        role: "CITIZEN",
        auth_type: "BASIC",
        password_hash: hashPassword("citizen2"),
        phone: "+91-98765-43211",
        is_active: true,
      },
      {
        email: "citizen3@example.com",
        name: "Robert Johnson",
        role: "CITIZEN",
        auth_type: "BASIC",
        password_hash: hashPassword("citizen3"),
        phone: "+91-98765-43212",
        is_active: true,
      },
      {
        email: "citizen4@example.com",
        name: "Maria Garcia",
        role: "CITIZEN",
        auth_type: "BASIC",
        password_hash: hashPassword("citizen4"),
        phone: "+91-98765-43213",
        is_active: true,
      },
      {
        email: "citizen5@example.com",
        name: "David Lee",
        role: "CITIZEN",
        auth_type: "BASIC",
        password_hash: hashPassword("citizen5"),
        phone: "+91-98765-43214",
        is_active: true,
      }
    ]).returning({ id: users.id, role: users.role, email: users.email });

    console.log(`[hackathon-seed] Inserted ${userRows.length} users`);

    // Find users by role for assignment
    const adminUsers = userRows.filter(u => u.role === "ADMIN");
    const officerUsers = userRows.filter(u => u.role === "OFFICER");
    const crewUsers = userRows.filter(u => u.role === "CREW");
    const auditorUsers = userRows.filter(u => u.role === "AUDITOR");
    const citizenUsers = userRows.filter(u => u.role === "CITIZEN");

    // Insert comprehensive grievances for presentation
    console.log("[hackathon-seed] Inserting comprehensive grievances for presentation...");
    const targetCount = 500; // Good amount for hackathon demo
    const batchSize = 50;
    let totalInserted = 0;

    for (let i = 0; i < targetCount; i += batchSize) {
      const currentBatch = Math.min(batchSize, targetCount - i);
      const grievancesBatch = [];

      for (let j = 0; j < currentBatch; j++) {
        const citizenUser = citizenUsers[Math.floor(Math.random() * citizenUsers.length)];
        const officerUser = officerUsers[Math.floor(Math.random() * officerUsers.length)];
        const departmentId = deptRows[Math.floor(Math.random() * deptRows.length)].id;
        
        grievancesBatch.push(generateGrievance(i + j + 1, citizenUser.id, departmentId, officerUser.id));
      }

      await db.insert(grievances).values(grievancesBatch);
      totalInserted += grievancesBatch.length;
      
      console.log(`[hackathon-seed] Inserted batch ${Math.floor(i / batchSize) + 1}: ${grievancesBatch.length} grievances (total: ${totalInserted})`);
    }

    // Summary statistics
    console.log("\n🎉 Hackathon seeding completed successfully!");
    console.log("\n📊 Dataset Summary:");
    console.log(`   Total Users: ${userRows.length}`);
    console.log(`   - Admins: ${adminUsers.length}`);
    console.log(`   - Officers: ${officerUsers.length}`);
    console.log(`   - Crew: ${crewUsers.length}`);
    console.log(`   - Auditors: ${auditorUsers.length}`);
    console.log(`   - Citizens: ${citizenUsers.length}`);
    console.log(`   Total Departments: ${deptRows.length}`);
    console.log(`   Total Teams: ${teamRows.length}`);
    console.log(`   Total Grievances: ${totalInserted}`);

    console.log("\n🔑 Demo Credentials for Presentation:");
    console.log("\n👨‍💼 Admin Users:");
    adminUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} / admin${index + 1}`);
    });

    console.log("\n👮 Officer Users:");
    officerUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} / officer${index + 1}`);
    });

    console.log("\n🔧 Crew Users:");
    crewUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} / crew${index + 1}`);
    });

    console.log("\n📊 Auditor Users:");
    auditorUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} / auditor${index + 1}`);
    });

    console.log("\n👥 Citizen Users:");
    citizenUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} / citizen${index + 1}`);
    });

    console.log("\n🎯 Perfect for Hackathon Presentation!");
    console.log("   ✅ Multiple users for each role");
    console.log("   ✅ 500 realistic grievances");
    console.log("   ✅ All departments and teams");
    console.log("   ✅ Various statuses and priorities");
    console.log("   ✅ Complete workflow examples");

  } catch (error) {
    console.error("[hackathon-seed] ❌ Hackathon seeding failed:", error);
    throw error;
  }
}

// Run the hackathon seeder
if (import.meta.main) {
  hackathonSeed()
    .then(() => {
      console.log("\n🚀 Hackathon dataset is ready for presentation!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Hackathon seeding failed:", error);
      process.exit(1);
    });
}
