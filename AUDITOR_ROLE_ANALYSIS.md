# Auditor Role Implementation - Comprehensive Analysis

**Generated:** 2026-03-27  
**Status:** Partially Implemented with Integration Gaps

---

## Executive Summary

The **AUDITOR** role is structurally defined across the entire GrievanceGrid system with database schema, backend API endpoints, and frontend components in place. However, there are significant **integration gaps**:

- ✅ Role definition and RBAC guards are implemented
- ✅ Backend audit API endpoints exist and are functional
- ✅ Database schema supports audit workflows  
- ✅ Frontend audit dashboard component exists
- ❌ Frontend services use mock data instead of real API integration
- ❌ Documentation inconsistencies about endpoint status
- ❌ Frontend audit action buttons are not wired to API calls

---

## 1. Role Definition (IMPLEMENTED ✅)

### Database Schema
- **Location:** [packages/database/src/schema.ts](packages/database/src/schema.ts#L21-L27)
- **Type:** PostgreSQL ENUM: `CITIZEN, CREW, OFFICER, ADMIN, AUDITOR, DEPT_HEAD`
- **Table:** `users` table has `role` column with AUDITOR as valid value
- **Default:** `CITIZEN`

```typescript
export const userRoleEnum = pgEnum("user_role", [
  "CITIZEN",
  "CREW",
  "OFFICER",
  "ADMIN",
  "AUDITOR",
  "DEPT_HEAD",
]);
```

### Seed Data
- **Location:** [database/seed.js](database/seed.js#L49), [packages/database/src/seed.ts](packages/database/src/seed.ts#L43-L453)
- **Test Auditor:** 
  - Email: `auditor@example.com`
  - Password: `auditor1`
  - Name: "Audit Officer"
  - ID: `auditor_001`
- **Count:** 12 seeded AUDITOR users by default

### Documentation
- [packages/database/README.md](packages/database/README.md#L34) - Lists AUDITOR role
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#L106) - Support for AUDITOR role noted
- [docs/README.md](docs/README.md#L33) - "Auditor (Independent): Investigate contested cases and verify resolution integrity"

---

## 2. Role-Based Access Control (IMPLEMENTED ✅)

### Backend Authentication Guards
- **Location:** [apps/api/src/core/dependencies.py](apps/api/src/core/dependencies.py#L110-L124)

```python
def check_auditor_role(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    """Check user is auditor or admin."""
    user_role = user.get("role")
    if user_role not in [RoleEnum.AUDITOR, RoleEnum.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"User role '{user_role}' not authorized. Required: AUDITOR or ADMIN",
        )
    return user

require_auditor = check_auditor_role
```

### Status in TODOs
- [todos/backend_todo.md](todos/backend_todo.md#L40): ✅ Marked as implemented

---

## 3. Backend API Endpoints (IMPLEMENTED ✅)

### Core Audit Endpoints
- **Location:** [apps/api/src/api/v1/audits.py](apps/api/src/api/v1/audits.py)
- **All endpoints require** `require_auditor` authentication guard

#### Endpoint 1: List Audits
```python
GET /audits
```
- **Guards:** `require_auditor`
- **What it does:** Lists all contested grievances pending audit review
- **Response Type:** `AuditListResponse` (count + list of `AuditListItem`)
- **Query Params:**
  - `status` - Filter by PENDING, REVIEWED, APPROVED, REJECTED
  - `limit` - Default 50, max 200
  - `offset` - Pagination offset

**Fields Returned:**
```typescript
{
  audit_id: string;
  grievance_id: string;
  grid_id: string;
  reason: string;
  status: string;
  risk_score: float | null;
  created_at: string;
}
```

#### Endpoint 2: Get Audit Detail
```python
GET /audits/{audit_id}
```
- **Guards:** `require_auditor`
- **Response Type:** `AuditDetailResponse`

**Fields Returned:**
```typescript
{
  audit_id: string;
  grievance_id: string;
  grid_id: string;
  title: string;
  description: string;
  reason: string;
  evidence_photo_url: string | null;
  status: string;
  risk_score: float | null;
  ai_recommendation: string | null;
  ai_confidence: float | null;
  validation_notes: string | null;
  validated_by: string | null;
  validated_at: string | null;
  created_at: string;
  updated_at: string | null;
}
```

#### Endpoint 3: Validate Audit (Approve/Reject)
```python
POST /audits/{audit_id}/validate
```
- **Guards:** `require_auditor`
- **Body:**
```typescript
{
  action: "approve" | "reject";
  notes: string | null;  // max 2000 chars
}
```
- **Response Type:** `AuditValidationResponse`
- **Side Effects:**
  - Updates grievance `contest_audit_status` 
  - Sets grievance status to `IN_PROGRESS` (if approve) or `RESOLVED` (if reject)
  - Logs audit event in `audit_logs` table
  - Records validator ID and timestamp

#### Endpoint 4: Audit Statistics
```python
GET /audits/stats
```
- **Guards:** `require_auditor`
- **Response Type:** `AuditStatsResponse`

**Fields Returned:**
```typescript
{
  total_contested: int;
  pending_review: int;
  approved: int;
  rejected: int;
  approval_rate: float;      // percentage
  avg_risk_score: float | null;
}
```

### Implementation Status
- **Location in docs:** [docs/FEATURES_AND_ENDPOINTS.md](docs/FEATURES_AND_ENDPOINTS.md#L375-L382)
- **Documented Status (OLD):** ❌ Missing (Lines 379-382)
- **Documented Status (UPDATED):** ✅ Implemented (Lines 471-474)
- ****ISSUE:** Documentation has conflicting information**

---

## 4. Database Schema for Audits (IMPLEMENTED ✅)

### Audit-Related Fields in `grievances` Table
- **Location:** [packages/database/src/schema.ts](packages/database/src/schema.ts#L229-L239)

```typescript
// Feedback & Contest
citizen_feedback_rating: integer("citizen_feedback_rating"), // 1-5
citizen_feedback_text: text("citizen_feedback_text"),
is_contested: boolean("is_contested").default(false),
contest_reason: text("contest_reason"),
contest_evidence_url: text("contest_evidence_url"),
contest_audit_id: varchar("contest_audit_id", { length: 255 }),
contest_audit_status: varchar("contest_audit_status", { length: 50 }).default("PENDING"),
contest_risk_score: decimal("contest_risk_score", { precision: 3, scale: 2 }),
contest_ai_recommendation: text("contest_ai_recommendation"),
contest_ai_confidence: decimal("contest_ai_confidence", { precision: 3, scale: 2 }),
contest_validation_notes: text("contest_validation_notes"),
contest_validated_by: uuid("contest_validated_by").references(() => users.id),
contest_validated_at: timestamp("contest_validated_at", { withTimezone: true }),
```

### Audit History
- **Table:** `audit_logs` (immutable, append-only)
- **Location:** [packages/database/src/schema.ts](packages/database/src/schema.ts#L270+)
- **Purpose:** Immutable record of all status changes and actions
- **Fields:**
  - `id` - UUID primary key
  - `grievance_id` - FK to grievance
  - `actor_id` - FK to user (auditor who took action)
  - `event_type` - CREATED, STATUS_CHANGED, ESCALATED, AUDITED, etc.
  - `old_status` / `new_status` - Status transition
  - `description` - Human-readable description
  - `metadata` - JSONB for additional context
  - `created_at` - Timestamp

### Indexing
- [packages/database/src/schema.ts](packages/database/src/schema.ts#L258): `contestAuditIdx` on `contest_audit_id`

---

## 5. Frontend Auditor Dashboard (PARTIALLY IMPLEMENTED ⚠️)

### Component Location
- **Component:** [apps/frontend/src/components/other-pages/PendingAuditsPage.tsx](apps/frontend/src/components/other-pages/PendingAuditsPage.tsx)
- **Route:** `/auditor/dashboard` and `/admin/pending-audits`
- **Status:** Component exists with full UI, but **uses mock data**

### Route Configuration
- **File:** [apps/frontend/src/App.tsx](apps/frontend/src/App.tsx#L74)
```typescript
<Route path="/auditor/dashboard" element={<PendingAuditsPage />} />
<Route path="/admin/pending-audits" element={<PendingAuditsPage />} />
```

### Navigation Integration
- **Sidebar:** [apps/frontend/src/components/Sidebar.tsx](apps/frontend/src/components/Sidebar.tsx#L85)
```typescript
{ icon: Clock, label: "Auditor Dashboard", href: "/auditor/dashboard", roles: ["ADMIN", "AUDITOR"] },
```

- **Mobile Nav:** [apps/frontend/src/components/MobileNav.tsx](apps/frontend/src/components/MobileNav.tsx#L31)
```typescript
{ icon: ShieldCheck, label: "Audit", href: "/auditor/dashboard", roles: ["AUDITOR"] },
```

### UI Features
- **Metrics Grid:** Total Pending, In Review, AI Flagged, High Risk
- **Audit List:** Shows audit ID, grievance ID, reason, risk score, status
- **Risk Assessment Panel:** 
  - System analysis description
  - Integrity score
  - Evidence power percentage
  - AI heuristic recommendation
- **Action Buttons:**
  - "Validate Resolution" (Approve) - 🟢 Green button
  - "Flag Void" (Reject) - 🔴 Red button
  - "Open Full Audit Log" - Ghost button with link
- **Anomaly Statistics:** Internal Audit Speed, Citizen Trust Index, Recidivism Prevention

### Styling
- **Theme Colors:** CSS variables `--auditor` set to HSL(38, 92%, 50%)
- **Design System:** Uses shadcn components, Tailwind CSS, Framer Motion

---

## 6. Frontend Audit Service (PROBLEM ❌)

### Service Location
- **File:** [apps/frontend/src/services/audit.service.ts](apps/frontend/src/services/audit.service.ts)

### Issue: Uses Mock Data Throughout
The audit service is **fully stubbed with mock data** instead of calling real API:

```typescript
getPendingAudits: async (): Promise<AuditResult[]> => {
  return apiClient.get("/audits?status=pending", async () => {
    await mockDelay(400);  // ⚠️ Mock delay instead of real API
    
    return [
      {
        audit_id: "audit_001",
        grievance_id: "grievance_123",
        reason: "Pothole returned within 2 days of repair",
        // ... mock data
      },
      // ... more mock audits
    ];
  });
},
```

### All Stubbed Methods
1. `getAuditHistory()` - Mock data with hardcoded events
2. `getAuditResult()` - Mock audit detail with fixed values
3. `getPendingAudits()` - Mock audit list (3 items)
4. `validateAudit()` - Mock POST that returns success
5. `getAuditStats()` - Mock statistics

### Consequence
- Frontend component displays mock data only
- Real audit data from backend is never fetched
- Auditor actions (validate/flag) don't persist to database
- **Not suitable for production use**

---

## 7. Frontend Action Buttons (INCOMPLETE ❌)

### Location
[apps/frontend/src/components/other-pages/PendingAuditsPage.tsx](apps/frontend/src/components/other-pages/PendingAuditsPage.tsx#L220-L226)

### Issue: Buttons Not Wired to API

```typescript
{/* Not calling validateAudit API */}
<Button className="h-14 rounded-2xl bg-emerald-500 text-black font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all text-[10px]">
  <CheckCircle2 className="w-4 h-4 mr-3" /> Validate Resolution
</Button>

<Button variant="outline" className="h-14 rounded-2xl border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black uppercase tracking-[0.2em] transition-all text-[10px]">
  <XCircle className="w-4 h-4 mr-3" /> Flag Void
</Button>
```

**Missing:**
- No `onClick` handlers
- No calls to `auditService.validateAudit()`
- No `action: "approve" | "reject"` parameter

---

## 8. Authentication & Session (IMPLEMENTED ✅)

### Mock Auth Service
- **File:** [apps/frontend/src/services/auth.service.ts](apps/frontend/src/services/auth.service.ts#L84-L88)
- Contains hardcoded auditor credentials for testing

```typescript
'auditor@example.com': {
  id: 'auditor_001',
  email: 'auditor@example.com',
  name: 'Audit Officer',
  role: 'AUDITOR' as UserRole,
```

### Frontend Type Definition
- **File:** [apps/frontend/src/types/index.ts](apps/frontend/src/types/index.ts#L4)
```typescript
export type UserRole = "CITIZEN" | "CREW" | "OFFICER" | "ADMIN" | "AUDITOR";
```

---

## 9. Documentation Analysis

### Inconsistencies Found

#### Issue 1: Conflicting Endpoint Status in FEATURES_AND_ENDPOINTS.md
- **Lines 379-382:** Mark audit endpoints as `❌ Missing`
- **Lines 471-474:** Mark same endpoints as `✅ Implemented`
- **Reality:** Endpoints ARE implemented and functional in backend
- **Impact:** Confusion about what's done vs. what's not

**Evidence:**
```markdown
# Line 379-382 (OLD)
| GET | `/audits/{id}` | Get audit result | Bearer (Admin/Auditor) | ❌ Missing |
| GET | `/audits` | List pending audits | Bearer (Admin/Auditor) | ❌ Missing |
| POST | `/audits/{id}/validate` | Validate audit (approve/reject) | Bearer (Admin/Auditor) | ❌ Missing |
| GET | `/audits/stats` | Get audit statistics | Bearer (Admin/Auditor) | ❌ Missing |

# Line 471-474 (UPDATED)
14. GET /audits/{id} ✅
15. GET /audits ✅
16. POST /audits/{id}/validate ✅
17. GET /audits/stats ✅
```

#### Issue 2: Frontend TODO Lists Missing Audit Services
- [todos/frontend_todo.md](todos/frontend_todo.md#L3-L10) mentions replacing mock services
- NO specific mention of audit service needing real API integration
- Audit dashboard is listed in components but status unclear

---

## 10. What's Missing or Broken

### Missing (❌)

1. **Frontend-to-Backend Integration**
   - `audit.service.ts` doesn't call real `/audits/*` endpoints
   - Should use `apiClient.get()`, `apiClient.post()` with real endpoints
   - Needs bearer token injection from auth service

2. **Action Button Handlers**
   - "Validate Resolution" button has no `onClick` logic
   - "Flag Void" button has no `onClick` logic
   - Should call `auditService.validateAudit(auditId, action, notes)`
   - Should refresh audit list after success

3. **Audit Detail View**
   - Frontend shows detail panel but doesn't fetch individual audit
   - Should call `auditService.getAuditResult(audit_id)` when audit is selected
   - Currently uses list item data only

4. **Real-Time Updates**
   - No WebSocket for live audit status updates
   - Manual refresh needed (`Sync Vault` button calls `window.location.reload()`)
   - Should use WebSocket `/ws/audits` for live changes

5. **Error Handling**
   - No error boundary in audit component
   - No retry logic on failed audit fetches
   - No user-facing error messages

6. **Audit Notes/Comments**
   - Validation modal doesn't appear
   - No text input for audit notes when approving/rejecting
   - Should show modal with notes textarea

### Incomplete (⚠️)

1. **Frontend Authentication Integration**
   - Still using mock auth service
   - Real JWT tokens not being sent to backend
   - No refresh token handling

2. **Documentation Updates**
   - Need to remove "❌ Missing" status from audit endpoints in docs
   - Add clarification that endpoints are implemented
   - Update frontend TODO to list audit service as priority

3. **Audit Log Timeline**
   - Component not showing full audit_logs history
   - Should display immutable event trail with timestamps

---

## 11. Database Data Flow

### Creating a Contested Grievance (Triggers Audit)
1. **Command:** [apps/api/src/repositories/grievances.py](apps/api/src/repositories/grievances.py#L490-L492)
```python
UPDATE grievances
SET
  is_contested = true,
  contest_reason = :reason,
  contest_evidence_url = :evidence_photo
WHERE id = :grievance_id
```

2. **API Endpoint:** [POST /grievances/{id}/contest](apps/api/src/api/v1/grievances.py#L498)
   - Calls `run_contestation_audit` Celery task
   - Triggers AI audit process in background worker

3. **Audit Task:** [apps/worker/src/tasks/ai_processing.py](apps/worker/src/tasks/ai_processing.py)
   - AI evaluates contested resolution
   - Computes risk_score, AI recommendation
   - Updates grievance with `contest_audit_id`, `contest_risk_score`, etc.

### Auditor Reviews & Validates
1. **Fetches list:** `GET /audits`
   - Queries grievances WHERE `is_contested = true`
   - Returns pending and reviewed audits

2. **Gets detail:** `GET /audits/{audit_id}`
   - Finds grievance by `contest_audit_id`
   - Returns full audit details with AI recommendation

3. **Validates:** `POST /audits/{audit_id}/validate`
   - Updates `contest_audit_status` to `APPROVED` or `REJECTED`
   - Updates `contest_validated_by` (auditor ID)
   - Updates `contest_validated_at` (timestamp)
   - Updates grievance status:
     - If APPROVED → `IN_PROGRESS` (reopens case)
     - If REJECTED → `RESOLVED` (keeps original)
   - Logs event in `audit_logs` table

---

## 12. Recommended Fixes

### Priority 1 (Critical - Blocks Production)
- [ ] **[WIP-1]** Connect frontend audit service to real `/audits/*` endpoints
  - File: [apps/frontend/src/services/audit.service.ts](apps/frontend/src/services/audit.service.ts)
  - Task: Replace mock delays with actual API calls
  - Expected: `axios.get/post()` calls to backend

- [ ] **[WIP-2]** Wire action buttons to API callbacks
  - File: [apps/frontend/src/components/other-pages/PendingAuditsPage.tsx](apps/frontend/src/components/other-pages/PendingAuditsPage.tsx#L220-L226)
  - Task: Add onClick handlers that call `validateAudit()`
  - Expected: Approve/reject buttons trigger API calls

- [ ] **[WIP-3]** Add audit validation modal with notes textarea
  - File: [apps/frontend/src/components/other-pages/PendingAuditsPage.tsx](apps/frontend/src/components/other-pages/PendingAuditsPage.tsx)
  - Task: Show modal before validating, collect notes
  - Expected: `notes` parameter sent to API

### Priority 2 (High - Completes Feature)
- [ ] **[WIP-4]** Fetch individual audit details on select
  - When auditor clicks an audit in list, call `getAuditDetail(audit.audit_id)`
  - Replace assessment panel data with API response

- [ ] **[WIP-5]** Add real-time WebSocket for audit updates
  - File: `apps/api/src/api/v1/audits.py` + frontend
  - Task: Create `/ws/audits` WebSocket for live status push
  - Expected: Live updates without page refresh

- [ ] **[WIP-6]** Update documentation
  - Remove "❌ Missing" status from FEATURES_AND_ENDPOINTS.md
  - Add implementation notes for auditor endpoints
  - Link to frontend integration status

### Priority 3 (Nice to Have)
- [ ] Show full audit timeline from `audit_logs` table
- [ ] Add audit statistics dashboard with charts
- [ ] Implement audit search/filter UI
- [ ] Add role-based UI visibility for AUDITOR-only features
- [ ] Email notifications when audit assigned

---

## 13. Testing Strategy

### Backend API Testing
- **Endpoint:** All 4 audit endpoints exist and are guarded
- **Test:** Use cURL or Postman with Bearer token for AUDITOR role
- **Expected:** 200 OK with proper response models

### Frontend Integration Testing
- **Manual:** Log in as auditor, navigate to `/auditor/dashboard`
- **Expected:** See real contested grievances (not mock data)
- **Action:** Click "Validate Resolution", should show modal and persist to DB

### Database Verification
- Query `grievances` table for `is_contested = true` records
- Verify `contest_audit_id`, `contest_risk_score`, `contest_ai_recommendation` are populated
- Check `audit_logs` for AUDITED event entries

---

## 14. Code Maps

### Key Files Summary
| Component | File | Status |
|-----------|------|--------|
| Role Definition | `packages/database/src/schema.ts` | ✅ Complete |
| RBAC Guards | `apps/api/src/core/dependencies.py` | ✅ Complete |
| Audit API Endpoints | `apps/api/src/api/v1/audits.py` | ✅ Complete |
| DB Schema | `packages/database/src/schema.ts` | ✅ Complete |
| Frontend Component | `apps/frontend/src/components/other-pages/PendingAuditsPage.tsx` | ⚠️ Partial (UI only) |
| Frontend Service | `apps/frontend/src/services/audit.service.ts` | ❌ Mock only |
| Route Config | `apps/frontend/src/App.tsx` | ✅ Complete |
| Navigation | `apps/frontend/src/components/Sidebar.tsx`, `MobileNav.tsx` | ✅ Complete |
| Documentation | `docs/FEATURES_AND_ENDPOINTS.md` | ⚠️ Inconsistent |

---

## 15. Conclusion

The **Auditor role implementation is 60% complete:**

- ✅ **60%:** Role definition, RBAC, backend API, database schema all functional
- ⚠️ **30%:** Frontend component exists but uses mock data
- ❌ **10%:** Frontend-to-backend integration not connected

**To move to production, the critical path is:**
1. Connect frontend audit service to backend API
2. Wire audit action buttons to validation endpoints
3. Add audit notes modal
4. Update documentation to reflect true status
5. Run E2E tests for full workflow

**Estimated effort:** 2-3 days for a single developer
