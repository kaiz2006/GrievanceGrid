#!/usr/bin/env node
/**
 * Destructive high-volume database seed for hackathon load testing.
 *
 * Usage examples:
 *   tsx src/seed.ts --allow-reset
 *   tsx src/seed.ts --allow-reset --grievances=50000 --seed=42 --batch=1000
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import { db } from "./index";
import {
  audit_logs,
  cluster_members,
  daily_metrics,
  departments,
  geo_clusters,
  grievances,
  infrastructure_assets,
  sessions,
  sla_timers,
  team_members,
  teams,
  users,
  vector_references,
  verifications,
} from "./schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

type UserRole =
  | "CITIZEN"
  | "CREW"
  | "OFFICER"
  | "ADMIN"
  | "AUDITOR"
  | "DEPT_HEAD";
type GrievanceCategory =
  | "ROADS"
  | "WATER_SUPPLY"
  | "SANITATION"
  | "ELECTRICITY"
  | "PUBLIC_TRANSPORT"
  | "ENVIRONMENT"
  | "BUILDING_VIOLATION"
  | "INFRASTRUCTURE"
  | "OTHER";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type GrievanceStatus =
  | "CREATED"
  | "PENDING_CLASSIFICATION"
  | "PENDING_ASSIGNMENT"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "RESOLVED"
  | "ESCALATED"
  | "CONTESTED"
  | "CLOSED";

type GrievanceSeedLite = {
  id: string;
  status: GrievanceStatus;
  created_at: Date;
  assigned_officer_id: string | null;
  assigned_department_id: string | null;
  latitude: string | null;
  longitude: string | null;
};

const CATEGORY_DEPARTMENT_CODE: Record<GrievanceCategory, string> = {
  ROADS: "PWD",
  WATER_SUPPLY: "WSU",
  SANITATION: "SAN",
  ELECTRICITY: "ELE",
  PUBLIC_TRANSPORT: "TRN",
  ENVIRONMENT: "ENV",
  BUILDING_VIOLATION: "BLD",
  INFRASTRUCTURE: "INF",
  OTHER: "CIV",
};

const CATEGORY_WEIGHTS: Array<{ value: GrievanceCategory; weight: number }> = [
  { value: "ROADS", weight: 22 },
  { value: "WATER_SUPPLY", weight: 14 },
  { value: "SANITATION", weight: 12 },
  { value: "ELECTRICITY", weight: 12 },
  { value: "PUBLIC_TRANSPORT", weight: 8 },
  { value: "ENVIRONMENT", weight: 8 },
  { value: "BUILDING_VIOLATION", weight: 7 },
  { value: "INFRASTRUCTURE", weight: 12 },
  { value: "OTHER", weight: 5 },
];

const STATUS_WEIGHTS: Array<{ value: GrievanceStatus; weight: number }> = [
  { value: "CREATED", weight: 10 },
  { value: "PENDING_CLASSIFICATION", weight: 7 },
  { value: "PENDING_ASSIGNMENT", weight: 8 },
  { value: "ASSIGNED", weight: 16 },
  { value: "IN_PROGRESS", weight: 19 },
  { value: "PENDING_VERIFICATION", weight: 8 },
  { value: "VERIFIED", weight: 6 },
  { value: "RESOLVED", weight: 12 },
  { value: "ESCALATED", weight: 7 },
  { value: "CONTESTED", weight: 2 },
  { value: "CLOSED", weight: 5 },
];

const PRIORITY_WEIGHTS: Array<{ value: Priority; weight: number }> = [
  { value: "LOW", weight: 16 },
  { value: "MEDIUM", weight: 48 },
  { value: "HIGH", weight: 27 },
  { value: "CRITICAL", weight: 9 },
];

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const parsed: Record<string, string | boolean> = {};
  for (const arg of argv) {
    if (!arg.startsWith("--")) {
      continue;
    }
    const withoutPrefix = arg.slice(2);
    const [key, value] = withoutPrefix.split("=");
    parsed[key] = value === undefined ? true : value;
  }
  return parsed;
}

function mulberry32(seed: number): () => number {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(rnd: () => number, min: number, max: number): number {
  return Math.floor(rnd() * (max - min + 1)) + min;
}

function randomFloat(rnd: () => number, min: number, max: number): number {
  return rnd() * (max - min) + min;
}

function pickOne<T>(rnd: () => number, items: T[]): T {
  return items[Math.floor(rnd() * items.length)];
}

function pickWeighted<T>(
  rnd: () => number,
  weighted: Array<{ value: T; weight: number }>
): T {
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let cursor = rnd() * total;
  for (const item of weighted) {
    cursor -= item.weight;
    if (cursor <= 0) {
      return item.value;
    }
  }
  return weighted[weighted.length - 1].value;
}

function chunk<T>(values: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < values.length; i += size) {
    chunks.push(values.slice(i, i + size));
  }
  return chunks;
}

function randomDateWithinDays(rnd: () => number, daysBack: number): Date {
  const now = Date.now();
  const backMs = randomInt(rnd, 0, daysBack * 24 * 60 * 60 * 1000);
  return new Date(now - backMs);
}

function asLat(v: number): string {
  return v.toFixed(8);
}

function asLng(v: number): string {
  return v.toFixed(8);
}

function asDec(v: number, digits = 2): string {
  return v.toFixed(digits);
}

function passwordFromEmail(email: string): string {
  return email.split("@")[0] ?? "changeme";
}

function hashPasswordForSeed(plainText: string): string {
  // Keep seed generation fast while still producing valid bcrypt hashes.
  return bcrypt.hashSync(plainText, 4);
}

async function seed(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const allowReset =
    args["allow-reset"] === true || process.env.SEED_ALLOW_RESET === "true";
  const grievanceCount = Number(args.grievances ?? process.env.SEED_GRIEVANCES ?? "50000");
  const batchSize = Number(args.batch ?? process.env.SEED_BATCH_SIZE ?? "1000");
  const seedNumber = Number(args.seed ?? process.env.SEED_RANDOM ?? "42");

  const dbUrl = process.env.DATABASE_URL;
  console.log("[seed] DATABASE_URL loaded:", dbUrl ? "yes" : "no");
  if (dbUrl) {
    console.log("[seed] target:", dbUrl.replace(/:[^:@/]+@/, ":***@"));
  }

  if (!allowReset) {
    throw new Error(
      "Destructive seed blocked. Pass --allow-reset or set SEED_ALLOW_RESET=true."
    );
  }

  if (!Number.isFinite(grievanceCount) || grievanceCount < 1000) {
    throw new Error("grievances must be a number >= 1000");
  }
  if (!Number.isFinite(batchSize) || batchSize < 100 || batchSize > 5000) {
    throw new Error("batch must be a number between 100 and 5000");
  }
  if (!Number.isFinite(seedNumber)) {
    throw new Error("seed must be numeric");
  }

  if (dbUrl && /prod|production/i.test(dbUrl) && process.env.SEED_ALLOW_PROD !== "true") {
    throw new Error(
      "Production-like DATABASE_URL detected. Refusing destructive seed unless SEED_ALLOW_PROD=true"
    );
  }

  const rnd = mulberry32(seedNumber);

  const citizenCount = Math.max(2000, Math.floor(grievanceCount / 6));
  const officerCount = Math.max(80, Math.floor(grievanceCount / 550));
  const crewCount = Math.max(220, Math.floor(grievanceCount / 250));
  const adminCount = 5;
  const auditorCount = 12;
  const teamsPerDepartment = 3;
  const dailyMetricDays = 120;

  console.log("[seed] starting destructive seed");
  console.log(
    `[seed] config grievances=${grievanceCount} batch=${batchSize} random=${seedNumber}`
  );

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
  console.log("[seed] tables truncated");

  const departmentSeed = [
    {
      name: "Public Works",
      code: "PWD",
      description: "Roads, potholes, and street maintenance",
      email: "pwd@grievancegrid.local",
      phone: "+91-1200-000001",
      sla_response_hours: 24,
      sla_resolution_hours: 72,
    },
    {
      name: "Water Supply",
      code: "WSU",
      description: "Water leaks and supply quality",
      email: "wsu@grievancegrid.local",
      phone: "+91-1200-000002",
      sla_response_hours: 12,
      sla_resolution_hours: 48,
    },
    {
      name: "Sanitation",
      code: "SAN",
      description: "Garbage collection and drainage",
      email: "san@grievancegrid.local",
      phone: "+91-1200-000003",
      sla_response_hours: 18,
      sla_resolution_hours: 60,
    },
    {
      name: "Electricity",
      code: "ELE",
      description: "Outages, poles, and transformers",
      email: "ele@grievancegrid.local",
      phone: "+91-1200-000004",
      sla_response_hours: 6,
      sla_resolution_hours: 24,
    },
    {
      name: "Public Transport",
      code: "TRN",
      description: "Bus stops, route disruptions, terminals",
      email: "trn@grievancegrid.local",
      phone: "+91-1200-000005",
      sla_response_hours: 24,
      sla_resolution_hours: 72,
    },
    {
      name: "Environment",
      code: "ENV",
      description: "Air, noise, and green cover complaints",
      email: "env@grievancegrid.local",
      phone: "+91-1200-000006",
      sla_response_hours: 24,
      sla_resolution_hours: 96,
    },
    {
      name: "Building Control",
      code: "BLD",
      description: "Building safety and violations",
      email: "bld@grievancegrid.local",
      phone: "+91-1200-000007",
      sla_response_hours: 24,
      sla_resolution_hours: 120,
    },
    {
      name: "Infrastructure",
      code: "INF",
      description: "Bridges, drains, and public assets",
      email: "inf@grievancegrid.local",
      phone: "+91-1200-000008",
      sla_response_hours: 18,
      sla_resolution_hours: 72,
    },
    {
      name: "Civic Support",
      code: "CIV",
      description: "General complaints and misc routing",
      email: "civ@grievancegrid.local",
      phone: "+91-1200-000009",
      sla_response_hours: 24,
      sla_resolution_hours: 96,
    },
  ];

  const deptRows = await db.insert(departments).values(departmentSeed).returning({
    id: departments.id,
    code: departments.code,
    sla_response_hours: departments.sla_response_hours,
    sla_resolution_hours: departments.sla_resolution_hours,
  });
  const departmentByCode = new Map<string, (typeof deptRows)[number]>();
  for (const row of deptRows) {
    departmentByCode.set(row.code, row);
  }
  console.log(`[seed] departments=${deptRows.length}`);

  const teamSeed: Array<{
    department_id: string;
    name: string;
    description: string;
    phone: string;
    service_area: unknown;
  }> = [];
  const teamByDept = new Map<string, string[]>();
  let teamIndex = 1;

  for (const dept of deptRows) {
    const teamsForDept: string[] = [];
    for (let i = 0; i < teamsPerDepartment; i += 1) {
      const lat = 28.45 + rnd() * 0.25;
      const lng = 77.05 + rnd() * 0.25;
      teamSeed.push({
        department_id: dept.id,
        name: `${dept.code}-Team-${i + 1}`,
        description: `Rapid response team ${i + 1} for ${dept.code}`,
        phone: `+91-1400-${String(teamIndex).padStart(6, "0")}`,
        service_area: {
          type: "Polygon",
          coordinates: [
            [
              [lng - 0.01, lat - 0.01],
              [lng + 0.01, lat - 0.01],
              [lng + 0.01, lat + 0.01],
              [lng - 0.01, lat + 0.01],
              [lng - 0.01, lat - 0.01],
            ],
          ],
        },
      });
      teamIndex += 1;
    }
    teamByDept.set(dept.id, teamsForDept);
  }

  const insertedTeams = await db.insert(teams).values(teamSeed).returning({
    id: teams.id,
    department_id: teams.department_id,
    name: teams.name,
  });
  for (const t of insertedTeams) {
    const existing = teamByDept.get(t.department_id) ?? [];
    existing.push(t.id);
    teamByDept.set(t.department_id, existing);
  }
  console.log(`[seed] teams=${insertedTeams.length}`);

  const userSeed: Array<{
    email: string;
    name: string;
    role: UserRole;
    auth_type: "BASIC";
    password_hash: string;
    phone: string;
    is_active: boolean;
  }> = [];

  function pushUsers(role: UserRole, count: number, prefix: string): void {
    for (let i = 1; i <= count; i += 1) {
      const email = `${prefix}${i}@example.com`;
      const plainTextPassword = passwordFromEmail(email);
      userSeed.push({
        email,
        name: `${role.toLowerCase()}_${i}`,
        role,
        auth_type: "BASIC",
        password_hash: hashPasswordForSeed(plainTextPassword),
        phone: `+91-9${String(randomInt(rnd, 100000000, 999999999))}`,
        is_active: i === 1 ? true : rnd() > 0.01,
      });
    }
  }

  pushUsers("ADMIN", adminCount, "admin");
  pushUsers("AUDITOR", auditorCount, "auditor");
  pushUsers("OFFICER", officerCount, "officer");
  pushUsers("CREW", crewCount, "crew");
  pushUsers("CITIZEN", citizenCount, "citizen");

  const insertedUsers: Array<{ id: string; role: UserRole; email: string }> = [];
  for (const c of chunk(userSeed, batchSize)) {
    const rows = await db.insert(users).values(c).returning({
      id: users.id,
      role: users.role,
      email: users.email,
    });
    insertedUsers.push(...rows);
  }
  console.log(`[seed] users=${insertedUsers.length}`);

  const userIdsByRole: Record<UserRole, string[]> = {
    ADMIN: [],
    AUDITOR: [],
    OFFICER: [],
    CREW: [],
    CITIZEN: [],
    DEPT_HEAD: [],
  };
  for (const user of insertedUsers) {
    userIdsByRole[user.role].push(user.id);
  }

  const teamMemberSeed: Array<{
    team_id: string;
    user_id: string;
    role: string;
    is_active: boolean;
  }> = [];
  const leadOfficerByTeam = new Map<string, string>();

  for (const t of insertedTeams) {
    const lead = pickOne(rnd, userIdsByRole.OFFICER);
    leadOfficerByTeam.set(t.id, lead);
    teamMemberSeed.push({
      team_id: t.id,
      user_id: lead,
      role: "LEAD",
      is_active: true,
    });

    const crewPerTeam = randomInt(rnd, 4, 8);
    const seen = new Set<string>([lead]);
    for (let i = 0; i < crewPerTeam; i += 1) {
      const member = pickOne(rnd, userIdsByRole.CREW);
      if (seen.has(member)) {
        continue;
      }
      seen.add(member);
      teamMemberSeed.push({
        team_id: t.id,
        user_id: member,
        role: "MEMBER",
        is_active: true,
      });
    }
  }

  for (const c of chunk(teamMemberSeed, batchSize)) {
    await db.insert(team_members).values(c);
  }
  console.log(`[seed] team_members=${teamMemberSeed.length}`);

  const grievanceSeedLite: GrievanceSeedLite[] = [];
  const year = new Date().getUTCFullYear();

  const titleByCategory: Record<GrievanceCategory, string[]> = {
    ROADS: ["Major pothole on arterial road", "Damaged road edge near junction"],
    WATER_SUPPLY: ["Continuous pipe leakage", "No water supply since morning"],
    SANITATION: ["Overflowing garbage point", "Sewage overflow near homes"],
    ELECTRICITY: ["Repeated power outage", "Sparking transformer issue"],
    PUBLIC_TRANSPORT: ["Broken bus shelter", "Route disruption during peak hours"],
    ENVIRONMENT: ["Illegal dumping in open plot", "High dust emission complaint"],
    BUILDING_VIOLATION: ["Unsafe construction activity", "Encroachment on public land"],
    INFRASTRUCTURE: ["Damaged footbridge railing", "Drain collapse risk observed"],
    OTHER: ["General civic issue", "Service request for neighborhood"],
  };

  let grievanceCursor = 1;
  for (let offset = 0; offset < grievanceCount; offset += batchSize) {
    const currentSize = Math.min(batchSize, grievanceCount - offset);
    const grievanceBatch: Array<{
      grid_id: string;
      citizen_id: string;
      assigned_team_id: string | null;
      assigned_officer_id: string | null;
      title: string;
      description: string;
      category: GrievanceCategory;
      priority: Priority;
      status: GrievanceStatus;
      latitude: string;
      longitude: string;
      location_address: string;
      ai_category: GrievanceCategory;
      ai_priority: Priority;
      ai_summary: string;
      damage_severity: string;
      assigned_department_id: string;
      before_photo_url: string;
      after_photo_url: string | null;
      voice_recorded: boolean;
      voice_url: string | null;
      embedding_id: string;
      similar_cases_count: number;
      citizen_feedback_rating: number | null;
      citizen_feedback_text: string | null;
      is_contested: boolean;
      contest_reason: string | null;
      contest_evidence_url: string | null;
      created_at: Date;
      updated_at: Date;
      resolved_at: Date | null;
    }> = [];

    for (let i = 0; i < currentSize; i += 1) {
      const category = pickWeighted(rnd, CATEGORY_WEIGHTS);
      const status = pickWeighted(rnd, STATUS_WEIGHTS);
      const priority = pickWeighted(rnd, PRIORITY_WEIGHTS);

      const deptCode = CATEGORY_DEPARTMENT_CODE[category];
      const dept = departmentByCode.get(deptCode);
      if (!dept) {
        throw new Error(`Missing department mapping for code ${deptCode}`);
      }

      const teamsForDept = teamByDept.get(dept.id) ?? [];
      const assignedTeamId = teamsForDept.length > 0 ? pickOne(rnd, teamsForDept) : null;
      const assignedOfficerId = assignedTeamId
        ? leadOfficerByTeam.get(assignedTeamId) ?? pickOne(rnd, userIdsByRole.OFFICER)
        : null;

      const createdAt = randomDateWithinDays(rnd, 180);
      const updatedAt = new Date(createdAt.getTime() + randomInt(rnd, 1, 18) * 60 * 60 * 1000);
      const isClosedLike = status === "RESOLVED" || status === "CLOSED" || status === "VERIFIED";
      const resolvedAt = isClosedLike
        ? new Date(updatedAt.getTime() + randomInt(rnd, 2, 96) * 60 * 60 * 1000)
        : null;

      const lat = 28.4 + rnd() * 0.33;
      const lng = 77.02 + rnd() * 0.35;
      const damage = Math.min(1, Math.max(0, randomFloat(rnd, 0.05, 0.99)));
      const aiCategory = rnd() < 0.87 ? category : pickWeighted(rnd, CATEGORY_WEIGHTS);
      const aiPriority = rnd() < 0.79 ? priority : pickWeighted(rnd, PRIORITY_WEIGHTS);

      const feedbackRating = isClosedLike && rnd() < 0.38 ? randomInt(rnd, 2, 5) : null;
      const isContested = rnd() < 0.03;

      const title = pickOne(rnd, titleByCategory[category]);
      const description = `${title}. Issue observed by resident and requires department follow-up.`;

      grievanceBatch.push({
        grid_id: `GRI-${year}-${String(grievanceCursor).padStart(6, "0")}`,
        citizen_id: pickOne(rnd, userIdsByRole.CITIZEN),
        assigned_team_id: assignedTeamId,
        assigned_officer_id: assignedOfficerId,
        title,
        description,
        category,
        priority,
        status,
        latitude: asLat(lat),
        longitude: asLng(lng),
        location_address: `Sector-${randomInt(rnd, 1, 99)}, Zone-${randomInt(rnd, 1, 12)}`,
        ai_category: aiCategory,
        ai_priority: aiPriority,
        ai_summary: `Auto summary for ${category.toLowerCase()} with severity ${damage.toFixed(2)}`,
        damage_severity: asDec(damage, 2),
        assigned_department_id: dept.id,
        before_photo_url: `https://cdn.grievancegrid.local/before/${grievanceCursor}.jpg`,
        after_photo_url: isClosedLike
          ? `https://cdn.grievancegrid.local/after/${grievanceCursor}.jpg`
          : null,
        voice_recorded: rnd() < 0.22,
        voice_url:
          rnd() < 0.22
            ? `https://cdn.grievancegrid.local/voice/${grievanceCursor}.wav`
            : null,
        embedding_id: `emb-${year}-${grievanceCursor}`,
        similar_cases_count: randomInt(rnd, 0, 20),
        citizen_feedback_rating: feedbackRating,
        citizen_feedback_text:
          feedbackRating !== null
            ? feedbackRating >= 4
              ? "Issue resolved well"
              : "Resolution quality can improve"
            : null,
        is_contested: isContested,
        contest_reason: isContested ? "Resolution evidence appears insufficient" : null,
        contest_evidence_url: isContested
          ? `https://cdn.grievancegrid.local/contest/${grievanceCursor}.pdf`
          : null,
        created_at: createdAt,
        updated_at: updatedAt,
        resolved_at: resolvedAt,
      });
      grievanceCursor += 1;
    }

    const inserted = await db.insert(grievances).values(grievanceBatch).returning({
      id: grievances.id,
      status: grievances.status,
      created_at: grievances.created_at,
      assigned_officer_id: grievances.assigned_officer_id,
      assigned_department_id: grievances.assigned_department_id,
      latitude: grievances.latitude,
      longitude: grievances.longitude,
    });
    grievanceSeedLite.push(...inserted);

    if ((offset + currentSize) % (batchSize * 10) === 0 || offset + currentSize === grievanceCount) {
      console.log(`[seed] grievances=${offset + currentSize}/${grievanceCount}`);
    }
  }

  const slaSeed: Array<{
    grievance_id: string;
    sla_type: "RESPONSE" | "RESOLUTION";
    deadline_at: Date;
    breached_at: Date | null;
    is_breached: boolean;
    escalation_level: number;
    is_escalated: boolean;
    created_at: Date;
    updated_at: Date;
  }> = [];

  const now = Date.now();
  for (const g of grievanceSeedLite) {
    const dept = g.assigned_department_id
      ? deptRows.find((d) => d.id === g.assigned_department_id)
      : null;
    const responseHours = dept?.sla_response_hours ?? 24;
    const resolutionHours = dept?.sla_resolution_hours ?? 72;

    const responseDeadline = new Date(g.created_at.getTime() + responseHours * 60 * 60 * 1000);
    const resolutionDeadline = new Date(g.created_at.getTime() + resolutionHours * 60 * 60 * 1000);

    const responseBreached = responseDeadline.getTime() < now && rnd() < 0.24;
    const resolutionBreached = resolutionDeadline.getTime() < now && rnd() < 0.19;

    slaSeed.push({
      grievance_id: g.id,
      sla_type: "RESPONSE",
      deadline_at: responseDeadline,
      breached_at: responseBreached
        ? new Date(responseDeadline.getTime() + randomInt(rnd, 1, 10) * 60 * 60 * 1000)
        : null,
      is_breached: responseBreached,
      escalation_level: responseBreached ? randomInt(rnd, 1, 2) : 0,
      is_escalated: responseBreached,
      created_at: g.created_at,
      updated_at: new Date(Math.max(g.created_at.getTime(), responseDeadline.getTime())),
    });

    slaSeed.push({
      grievance_id: g.id,
      sla_type: "RESOLUTION",
      deadline_at: resolutionDeadline,
      breached_at: resolutionBreached
        ? new Date(resolutionDeadline.getTime() + randomInt(rnd, 1, 30) * 60 * 60 * 1000)
        : null,
      is_breached: resolutionBreached,
      escalation_level: resolutionBreached ? randomInt(rnd, 1, 2) : 0,
      is_escalated: resolutionBreached,
      created_at: g.created_at,
      updated_at: new Date(Math.max(g.created_at.getTime(), resolutionDeadline.getTime())),
    });
  }
  for (const c of chunk(slaSeed, batchSize * 2)) {
    await db.insert(sla_timers).values(c);
  }
  console.log(`[seed] sla_timers=${slaSeed.length}`);

  const verificationStatuses = new Set<GrievanceStatus>([
    "PENDING_VERIFICATION",
    "VERIFIED",
    "RESOLVED",
    "CLOSED",
  ]);
  const verificationSeed: Array<{
    grievance_id: string;
    officer_id: string;
    photo_url: string;
    latitude: string;
    longitude: string;
    distance_from_incident: string;
    is_within_tolerance: boolean;
    status: string;
    notes: string;
    created_at: Date;
  }> = [];

  for (const g of grievanceSeedLite) {
    if (!verificationStatuses.has(g.status) || rnd() > 0.7) {
      continue;
    }
    verificationSeed.push({
      grievance_id: g.id,
      officer_id: g.assigned_officer_id ?? pickOne(rnd, userIdsByRole.OFFICER),
      photo_url: `https://cdn.grievancegrid.local/verify/${g.id}.jpg`,
      latitude: g.latitude ?? asLat(28.45 + rnd() * 0.2),
      longitude: g.longitude ?? asLng(77.08 + rnd() * 0.2),
      distance_from_incident: asDec(randomFloat(rnd, 2, 140), 2),
      is_within_tolerance: rnd() < 0.9,
      status: rnd() < 0.85 ? "VERIFIED" : "REJECTED",
      notes: rnd() < 0.85 ? "Validation completed" : "Photo mismatch detected",
      created_at: new Date(g.created_at.getTime() + randomInt(rnd, 6, 72) * 60 * 60 * 1000),
    });
  }
  for (const c of chunk(verificationSeed, batchSize)) {
    await db.insert(verifications).values(c);
  }
  console.log(`[seed] verifications=${verificationSeed.length}`);

  const auditSeed: Array<{
    grievance_id: string;
    actor_id: string | null;
    event_type: string;
    old_status: GrievanceStatus | null;
    new_status: GrievanceStatus | null;
    description: string;
    metadata: Record<string, unknown>;
    created_at: Date;
  }> = [];

  for (const g of grievanceSeedLite) {
    const actor = g.assigned_officer_id ?? pickOne(rnd, userIdsByRole.OFFICER);
    auditSeed.push({
      grievance_id: g.id,
      actor_id: null,
      event_type: "CREATED",
      old_status: null,
      new_status: "CREATED",
      description: "Grievance created by citizen",
      metadata: { source: "seed", stage: "intake" },
      created_at: g.created_at,
    });

    auditSeed.push({
      grievance_id: g.id,
      actor_id: actor,
      event_type: "ASSIGNED",
      old_status: "CREATED",
      new_status: "ASSIGNED",
      description: "Auto-assigned to response team",
      metadata: { source: "seed", stage: "routing" },
      created_at: new Date(g.created_at.getTime() + 60 * 60 * 1000),
    });

    if (g.status !== "ASSIGNED" && g.status !== "CREATED") {
      auditSeed.push({
        grievance_id: g.id,
        actor_id: actor,
        event_type: "STATUS_CHANGED",
        old_status: "ASSIGNED",
        new_status: g.status,
        description: `Status changed to ${g.status}`,
        metadata: { source: "seed", final_status: g.status },
        created_at: new Date(g.created_at.getTime() + randomInt(rnd, 2, 84) * 60 * 60 * 1000),
      });
    }
  }
  for (const c of chunk(auditSeed, batchSize * 2)) {
    await db.insert(audit_logs).values(c);
  }
  console.log(`[seed] audit_logs=${auditSeed.length}`);

  const vectorSeed = grievanceSeedLite.map((g) => ({
    grievance_id: g.id,
    qdrant_id: `qdr-${g.id}`,
    collection_name: "grievances",
    embedding_model: "deterministic",
    vector_dimension: 768,
  }));
  for (const c of chunk(vectorSeed, batchSize * 2)) {
    await db.insert(vector_references).values(c);
  }
  console.log(`[seed] vector_references=${vectorSeed.length}`);

  const clusterCount = Math.max(20, Math.floor(grievanceCount / 2500));
  const clusterSeed: Array<{
    cluster_type: "GEOGRAPHIC" | "TOPIC" | "ANOMALY";
    centroid_lat: string;
    centroid_lng: string;
    member_count: number;
    crisis_score: string;
    is_active: boolean;
    topics: string[];
    metadata: Record<string, unknown>;
  }> = [];
  for (let i = 0; i < clusterCount; i += 1) {
    clusterSeed.push({
      cluster_type: pickOne(rnd, ["GEOGRAPHIC", "TOPIC", "ANOMALY"]),
      centroid_lat: asLat(28.4 + rnd() * 0.3),
      centroid_lng: asLng(77.0 + rnd() * 0.35),
      member_count: 0,
      crisis_score: asDec(randomFloat(rnd, 0.2, 0.95), 2),
      is_active: rnd() > 0.08,
      topics: ["roads", "water", "outage", "garbage", "safety"].sort(() => rnd() - 0.5).slice(0, 3),
      metadata: { source: "seed", window_days: 30 },
    });
  }
  const clusterRows = await db.insert(geo_clusters).values(clusterSeed).returning({
    id: geo_clusters.id,
  });

  const clusterMemberSeed: Array<{
    cluster_id: string;
    grievance_id: string;
    similarity_score: string;
  }> = [];
  const clusterCounts = new Map<string, number>();
  for (const c of clusterRows) {
    clusterCounts.set(c.id, 0);
  }
  for (const g of grievanceSeedLite) {
    if (rnd() > 0.45) {
      continue;
    }
    const c = pickOne(rnd, clusterRows);
    clusterMemberSeed.push({
      cluster_id: c.id,
      grievance_id: g.id,
      similarity_score: asDec(randomFloat(rnd, 0.52, 0.99), 2),
    });
    clusterCounts.set(c.id, (clusterCounts.get(c.id) ?? 0) + 1);
  }
  for (const c of chunk(clusterMemberSeed, batchSize * 2)) {
    await db.insert(cluster_members).values(c);
  }

  for (const c of clusterRows) {
    const count = clusterCounts.get(c.id) ?? 0;
    await db
      .update(geo_clusters)
      .set({
        member_count: count,
        crisis_score: asDec(Math.min(0.99, 0.25 + count / Math.max(1, grievanceCount * 0.2)), 2),
      })
      .where(sql`${geo_clusters.id} = ${c.id}`);
  }
  console.log(`[seed] geo_clusters=${clusterRows.length} cluster_members=${clusterMemberSeed.length}`);

  const infraAssetTypes = [
    "ROAD_SEGMENT",
    "WATER_PIPE",
    "SEWER_LINE",
    "TRANSFORMER",
    "BUS_STOP",
    "DRAIN",
    "FOOTPATH",
    "STREET_LIGHT",
  ];

  const infraSeed: Array<{
    department_id: string;
    asset_type: string;
    asset_name: string;
    location_lat: string;
    location_lng: string;
    complaint_count_7d: number;
    complaint_count_30d: number;
    unresolved_count: number;
    failure_risk_score: string;
    predicted_failure_date: Date | null;
    is_active: boolean;
  }> = [];

  let infraIndex = 1;
  for (const d of deptRows) {
    const assetsPerDept = Math.max(150, Math.floor(grievanceCount / deptRows.length / 10));
    for (let i = 0; i < assetsPerDept; i += 1) {
      const complaint30 = randomInt(rnd, 0, 70);
      const unresolved = randomInt(rnd, 0, Math.max(1, complaint30));
      const risk = Math.min(0.99, 0.1 + complaint30 / 120 + unresolved / 160 + rnd() * 0.2);
      infraSeed.push({
        department_id: d.id,
        asset_type: pickOne(rnd, infraAssetTypes),
        asset_name: `${d.code}-ASSET-${String(infraIndex).padStart(6, "0")}`,
        location_lat: asLat(28.4 + rnd() * 0.3),
        location_lng: asLng(77.0 + rnd() * 0.35),
        complaint_count_7d: Math.min(complaint30, randomInt(rnd, 0, 24)),
        complaint_count_30d: complaint30,
        unresolved_count: unresolved,
        failure_risk_score: asDec(risk, 2),
        predicted_failure_date:
          risk > 0.65
            ? new Date(Date.now() + randomInt(rnd, 5, 90) * 24 * 60 * 60 * 1000)
            : null,
        is_active: rnd() > 0.04,
      });
      infraIndex += 1;
    }
  }

  for (const c of chunk(infraSeed, batchSize)) {
    await db.insert(infrastructure_assets).values(c);
  }
  console.log(`[seed] infrastructure_assets=${infraSeed.length}`);

  const dailyMetricsSeed: Array<{
    metric_date: Date;
    total_grievances: number;
    new_grievances: number;
    resolved_grievances: number;
    escalated_grievances: number;
    contested_grievances: number;
    avg_resolution_time_hours: string;
    sla_compliance_rate: string;
    avg_citizen_satisfaction: string;
    category_breakdown: Record<string, number>;
  }> = [];

  for (let i = dailyMetricDays; i >= 1; i -= 1) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - i);

    const newCases = randomInt(rnd, Math.floor(grievanceCount / 300), Math.floor(grievanceCount / 120));
    const resolved = randomInt(rnd, Math.floor(newCases * 0.65), Math.floor(newCases * 1.15));
    const escalated = randomInt(rnd, Math.floor(newCases * 0.04), Math.floor(newCases * 0.16));
    const contested = randomInt(rnd, 0, Math.floor(newCases * 0.06));

    dailyMetricsSeed.push({
      metric_date: date,
      total_grievances: grievanceCount,
      new_grievances: newCases,
      resolved_grievances: resolved,
      escalated_grievances: escalated,
      contested_grievances: contested,
      avg_resolution_time_hours: asDec(randomFloat(rnd, 14, 86), 2),
      sla_compliance_rate: asDec(randomFloat(rnd, 0.71, 0.96), 2),
      avg_citizen_satisfaction: asDec(randomFloat(rnd, 3.1, 4.7), 2),
      category_breakdown: {
        ROADS: randomInt(rnd, 15, 35),
        WATER_SUPPLY: randomInt(rnd, 8, 20),
        SANITATION: randomInt(rnd, 7, 18),
        ELECTRICITY: randomInt(rnd, 8, 20),
        PUBLIC_TRANSPORT: randomInt(rnd, 4, 13),
        ENVIRONMENT: randomInt(rnd, 4, 12),
        BUILDING_VIOLATION: randomInt(rnd, 2, 10),
        INFRASTRUCTURE: randomInt(rnd, 6, 14),
        OTHER: randomInt(rnd, 2, 8),
      },
    });
  }
  for (const c of chunk(dailyMetricsSeed, batchSize)) {
    await db.insert(daily_metrics).values(c);
  }
  console.log(`[seed] daily_metrics=${dailyMetricsSeed.length}`);

  const sessionSeed: Array<{
    id: string;
    user_id: string;
    token: string;
    is_active: boolean;
    expires_at: Date;
  }> = [];

  const sessionUsers = insertedUsers.filter((u) => rnd() < 0.24).slice(0, 4000);
  for (const u of sessionUsers) {
    sessionSeed.push({
      id: `sess-${u.id.slice(0, 8)}-${randomInt(rnd, 10000, 99999)}`,
      user_id: u.id,
      token: `tok-${uuidv4()}-${uuidv4()}`,
      is_active: rnd() < 0.85,
      expires_at: new Date(Date.now() + randomInt(rnd, 1, 15) * 24 * 60 * 60 * 1000),
    });
  }
  for (const c of chunk(sessionSeed, batchSize)) {
    await db.insert(sessions).values(c);
  }
  console.log(`[seed] sessions=${sessionSeed.length}`);

  console.log("[seed] complete");
  console.log("[seed] summary");
  console.log(`  departments: ${deptRows.length}`);
  console.log(`  teams: ${insertedTeams.length}`);
  console.log(`  users: ${insertedUsers.length}`);
  console.log(`  team_members: ${teamMemberSeed.length}`);
  console.log(`  grievances: ${grievanceSeedLite.length}`);
  console.log(`  sla_timers: ${slaSeed.length}`);
  console.log(`  verifications: ${verificationSeed.length}`);
  console.log(`  audit_logs: ${auditSeed.length}`);
  console.log(`  vector_references: ${vectorSeed.length}`);
  console.log(`  geo_clusters: ${clusterRows.length}`);
  console.log(`  cluster_members: ${clusterMemberSeed.length}`);
  console.log(`  infrastructure_assets: ${infraSeed.length}`);
  console.log(`  daily_metrics: ${dailyMetricsSeed.length}`);
  console.log(`  sessions: ${sessionSeed.length}`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[seed] failed", error);
    process.exit(1);
  });
