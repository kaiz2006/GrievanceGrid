import { format, subDays, isSameDay, parseISO } from 'date-fns';

export interface Grievance {
  id: string;
  grid_id: string;
  category: string;
  status: string;
  title: string;
  description: string;
  location: string;
  created_at: string;
  [key: string]: any;
}

/**
 * Aggregates grievances by date for the last N days.
 */
export const getTrendData = (grievances: Grievance[], days: number = 7) => {
  const trend = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const count = grievances.filter(g => {
      try {
        const gDate = parseISO(g.created_at);
        return isSameDay(gDate, date);
      } catch (e) {
        return false;
      }
    }).length;

    trend.push({
      date: format(date, 'MMM dd'),
      count: count,
    });
  }
  return trend;
};

/**
 * Aggregates grievances by category.
 */
export const getCategoryData = (grievances: Grievance[]) => {
  const categories: Record<string, number> = {};
  grievances.forEach(g => {
    const cat = g.category || 'Unclassified';
    categories[cat] = (categories[cat] || 0) + 1;
  });

  return Object.entries(categories)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Aggregates grievances by status (Simplified for Bar charts).
 */
export const getStatusDistribution = (grievances: Grievance[]) => {
  const activeStatuses = new Set(["PENDING", "PENDING_ASSIGNMENT", "PENDING_CLASSIFICATION", "ASSIGNED", "IN_PROGRESS", "ESCALATED", "CONTESTED"]);
  const resolvedStatuses = new Set(["RESOLVED", "CLOSED", "VERIFIED"]);

  let active = 0;
  let resolved = 0;

  grievances.forEach(g => {
    const status = (g.status || '').toUpperCase();
    if (resolvedStatuses.has(status)) resolved++;
    else if (activeStatuses.has(status)) active++;
  });

  return [
    { name: 'Active', count: active },
    { name: 'Resolved', count: resolved }
  ];
};

/**
 * Generates dummy historical data if the user has only few grievances (for demo beauty).
 */
export const getEnhancedTrendData = (grievances: Grievance[]) => {
  const realData = getTrendData(grievances, 7);
  // If no grievances yet, provide a slight upward trend for visual appeal
  if (grievances.length < 3) {
    return [
      { date: format(subDays(new Date(), 6), 'MMM dd'), count: 2 },
      { date: format(subDays(new Date(), 5), 'MMM dd'), count: 5 },
      { date: format(subDays(new Date(), 4), 'MMM dd'), count: 3 },
      { date: format(subDays(new Date(), 3), 'MMM dd'), count: 8 },
      { date: format(subDays(new Date(), 2), 'MMM dd'), count: 6 },
      { date: format(subDays(new Date(), 1), 'MMM dd'), count: 12 },
      { date: format(new Date(), 'MMM dd'), count: grievances.length + 4 },
    ];
  }
  return realData;
};

/**
 * Formats admin dashboard category data for Radial charts.
 */
export const getRadialSectorData = (categoryData: any[]) => {
  if (!categoryData) return [];
  return categoryData.map((cat, index) => ({
    name: cat.category || cat.name,
    value: cat.count || cat.value,
    fill: ['#fbbf24', '#3b82f6', '#10b981', '#ef4444'][index % 4],
  }));
};

/**
 * Formats SLA compliance data for Donut charts.
 */
export const getSLAPercentageData = (slaData: any) => {
  const met = slaData?.resolution_sla_met || 0;
  return [
    { name: 'Met', value: met, fill: '#10b981' },
    { name: 'Breached', value: 100 - met, fill: '#ef4444' }
  ];
};

/**
 * Generates mock global trend data for Admin dashboard.
 */
export const getAdminTrendData = () => {
  return [
    { time: '00:00', reports: 120, resolved: 80 },
    { time: '04:00', reports: 180, resolved: 110 },
    { time: '08:00', reports: 450, resolved: 220 },
    { time: '12:00', reports: 720, resolved: 410 },
    { time: '16:00', reports: 580, resolved: 530 },
    { time: '20:00', reports: 340, resolved: 280 },
    { time: '23:59', reports: 150, resolved: 140 },
  ];
};

/**
 * Dynamic mapping for Officer Task Distribution.
 */
export const getOfficerTaskData = (grievances: any[]) => {
  const counts: Record<string, number> = {};
  grievances.forEach(g => {
    const status = g.status?.replace(/_/g, ' ') || 'OTHER';
    counts[status] = (counts[status] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

/**
 * Generates mock SLA integrity data for SLA Monitoring page.
 */
export const getSLATrendData = () => {
  return [
    { day: 'Mon', breaches: 12, fixed: 10, health: 85 },
    { day: 'Tue', breaches: 8, fixed: 12, health: 88 },
    { day: 'Wed', breaches: 15, fixed: 8, health: 82 },
    { day: 'Thu', breaches: 5, fixed: 15, health: 92 },
    { day: 'Fri', breaches: 10, fixed: 14, health: 90 },
    { day: 'Sat', breaches: 4, fixed: 6, health: 94 },
    { day: 'Sun', breaches: 2, fixed: 8, health: 98 },
  ];
};
