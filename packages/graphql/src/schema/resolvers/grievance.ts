import { apiRequest, type GraphQLContext } from "./http.js";

type RawTimelineEvent = {
  status?: string;
  timestamp?: string;
  description?: string;
  metadata?: unknown;
};

type RawGrievance = {
  grievance_id: string;
  grid_id: string;
  status: string;
  category: string;
  priority: string;
  title: string;
  description: string;
  citizen_id?: string | null;
  citizen_name?: string | null;
  citizen_phone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  location_address?: string | null;
  before_photo_url?: string | null;
  after_photo_url?: string | null;
  ai_category?: string | null;
  ai_priority?: string | null;
  ai_summary?: string | null;
  damage_severity?: number | null;
  assigned_department_id?: string | null;
  assigned_department_name?: string | null;
  assigned_team_id?: string | null;
  assigned_team_name?: string | null;
  submitted_at?: string | null;
  updated_at?: string | null;
  timeline?: RawTimelineEvent[];
};

type RawGrievanceList = {
  count: number;
  items: RawGrievance[];
};

type RawTracking = {
  grid_id: string;
  current_status: string;
  current_sla_type?: string | null;
  sla_remaining_seconds?: number | null;
  sla_deadlines?: Record<string, string>;
  timeline?: RawTimelineEvent[];
  assigned_team_location?: {
    latitude: number;
    longitude: number;
    updated_at?: string | null;
  } | null;
  predicted_eta_minutes?: number | null;
};

function mapTimeline(events: RawTimelineEvent[] | undefined): Array<Record<string, unknown>> {
  return (events ?? []).map((event) => ({
    status: event.status ?? "UPDATED",
    timestamp: event.timestamp ?? new Date(0).toISOString(),
    description: event.description ?? "Status updated",
    ...(event.metadata ? { metadata: event.metadata } : {}),
  }));
}

function mapGrievance(item: RawGrievance): Record<string, unknown> {
  return {
    grievanceId: item.grievance_id,
    gridId: item.grid_id,
    status: item.status,
    category: item.category,
    priority: item.priority,
    title: item.title,
    description: item.description,
    citizenId: item.citizen_id ?? null,
    citizenName: item.citizen_name ?? null,
    citizenPhone: item.citizen_phone ?? null,
    latitude: item.latitude ?? null,
    longitude: item.longitude ?? null,
    locationAddress: item.location_address ?? null,
    beforePhotoUrl: item.before_photo_url ?? null,
    afterPhotoUrl: item.after_photo_url ?? null,
    aiCategory: item.ai_category ?? null,
    aiPriority: item.ai_priority ?? null,
    aiSummary: item.ai_summary ?? null,
    damageSeverity: item.damage_severity ?? null,
    assignedDepartmentId: item.assigned_department_id ?? null,
    assignedDepartmentName: item.assigned_department_name ?? null,
    assignedTeamId: item.assigned_team_id ?? null,
    assignedTeamName: item.assigned_team_name ?? null,
    submittedAt: item.submitted_at ?? null,
    updatedAt: item.updated_at ?? null,
    timeline: mapTimeline(item.timeline),
  };
}

