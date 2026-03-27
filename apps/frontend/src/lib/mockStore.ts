import { GrievanceDetail, GrievanceStatus } from "@/types";

const DB_KEY = "grievance_grid_demo_db";

export const getMockGrievances = (): GrievanceDetail[] => {
  const data = localStorage.getItem(DB_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse mock grievances, resetting...", e);
      localStorage.removeItem(DB_KEY);
    }
  }

  // Seed data
  const initialData: GrievanceDetail[] = [
    {
      id: "1",
      grid_id: "GRI-2026-000102",
      category: "ROADS",
      priority: "HIGH",
      status: "IN_PROGRESS",
      title: "Broken Road Divider",
      description: "Hazardous debris on Sector 14 flyover causing traffic jams.",
      location: { latitude: 28.6, longitude: 77.2, address: "Sector 14 Flyover" },
      created_at: new Date(Date.now() - 3600000).toISOString(),
      timeline: [
        { status: "CREATED", timestamp: new Date(Date.now() - 3600000).toISOString(), description: "Grievance submitted" },
        { status: "AI_PROCESSED", timestamp: new Date(Date.now() - 3500000).toISOString(), description: "AI categorized: ROADS" },
        { status: "ROUTED", timestamp: new Date(Date.now() - 3400000).toISOString(), description: "Routed to PWD" },
        { status: "IN_PROGRESS", timestamp: new Date(Date.now() - 1200000).toISOString(), description: "Work started", eta: new Date(Date.now() + 3600000).toISOString() }
      ],
      sla: {
        response_sla: { deadline: new Date(Date.now() + 86400000).toISOString(), remaining_hours: 24 },
        resolution_sla: { deadline: new Date(Date.now() + 86400000).toISOString(), remaining_hours: 24 }
      }
    },
    {
      id: "2",
      grid_id: "GRI-2026-000089",
      category: "WATER_SUPPLY",

      priority: "CRITICAL",
      status: "CREATED",
      title: "Major Pipe Burst",
      description: "Water leaking heavily onto the main road in Sector 10.",
      location: { latitude: 28.61, longitude: 77.22, address: "Sector 10 Market" },
      created_at: new Date(Date.now() - 1800000).toISOString(),
      timeline: [
        { status: "CREATED", timestamp: new Date(Date.now() - 1800000).toISOString(), description: "Grievance submitted" }
      ],
      sla: {
        response_sla: { deadline: new Date(Date.now() + 3600000).toISOString(), remaining_hours: 1 },
        resolution_sla: { deadline: new Date(Date.now() + 24 * 3600000).toISOString(), remaining_hours: 24 }
      }
    },
    {
      id: "3",
      grid_id: "GRI-2026-000045",
      category: "SANITATION",
      priority: "NORMAL",
      status: "ASSIGNED",
      title: "Garbage Overflow",
      description: "Garbage collection has not happened for 3 days. Bin is overflowing.",
      location: { latitude: 28.58, longitude: 77.15, address: "Main Street, Block C" },
      created_at: new Date(Date.now() - 172800000).toISOString(),
      timeline: [
        { status: "CREATED", timestamp: new Date(Date.now() - 172800000).toISOString(), description: "Grievance submitted" },
        { status: "AI_PROCESSED", timestamp: new Date(Date.now() - 172700000).toISOString(), description: "AI categorized: SANITATION" },
        { status: "ROUTED", timestamp: new Date(Date.now() - 172600000).toISOString(), description: "Routed to Sanitation Department" },
        { status: "ASSIGNED", timestamp: new Date(Date.now() - 172500000).toISOString(), description: "Assigned to field officer" }
      ],
      sla: {
        response_sla: { deadline: new Date(Date.now() - 150000000).toISOString() },
        resolution_sla: { deadline: new Date(Date.now() + 86400000).toISOString(), remaining_hours: 24 }
      }
    },
    {
      id: "4",
      grid_id: "GRI-2026-000213",
      category: "ELECTRICITY",
      priority: "HIGH",
      status: "ROUTED",
      title: "Street Light Failure",
      description: "Entire street light line is down from Pole 12 to 24. Very dark at night.",
      location: { latitude: 28.65, longitude: 77.10, address: "Industrial Area Phase II" },
      created_at: new Date(Date.now() - 259200000).toISOString(),
      timeline: [
        { status: "CREATED", timestamp: new Date(Date.now() - 259200000).toISOString(), description: "Grievance submitted" },
        { status: "AI_PROCESSED", timestamp: new Date(Date.now() - 258000000).toISOString(), description: "AI categorized: ELECTRICITY" },
        { status: "ROUTED", timestamp: new Date(Date.now() - 250000000).toISOString(), description: "Assigned to Electrical Dept" }
      ],
      sla: {
        response_sla: { deadline: new Date(Date.now() - 240000000).toISOString() },
        resolution_sla: { deadline: new Date(Date.now() - 100000000).toISOString() }
      }
    },
    {
      id: "5",
      grid_id: "GRI-2026-000156",
      category: "SANITATION",
      priority: "NORMAL",
      status: "PENDING",
      title: "Waste Collection Delay",
      description: "Regular waste collection has been delayed for 2 days in residential area.",
      location: { latitude: 28.59, longitude: 77.18, address: "Residential Block D" },
      created_at: new Date(Date.now() - 7200000).toISOString(),
      timeline: [
        { status: "PENDING", timestamp: new Date(Date.now() - 7200000).toISOString(), description: "Grievance submitted and pending review" }
      ],
      sla: {
        response_sla: { deadline: new Date(Date.now() + 4 * 3600000).toISOString(), remaining_hours: 4 },
        resolution_sla: { deadline: new Date(Date.now() + 24 * 3600000).toISOString(), remaining_hours: 24 }
      }
    },
    {
      id: "6",
      grid_id: "GRI-2026-000178",
      category: "ROADS",
      priority: "CRITICAL",
      status: "AI_PROCESSED",
      title: "Pothole on Main Highway",
      description: "Large pothole causing accidents on NH-48 near Sector 27.",
      location: { latitude: 28.62, longitude: 77.25, address: "NH-48 Highway, Sector 27" },
      created_at: new Date(Date.now() - 3600000).toISOString(),
      timeline: [
        { status: "CREATED", timestamp: new Date(Date.now() - 3600000).toISOString(), description: "Grievance submitted" },
        { status: "AI_PROCESSED", timestamp: new Date(Date.now() - 3500000).toISOString(), description: "AI categorized: ROADS, Priority: CRITICAL" }
      ],
      sla: {
        response_sla: { deadline: new Date(Date.now() + 3600000).toISOString(), remaining_hours: 1 },
        resolution_sla: { deadline: new Date(Date.now() + 12 * 3600000).toISOString(), remaining_hours: 12 }
      }
    },
    {
      id: "7",
      grid_id: "GRI-2026-000189",
      category: "WATER_SUPPLY",
      priority: "HIGH",
      status: "IN_PROGRESS",
      title: "Contaminated Water Supply",
      description: "Water coming from taps is dirty and has unusual smell in Block A.",
      location: { latitude: 28.57, longitude: 77.12, address: "Residential Block A" },
      created_at: new Date(Date.now() - 7200000).toISOString(),
      timeline: [
        { status: "CREATED", timestamp: new Date(Date.now() - 7200000).toISOString(), description: "Grievance submitted" },
        { status: "AI_PROCESSED", timestamp: new Date(Date.now() - 7100000).toISOString(), description: "AI categorized: WATER_SUPPLY" },
        { status: "ROUTED", timestamp: new Date(Date.now() - 7000000).toISOString(), description: "Routed to Water Supply Department" },
        { status: "ASSIGNED", timestamp: new Date(Date.now() - 6800000).toISOString(), description: "Assigned to field officer" },
        { status: "IN_PROGRESS", timestamp: new Date(Date.now() - 3600000).toISOString(), description: "Investigation in progress" }
      ],
      sla: {
        response_sla: { deadline: new Date(Date.now() - 6000000).toISOString() },
        resolution_sla: { deadline: new Date(Date.now() + 12 * 3600000).toISOString(), remaining_hours: 12 }
      }
    },
    {
      id: "8",
      grid_id: "GRI-2026-000201",
      category: "PUBLIC_TRANSPORT",
      priority: "NORMAL",
      status: "PENDING_ASSIGNMENT",
      title: "Broken Bus Shelter",
      description: "Bus shelter glass is broken and seats are damaged. No protection from rain.",
      location: { latitude: 28.63, longitude: 77.19, address: "Bus Stop Sector 22" },
      created_at: new Date(Date.now() - 10800000).toISOString(),
      timeline: [
        { status: "CREATED", timestamp: new Date(Date.now() - 10800000).toISOString(), description: "Grievance submitted" },
        { status: "AI_PROCESSED", timestamp: new Date(Date.now() - 10700000).toISOString(), description: "AI categorized: PUBLIC_TRANSPORT" }
      ],
      sla: {
        response_sla: { deadline: new Date(Date.now() + 2 * 3600000).toISOString(), remaining_hours: 2 },
        resolution_sla: { deadline: new Date(Date.now() + 24 * 3600000).toISOString(), remaining_hours: 24 }
      }
    },
    {
      id: "9",
      grid_id: "GRI-2026-000215",
      category: "ENVIRONMENT",
      priority: "NORMAL",
      status: "PENDING_CLASSIFICATION",
      title: "Illegal Dumping",
      description: "Construction debris being illegally dumped in open plot near residential area.",
      location: { latitude: 28.64, longitude: 77.16, address: "Open Plot Near Sector 15" },
      created_at: new Date(Date.now() - 14400000).toISOString(),
      timeline: [
        { status: "CREATED", timestamp: new Date(Date.now() - 14400000).toISOString(), description: "Grievance submitted" },
        { status: "PENDING_CLASSIFICATION", timestamp: new Date(Date.now() - 14300000).toISOString(), description: "AI processing in progress" }
      ],
      sla: {
        response_sla: { deadline: new Date(Date.now() + 4 * 3600000).toISOString(), remaining_hours: 4 },
        resolution_sla: { deadline: new Date(Date.now() + 48 * 3600000).toISOString(), remaining_hours: 48 }
      }
    },
    {
      id: "10",
      grid_id: "GRI-2026-000198",
      category: "BUILDING_VIOLATION",
      priority: "HIGH",
      status: "ESCALATED",
      title: "Unauthorized Construction",
      description: "Building being constructed without proper permits and violating height restrictions.",
      location: { latitude: 28.66, longitude: 77.22, address: "Sector 8 Extension" },
      created_at: new Date(Date.now() - 86400000).toISOString(),
      timeline: [
        { status: "CREATED", timestamp: new Date(Date.now() - 86400000).toISOString(), description: "Grievance submitted" },
        { status: "AI_PROCESSED", timestamp: new Date(Date.now() - 86000000).toISOString(), description: "AI categorized: BUILDING_VIOLATION" },
        { status: "ROUTED", timestamp: new Date(Date.now() - 85000000).toISOString(), description: "Routed to Building Department" },
        { status: "ASSIGNED", timestamp: new Date(Date.now() - 84000000).toISOString(), description: "Assigned to building inspector" },
        { status: "ESCALATED", timestamp: new Date(Date.now() - 72000000).toISOString(), description: "Escalated to senior authority" }
      ],
      sla: {
        response_sla: { deadline: new Date(Date.now() - 70000000).toISOString() },
        resolution_sla: { deadline: new Date(Date.now() + 24 * 3600000).toISOString(), remaining_hours: 24 }
      }
    }
  ];

  localStorage.setItem(DB_KEY, JSON.stringify(initialData));
  return initialData;
};

export const saveMockGrievance = (grievance: GrievanceDetail) => {
  const list = getMockGrievances();
  const index = list.findIndex(g => g.id === grievance.id);
  if (index >= 0) {
    list[index] = grievance;
  } else {
    list.unshift(grievance);
  }
  localStorage.setItem(DB_KEY, JSON.stringify(list));
};

export const getMockGrievanceById = (id: string): GrievanceDetail | undefined => {
  const list = getMockGrievances();
  return list.find(g => g.id === id);
};
