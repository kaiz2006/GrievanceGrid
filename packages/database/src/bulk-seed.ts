#!/usr/bin/env node
/**
 * Bulk Grievance Seeder for Admin Dashboard Testing
 * Adds 1000 grievances for large dataset testing
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import { sql } from "drizzle-orm";

import { db } from "./index";
import { users, grievances, departments } from "./schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

// Sample data templates
const TITLES = [
  "Broken road divider on highway",
  "Pothole causing traffic congestion",
  "Street light not working for 3 days",
  "Water pipe burst flooding area",
  "Garbage overflow in residential area",
  "Sewage blockage in main drain",
  "Power outage affecting commercial area",
  "Broken bus shelter glass",
  "Illegal dumping near school",
  "Traffic signal malfunction",
  "Damaged footpath causing accidents",
  "Contaminated water supply",
  "Noise pollution from construction",
  "Street cleaning required",
  "Electric pole leaning dangerously",
  "Public toilet maintenance needed",
  "Park playground equipment broken",
  "Drainage overflow during rain",
  "Street animal menace",
  "Building code violation",
];

const DESCRIPTIONS = [
  "Issue observed by multiple residents and requires immediate attention from concerned department.",
  "Problem has been persistent for several days despite complaints to local authorities.",
  "Safety hazard that could lead to accidents if not addressed promptly.",
  "Service disruption affecting daily life of citizens in the area.",
  "Infrastructure damage that needs urgent repair before it worsens.",
  "Environmental concern that impacts public health and hygiene.",
  "Utility service failure requiring technical intervention.",
  "Public facility maintenance issue that needs departmental action.",
  "Traffic management problem causing congestion and delays.",
  "Quality of service issue that needs departmental oversight.",
];

const LOCATIONS = [
  { area: "Sector 1", lat: "28.61000000", lng: "77.20000000" },
  { area: "Sector 2", lat: "28.62000000", lng: "77.21000000" },
  { area: "Sector 3", lat: "28.63000000", lng: "77.22000000" },
  { area: "Sector 4", lat: "28.64000000", lng: "77.23000000" },
  { area: "Sector 5", lat: "28.65000000", lng: "77.24000000" },
  { area: "Sector 6", lat: "28.66000000", lng: "77.25000000" },
  { area: "Sector 7", lat: "28.67000000", lng: "77.26000000" },
  { area: "Sector 8", lat: "28.68000000", lng: "77.27000000" },
  { area: "Sector 9", lat: "28.69000000", lng: "77.28000000" },
  { area: "Sector 10", lat: "28.70000000", lng: "77.29000000" },
];

const CATEGORIES = ["ROADS", "WATER_SUPPLY", "SANITATION", "ELECTRICITY", "PUBLIC_TRANSPORT", "ENVIRONMENT", "BUILDING_VIOLATION", "INFRASTRUCTURE", "OTHER"] as const;
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
const STATUSES = ["CREATED", "PENDING_CLASSIFICATION", "PENDING_ASSIGNMENT", "ASSIGNED", "IN_PROGRESS", "PENDING_VERIFICATION", "VERIFIED", "RESOLVED", "ESCALATED", "CONTESTED"] as const;

function getRandomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomLocation() {
  return LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
}

function generateGrievance(index: number, citizenId: string, departmentId?: string | null, officerId?: string | undefined) {
  const location = getRandomLocation();
  const category = getRandomItem(CATEGORIES);
  const priority = getRandomItem(PRIORITIES);
  const status = getRandomItem(STATUSES);
  
  // Weight status distribution - more in early stages
  const weightedStatus = Math.random() < 0.6 ? 
    getRandomItem(["CREATED", "PENDING_CLASSIFICATION", "PENDING_ASSIGNMENT", "ASSIGNED", "IN_PROGRESS"]) :
    getRandomItem(["PENDING_VERIFICATION", "VERIFIED", "RESOLVED", "ESCALATED", "CONTESTED"]);

  const createdDaysAgo = Math.floor(Math.random() * 90); // 0-90 days ago
  const createdTime = new Date(Date.now() - (createdDaysAgo * 24 * 60 * 60 * 1000));
  
  // Update time is between creation and now
  const updatedHoursAgo = Math.floor(Math.random() * (createdDaysAgo * 24));
  const updatedTime = new Date(Date.now() - (updatedHoursAgo * 60 * 60 * 1000));

  return {
    grid_id: `GRI-2026-${String(index + 1).padStart(6, '0')}`,
    citizen_id: citizenId,
    assigned_officer_id: Math.random() < 0.3 ? officerId : null,
    assigned_department_id: departmentId || null,
    title: getRandomItem(TITLES),
    description: getRandomItem(DESCRIPTIONS),
    category,
    priority: weightedStatus === "RESOLVED" ? getRandomItem(["MEDIUM", "HIGH"]) : priority,
    status: weightedStatus,
    latitude: location.lat,
    longitude: location.lng,
    location_address: `${location.area}, Main Road`,
    ai_category: category,
    ai_priority: priority,
    ai_summary: `AI analysis: ${category.toLowerCase()} issue requiring ${priority.toLowerCase()} priority attention`,
    damage_severity: (Math.random() * 0.9 + 0.1).toFixed(2),
    before_photo_url: `https://cdn.grievancegrid.local/before/${String(index + 1).padStart(3, '0')}.jpg`,
    voice_recorded: Math.random() < 0.3,
    voice_url: Math.random() < 0.3 ? `https://cdn.grievancegrid.local/voice/${String(index + 1).padStart(3, '0')}.wav` : null,
    embedding_id: `emb-2026-${String(index + 1).padStart(6, '0')}`,
    similar_cases_count: Math.floor(Math.random() * 20),
    created_at: createdTime,
    updated_at: updatedTime,
    resolved_at: weightedStatus === "RESOLVED" ? updatedTime : null,
  };
}

async function bulkSeedGrievances(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL;
  console.log("[bulk-seed] DATABASE_URL loaded:", dbUrl ? "yes" : "no");
  if (dbUrl) {
    console.log("[bulk-seed] target:", dbUrl.replace(/:[^:@/]+@/, ":***@"));
  }

  // Get existing users for citizen assignment and officer ID
  console.log("[bulk-seed] Fetching existing users...");
  const existingUsers = await db.select().from(users);
  const citizenUsers = existingUsers.filter(u => u.role === "CITIZEN");
  const officerUser = existingUsers.find(u => u.role === "OFFICER");
  
  if (citizenUsers.length === 0) {
    console.error("[bulk-seed] No citizen users found. Please run demo-seed first.");
    process.exit(1);
  }

  console.log(`[bulk-seed] Found ${citizenUsers.length} citizen users`);
  console.log(`[bulk-seed] Officer user: ${officerUser ? officerUser.email : 'None found'}`);

  // Get actual departments from database
  console.log("[bulk-seed] Fetching existing departments...");
  const existingDepartments = await db.select().from(departments);
  const departmentIds = existingDepartments.map(d => d.id);
  
  console.log(`[bulk-seed] Found ${departmentIds.length} departments`);

  const targetCount = 1000;
  const batchSize = 100;
  let totalInserted = 0;

  console.log(`[bulk-seed] Starting bulk grievance insertion: ${targetCount} grievances`);

  for (let i = 0; i < targetCount; i += batchSize) {
    const currentBatch = Math.min(batchSize, targetCount - i);
    const grievancesBatch = [];

    for (let j = 0; j < currentBatch; j++) {
      const citizenUser = citizenUsers[Math.floor(Math.random() * citizenUsers.length)];
      const departmentId = Math.random() < 0.8 ? 
        departmentIds[Math.floor(Math.random() * departmentIds.length)] : null;
      
      grievancesBatch.push(generateGrievance(i + j + 1, citizenUser.id, departmentId || undefined, officerUser?.id || undefined));
    }

    try {
      const inserted = await db.insert(grievances).values(grievancesBatch).returning({
        id: grievances.id,
        status: grievances.status,
        priority: grievances.priority,
        category: grievances.category,
        created_at: grievances.created_at,
      });

      totalInserted += inserted.length;
      console.log(`[bulk-seed] Inserted batch ${Math.floor(i/batchSize) + 1}: ${inserted.length} grievances (total: ${totalInserted})`);

    } catch (error) {
      console.error(`[bulk-seed] Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error);
      // Continue with next batch
    }
  }

  // Final statistics
  console.log("\n[bulk-seed] ✅ Bulk grievance seeding completed!");
  console.log(`\n📊 Summary:`);
  console.log(`   Total grievances inserted: ${totalInserted}`);
  console.log(`   Target count: ${targetCount}`);
  console.log(`   Success rate: ${((totalInserted / targetCount) * 100).toFixed(1)}%`);

  // Get final count
  const finalCount = await db.select().from(grievances);
  console.log(`   Total grievances in database: ${finalCount.length}`);

  // Status breakdown
  const statusBreakdown = finalCount.reduce((acc, g) => {
    acc[g.status] = (acc[g.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log(`\n📋 Status Breakdown:`);
  Object.entries(statusBreakdown).forEach(([status, count]) => {
    console.log(`   ${status}: ${count}`);
  });

  // Priority breakdown
  const priorityBreakdown = finalCount.reduce((acc, g) => {
    acc[g.priority] = (acc[g.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log(`\n🔥 Priority Breakdown:`);
  Object.entries(priorityBreakdown).forEach(([priority, count]) => {
    console.log(`   ${priority}: ${count}`);
  });

  // Category breakdown
  const categoryBreakdown = finalCount.reduce((acc, g) => {
    acc[g.category] = (acc[g.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log(`\n📂 Category Breakdown:`);
  Object.entries(categoryBreakdown).forEach(([category, count]) => {
    console.log(`   ${category}: ${count}`);
  });

  console.log(`\n🚀 Admin dashboard is now ready with ${totalInserted} grievances for testing!`);
}

bulkSeedGrievances()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[bulk-seed] failed", error);
    process.exit(1);
  });
