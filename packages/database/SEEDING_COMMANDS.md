# GrievanceGrid Database Seeding Commands

This document provides comprehensive information about all available database seeding commands for the GrievanceGrid application.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Seeding Commands](#seeding-commands)
- [Verification Commands](#verification-commands)
- [Database Management](#database-management)
- [Comprehensive Commands](#comprehensive-commands)
- [Data Details](#data-details)
- [Usage Examples](#usage-examples)

## 🚀 Quick Start

### For Admin Dashboard Testing
```bash
cd packages/database
npm run db:seed:admin
```

### For Officer Workflow Testing
```bash
cd packages/database
npm run db:seed:demo:full
```

### For Basic Testing
```bash
cd packages/database
npm run db:seed:simple:full
```

## 🌱 Seeding Commands

### Demo Seed (`db:seed:demo`)
**Purpose:** Creates demo data matching LoginPage credentials for basic testing

**Command:**
```bash
npm run db:seed:demo
```

**Data Created:**
- **Users:** 7 (Admin, Officer, Crew, Auditor, 3 Citizens)
- **Departments:** 6 (PWD, WSD, SND, ELD, PTD, ENV)
- **Teams:** 4 response teams
- **Grievances:** 10 with various statuses and priorities

**Demo Credentials (LoginPage Compatible):**
- Admin: `admin1@example.com / admin1`
- Officer: `officer1@example.com / officer1`
- Crew: `crew1@example.com / crew1`
- Auditor: `auditor1@example.com / auditor1`
- Citizen: `citizen1@example.com / citizen1`

**Use Case:** Perfect for testing officer workflows, basic functionality, and login scenarios

---

### Simple Seed (`db:seed:simple`)
**Purpose:** Creates basic test data for simple testing scenarios

**Command:**
```bash
npm run db:seed:simple
```

**Data Created:**
- **Users:** Basic set of test users
- **Departments:** Essential departments
- **Grievances:** Small number of test grievances

**Use Case:** Quick setup for basic feature testing

---

### Bulk Seed (`db:seed:bulk`)
**Purpose:** Creates large dataset for admin dashboard testing

**Command:**
```bash
npm run db:seed:bulk
```

**Data Created:**
- **Grievances:** 900+ (in addition to existing data)
- **Time Period:** 90 days of historical data
- **Categories:** All 9 grievance categories
- **Statuses:** Full workflow representation
- **Priorities:** Balanced distribution

**Statistics:**
- **Active grievances:** ~834 (91.6%)
- **Critical issues:** ~214 (23.5%)
- **High priority unresolved:** ~417 (45.8%)
- **Officer assigned:** ~264 (29.0%)
- **Recent activity:** ~72 in last 7 days

**Use Case:** Admin dashboard performance testing, chart rendering, large dataset handling

---

### Large Dataset Seeds

#### Standard Large (`db:seed`)
```bash
npm run db:seed
```
- **Grievances:** 10,000
- **Features:** Complex data with full relationships

#### Extra Large (`db:seed:large`)
```bash
npm run db:seed:large
```
- **Grievances:** 50,000
- **Features:** Stress testing for performance

#### Maximum (`db:seed:xlarge`)
```bash
npm run db:seed:xlarge
```
- **Grievances:** 200,000
- **Features:** Maximum stress testing

## 🔍 Verification Commands

### Bulk Verification (`db:verify`)
```bash
npm run db:verify
```
**Purpose:** Verifies bulk seed data and provides comprehensive statistics

**Output:**
- Total grievances and users
- Status breakdown with percentages
- Priority distribution
- Category breakdown
- Officer assignment metrics
- Recent activity analysis

---

### Demo Verification (`db:verify:demo`)
```bash
npm run db:verify:demo
```
**Purpose:** Verifies demo seed data and LoginPage credentials

**Output:**
- Demo credentials validation
- User role breakdown
- Basic grievance statistics
- Department assignments

---

### Simple Verification (`db:verify:simple`)
```bash
npm run db:verify:simple
```
**Purpose:** Verifies simple seed data

**Output:**
- Basic data counts
- User and department breakdowns
- Simple statistics

## 🧹 Database Cleaning

### Database Clean (`db:clean`)
**Purpose:** Safely removes all data from database while preserving schema

**Command:**
```bash
npm run db:clean
```

**Features:**
- **Safe truncate** of all tables with CASCADE
- **Shows current data** before cleaning
- **3-second countdown** to allow cancellation
- **Verification** after cleaning
- **Preserves table structure** (columns, indexes, etc.)

**What Gets Cleaned:**
- Users, grievances, departments, teams
- Sessions, audit logs, metrics
- All related tables

**Use Case:** Perfect for starting fresh without affecting database schema

---

## 🛠️ Database Management

### Schema Management
```bash
npm run db:generate     # Generate schema files
npm run db:push         # Push schema to database
npm run db:migrate      # Run database migrations
```

### Data Management
```bash
npm run db:clean        # Clean all data from database (safe truncate)
npm run db:empty        # Clear all tables (alternative clean)
npm run db:studio       # Open Drizzle Studio (port 4984)
```

### Complete Setup
```bash
npm run db:setup        # Generate schema + push + seed
```

### Hackathon Presentation Seed (`db:seed:hackathon`)
**Purpose:** Complete dataset for hackathon presentation with all roles

**Command:**
```bash
npm run db:seed:hackathon
```

**What It Creates:**
- **15 Users** across all roles:
  - 2 Admin users
  - 3 Officer users  
  - 3 Crew users
  - 2 Auditor users
  - 5 Citizen users
- **6 Departments** (PWD, WSD, SND, ELD, PTD, ENV)
- **4 Teams** for department assignments
- **200 Grievances** with varied statuses and priorities

**Demo Credentials:**
- Admin: `admin1@example.com / admin1`
- Officer: `officer1@example.com / officer1`
- Crew: `crew1@example.com / crew1`
- Auditor: `auditor1@example.com / auditor1`
- Citizen: `citizen1@example.com / citizen1`

**Use Case:** Perfect for hackathon presentations - shows complete workflow for all roles

**⚠️ Deletes existing data before seeding**

---

## 🎯 Comprehensive Commands

### Admin Dashboard Setup
```bash
npm run db:seed:admin
```
**What it does:**
1. Runs demo seed (credentials + basic data)
2. Runs bulk seed (900+ grievances)
3. Runs bulk verification
4. **Result:** Complete admin dashboard dataset

### Complete Demo Setup
```bash
npm run db:seed:demo:full
```
**What it does:**
1. Runs demo seed
2. Runs demo verification
3. **Result:** Verified demo environment

### Complete Simple Setup
```bash
npm run db:seed:simple:full
```
**What it does:**
1. Runs simple seed
2. Runs simple verification
3. **Result:** Verified simple test environment

### Maximum Dataset
```bash
npm run db:seed:all
```
**What it does:**
1. Runs demo seed
2. Runs bulk seed
3. Runs bulk verification
4. Runs demo verification
5. **Result:** Maximum verified dataset

## 📊 Data Details

### User Roles Available
- **ADMIN:** Full system access
- **OFFICER:** Grievance management
- **CREW:** Field operations
- **AUDITOR:** Audit and compliance
- **CITIZEN:** Grievance submission

### Grievance Categories
1. **ROADS** - Road infrastructure issues
2. **WATER_SUPPLY** - Water supply problems
3. **SANITATION** - Waste management
4. **ELECTRICITY** - Power issues
5. **PUBLIC_TRANSPORT** - Transportation
6. **ENVIRONMENT** - Environmental concerns
7. **BUILDING_VIOLATION** - Construction issues
8. **INFRASTRUCTURE** - Public infrastructure
9. **OTHER** - Miscellaneous issues

### Priority Levels
- **CRITICAL** - Immediate attention required
- **HIGH** - Urgent attention needed
- **MEDIUM** - Normal priority
- **LOW** - Can be scheduled

### Status Workflow
1. **CREATED** - Initial submission
2. **PENDING_CLASSIFICATION** - AI processing
3. **PENDING_ASSIGNMENT** - Waiting for department
4. **ASSIGNED** - Officer assigned
5. **IN_PROGRESS** - Being worked on
6. **PENDING_VERIFICATION** - Resolution verification
7. **VERIFIED** - Resolution confirmed
8. **RESOLVED** - Issue resolved
9. **ESCALATED** - Escalated to higher level
10. **CONTESTED** - Resolution contested

## 💡 Usage Examples

### Scenario 1: New Developer Setup
```bash
cd packages/database
npm run db:empty          # Start fresh
npm run db:setup          # Complete setup
```

### Scenario 2: Admin Dashboard Testing
```bash
cd packages/database
npm run db:seed:admin     # Full admin dataset
```

### Scenario 3: Officer Workflow Testing
```bash
cd packages/database
npm run db:seed:demo:full  # Demo + verification
```

### Scenario 4: Performance Testing
```bash
cd packages/database
npm run db:seed:large     # 50K grievances
npm run db:verify         # Check results
```

### Scenario 5: Quick Feature Testing
```bash
cd packages/database
npm run db:seed:simple:full # Quick setup
```

## 🔧 Environment Setup

Ensure your `.env.local` file is properly configured:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

## 📝 Notes

- All commands should be run from `packages/database` directory
- Bulk seeding may take several minutes for large datasets
- Verification commands provide detailed statistics
- Demo credentials are designed to match frontend LoginPage
- Database is automatically backed up before major operations

## 🚨 Important

- Always run verification after seeding to ensure data integrity
- Use `db:empty` to clear data before reseeding
- Large datasets may require increased database resources
- Test with smaller datasets first before using large seeds

---

**Last Updated:** March 27, 2026  
**Version:** 1.0.0