export const grievanceResolvers = {
  Query: {
    async grievance(_: unknown, args: { id: string }, ctx: GraphQLContext): Promise<Record<string, unknown> | null> {
      const payload = await apiRequest<RawGrievance>(`/grievances/${args.id}`, { method: "GET" }, ctx);
      return mapGrievance(payload);
    },

    async grievances(
      _: unknown,
      args: {
        filter?: {
          status?: string;
          category?: string;
          priority?: string;
          department?: string;
          departmentId?: string;
        };
        limit?: number;
        offset?: number;
      },
      ctx: GraphQLContext
    ): Promise<{ count: number; items: Record<string, unknown>[] }> {
      const params = new URLSearchParams();
      const filter = args.filter ?? {};

      if (filter.status) params.set("status", filter.status);
      if (filter.category) params.set("category", filter.category);
      if (filter.priority) params.set("priority", filter.priority);
      if (filter.department) params.set("department", filter.department);
      if (filter.departmentId) params.set("department_id", filter.departmentId);
      if (typeof args.limit === "number") params.set("limit", String(args.limit));
      if (typeof args.offset === "number") params.set("offset", String(args.offset));

      const query = params.toString();
      const payload = await apiRequest<RawGrievanceList>(
        `/grievances${query ? `?${query}` : ""}`,
        { method: "GET" },
        ctx
      );

      return {
        count: payload.count,
        items: payload.items.map(mapGrievance),
      };
    },

    async track(_: unknown, args: { gridId: string }, ctx: GraphQLContext): Promise<Record<string, unknown>> {
      const payload = await apiRequest<RawTracking>(`/track/${args.gridId}`, { method: "GET" }, ctx);
      return {
        gridId: payload.grid_id,
        currentStatus: payload.current_status,
        currentSlaType: payload.current_sla_type ?? null,
        slaRemainingSeconds: payload.sla_remaining_seconds ?? null,
        slaDeadlines: payload.sla_deadlines ?? {},
        timeline: mapTimeline(payload.timeline),
        assignedTeamLocation: payload.assigned_team_location
          ? {
              latitude: payload.assigned_team_location.latitude,
              longitude: payload.assigned_team_location.longitude,
              updatedAt: payload.assigned_team_location.updated_at,
            }
          : null,
        predictedEtaMinutes: payload.predicted_eta_minutes ?? null,
      };
    },
  },

  Mutation: {
    async submitGrievance(
      _: unknown,
      args: {
        input: {
          category?: string;
          priority?: string;
          title: string;
          description: string;
          latitude?: number;
          longitude?: number;
          locationAddress?: string;
          locationText?: string;
          beforePhotoUrl?: string;
          hintCategory?: string;
          hintPriority?: string;
          hintDepartment?: string;
        };
      },
      ctx: GraphQLContext
    ): Promise<Record<string, unknown>> {
      const payload = await apiRequest<Record<string, unknown>>(
        "/grievances",
        {
          method: "POST",
          body: JSON.stringify({
            category: args.input.category,
            priority: args.input.priority,
            title: args.input.title,
            description: args.input.description,
            latitude: args.input.latitude,
            longitude: args.input.longitude,
            location_address: args.input.locationAddress,
            location_text: args.input.locationText,
            before_photo_url: args.input.beforePhotoUrl,
            hint_category: args.input.hintCategory,
            hint_priority: args.input.hintPriority,
            hint_department: args.input.hintDepartment,
          }),
        },
        ctx
      );

      return {
        grievanceId: payload.grievance_id,
        gridId: payload.grid_id,
        processingTaskId: payload.processing_task_id,
        submittedAt: payload.submitted_at,
        responseDeadline: payload.response_deadline,
        resolutionDeadline: payload.resolution_deadline,
        status: payload.status,
      };
    },

    async updateStatus(
      _: unknown,
      args: { id: string; status: string; notes?: string },
      ctx: GraphQLContext
    ): Promise<Record<string, unknown>> {
      await apiRequest(
        `/grievances/${args.id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: args.status, notes: args.notes }),
        },
        ctx
      );

      const grievance = await apiRequest<RawGrievance>(`/grievances/${args.id}`, { method: "GET" }, ctx);
      return mapGrievance(grievance);
    },

    async submitFeedback(
      _: unknown,
      args: { grievanceId: string; rating: number; comment?: string; isSatisfied?: boolean },
      ctx: GraphQLContext
    ): Promise<Record<string, unknown>> {
      const payload = await apiRequest<Record<string, unknown>>(
        `/grievances/${args.grievanceId}/feedback`,
        {
          method: "POST",
          body: JSON.stringify({
            rating: args.rating,
            comment: args.comment,
            is_satisfied: args.isSatisfied,
          }),
        },
        ctx
      );

      return {
        grievanceId: payload.grievance_id,
        rating: payload.rating,
        submittedAt: payload.submitted_at,
        message: payload.message,
      };
    },

    async contestResolution(
      _: unknown,
      args: { grievanceId: string; reason: string; evidencePhoto?: string },
      ctx: GraphQLContext
    ): Promise<Record<string, unknown>> {
      const payload = await apiRequest<Record<string, unknown>>(
        `/grievances/${args.grievanceId}/contest`,
        {
          method: "POST",
          body: JSON.stringify({
            reason: args.reason,
            evidence_photo: args.evidencePhoto,
          }),
        },
        ctx
      );

      return {
        status: payload.status,
        auditTriggered: payload.audit_triggered,
        auditId: payload.audit_id,
        auditTaskId: payload.audit_task_id,
        message: payload.message,
      };
    },
  },
};
