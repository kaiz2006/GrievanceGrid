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
      category: "WATER",
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
