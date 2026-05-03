**SkillBridge**

Government Placement Coordination Portal

*Product Requirements Document  •  v1.0*

|**Document Status**|Draft — Ready for Engineering|
| :- | :- |
|**Version**|1\.0|
|**Prepared For**|Claude Code / AI Engineering Agent|
|**Stack**|Next.js 14 (App Router) · MongoDB · Tailwind CSS · shadcn/ui · NextAuth.js|
|**Auth**|Google SSO (OAuth 2.0)|
|**Target Release**|V1 MVP|


# **1. Executive Summary**
SkillBridge is a government-grade web portal that digitises and centralises the placement coordination pipeline between government educational institutions (ITI colleges, polytechnics, engineering colleges) and industry recruiters across India. It eliminates the current fragmented, offline, email-driven process by providing a structured, auditable, state-scoped workflow — from job requirement posting by industry, to talent pool submission by faculty placement coordinators, through to recruiter shortlisting and final status tracking.

The platform has three distinct user roles and a tightly governed approval workflow. No user can operate on the platform until a Super Admin verifies and activates their account. This document is an engineering-grade specification intended to be consumed directly by an AI coding agent or a development team to build the full working prototype.

# **2. Problem Statement**
Government college placement coordinators currently operate in near-complete isolation. Their process for connecting with industry recruiters involves cold emails, phone calls, and physical visits — all untracked and unauditable. Industry recruiters receive fragmented, inconsistently formatted applications from hundreds of institutions with no standard way to specify their requirements or manage incoming talent pools.

|**Pain Point**|**Who Feels It**|**Current Workaround**|
| :- | :- | :- |
|No central channel to discover industry job requirements|Faculty Coordinator|Personal networks, job fairs|
|Cannot target requirements by qualification (ITI vs B.Tech vs M.Tech)|Industry Recruiter|Receives mixed, irrelevant profiles|
|No structured way to submit a pool of student resumes|Faculty Coordinator|Email zip files of CVs|
|Zero visibility into application status after submission|Faculty Coordinator|Follow-up calls to HR|
|No pan-institutional view of placement rates for govt. oversight|State Admin|Manual Excel aggregation|
|Resume batches go to wrong institutions due to geography mismatch|Industry Recruiter|Manual filtering|


# **3. Actors & Roles**
The system has exactly three user roles. No student accounts exist. Students are represented entirely by their faculty coordinator.

## **3.1 Super Admin**

|<p>**Super Admin Capabilities**</p><p>- Single account created via environment seed script (not self-registerable)</p><p>- Approves or rejects all incoming Industry Recruiter and Faculty Coordinator registration requests</p><p>- Can deactivate or suspend any account at any time</p><p>- Has read-only view of all job postings, talent pool submissions, and application statuses across the entire platform</p><p>- Can manage the master list of qualifying institution types, qualification levels, and Indian states</p><p>- Receives email digest of pending approvals daily</p><p>- Cannot post jobs or submit talent pools — administrative role only</p>|
| :- |

## **3.2 Faculty Placement Coordinator**

|<p>**Faculty Placement Coordinator Capabilities**</p><p>- Represents a single government college / polytechnic / ITI institute</p><p>- Registers using any Google account — role is not domain-inferred; Super Admin grants the Coordinator role explicitly</p><p>- Fills an institution profile: college name, state, district, AICTE/DTE code, institution type (ITI / Polytechnic / Engineering College / University)</p><p>- Creates and manages Talent Pool Batches — structured groups of students with shared qualifying attributes</p><p>- Within each batch: uploads individual student resumes (PDF), enters structured data per student</p><p>- Browses industry Job Requirements filtered by their state (and pan-India postings)</p><p>- Applies to a Job Requirement on behalf of a Talent Pool Batch</p><p>- Receives status updates when a recruiter shortlists, rejects, or marks students as selected</p><p>- Views a dashboard of all applications, their statuses, and historical placement data</p>|
| :- |

## **3.3 Industry Recruiter**

|<p>**Industry Recruiter Capabilities**</p><p>- Represents a single company (ITC, Nestle, Britannia, etc.)</p><p>- Registers using a company email address — the email domain (e.g. @itcltd.com) is stored as the company identifier</p><p>- Super Admin verifies the company domain is legitimate before activating the account</p><p>- Creates Job Requirements: title, description, role, qualification slots (N seats for ITI / B.Tech / M.Tech / Diploma), location, geography scope (state-specific or pan-India), salary range, application deadline</p><p>- Views incoming Talent Pool Batch applications against each Job Requirement</p><p>- Can bulk-download all resumes for a batch as a ZIP file</p><p>- Can in-portal shortlist / reject / mark-as-selected individual students within a submitted batch</p><p>- Views a recruiter dashboard: open requirements, applications received, shortlisting progress</p><p>- Can close a Job Requirement once filled or expired</p>|
| :- |


# **4. Authentication & Authorisation**
## **4.1 Authentication Method**
All authentication is handled exclusively via Google OAuth 2.0 (SSO) using NextAuth.js. There are no username/password credentials stored on the platform. Users must have a Google account to register or log in.

## **4.2 Role Determination Logic**
Role is NOT auto-determined from email domain for coordinators. The flow is:

1. User clicks 'Register' and authenticates with Google OAuth
1. After OAuth, user is presented with a Registration Form to declare their role: 'I am a Faculty Placement Coordinator' OR 'I am an Industry Recruiter'
1. Coordinators fill: Full name, designation, college name, state, district, institution type, AICTE/DTE code, phone number
1. Industry Recruiters fill: Full name, designation, company name, company email domain (auto-filled from Google account email domain), company website, phone number, industry sector
1. Both submit a registration request — account is set to PENDING status
1. Super Admin receives email notification and reviews the request in the admin panel
1. Super Admin approves or rejects. On approval, the user receives an email and can now log in
1. On all subsequent logins via Google SSO, NextAuth session carries: userId, role, institutionId/companyId, approvalStatus, state

## **4.3 Access Control Matrix**

|**Action**|**Super Admin**|**Coordinator**|**Industry Recruiter**|
| :- | :- | :- | :- |
|Approve / reject registrations|✅|❌|❌|
|Post Job Requirements|❌|❌|✅|
|Browse Job Requirements|✅ (read)|✅|✅ (own only)|
|Create Talent Pool Batch|❌|✅|❌|
|Apply to Job Requirement|❌|✅|❌|
|View submitted applications|✅ (all)|✅ (own)|✅ (received)|
|Shortlist / reject students|❌|❌|✅|
|Download resume ZIP|❌|❌|✅|
|View platform-wide analytics|✅|❌|❌|
|Deactivate accounts|✅|❌|❌|


# **5. Data Models (MongoDB Collections)**
All models use Mongoose ODM. ObjectId references are used for foreign keys. Timestamps (createdAt, updatedAt) are enabled on all models via mongoose timestamps option.

## **5.1 users**

|**Field**|**Type**|**Notes**|
| :- | :- | :- |
|\_id|ObjectId|Auto-generated|
|googleId|String (unique)|OAuth subject identifier|
|email|String (unique)|From Google profile|
|name|String|From Google profile|
|profileImage|String|Google avatar URL|
|role|Enum: super\_admin | coordinator | recruiter|Set on registration form submission|
|approvalStatus|Enum: pending | approved | rejected | suspended|Default: pending|
|institutionId|ObjectId → institutions|Populated for coordinator role|
|companyId|ObjectId → companies|Populated for recruiter role|
|phone|String|Collected at registration|
|designation|String|Collected at registration|
|state|String|Indian state — coordinator's college state|
|lastLoginAt|Date||
|approvedBy|ObjectId → users|Super Admin who approved|
|approvedAt|Date||
|rejectionReason|String|Admin note if rejected|

## **5.2 institutions**

|**Field**|**Type**|**Notes**|
| :- | :- | :- |
|\_id|ObjectId||
|name|String|College / ITI / Polytechnic full name|
|type|Enum: ITI | Polytechnic | Engineering College | University | Other||
|aicteCode|String|AICTE or DTE affiliation code|
|state|String|Indian state|
|district|String||
|address|String||
|website|String|Optional|
|coordinatorId|ObjectId → users|Primary coordinator (1:1 for MVP)|

## **5.3 companies**

|**Field**|**Type**|**Notes**|
| :- | :- | :- |
|\_id|ObjectId||
|name|String|Company legal name|
|emailDomain|String|e.g. itcltd.com — used to associate users|
|website|String||
|sector|String|e.g. FMCG, Manufacturing, IT|
|address|String||
|verifiedAt|Date|Set by admin on approval|

## **5.4 jobRequirements**

|**Field**|**Type**|**Notes**|
| :- | :- | :- |
|\_id|ObjectId||
|companyId|ObjectId → companies||
|postedBy|ObjectId → users|Recruiter user|
|title|String|e.g. 'Plant Operator Trainee'|
|description|String (rich text)|Role description, responsibilities|
|location|String|Work location city/site|
|state|String|Job location state|
|geographyScope|Enum: state | pan\_india|Determines coordinator visibility|
|slots|Array of SlotSchema|See below|
|salaryMin|Number|Monthly CTC in INR|
|salaryMax|Number|Monthly CTC in INR|
|applicationDeadline|Date||
|status|Enum: draft | open | closed | filled||
|sector|String|Industry sector|
|skills|Array[String]|Required skills / tools|
|experienceLevel|Enum: fresher | 0-2yr | 2-5yr||
|closedAt|Date|When recruiter closes the posting|

SlotSchema (embedded in jobRequirements.slots array):

|**Field**|**Type**|**Notes**|
| :- | :- | :- |
|qualification|Enum: ITI | Diploma | B.Tech | M.Tech | B.Sc | MBA | Other||
|branch|String|e.g. 'Electrical', 'Mechanical', 'Computer Science'|
|seats|Number|Number of candidates needed|
|filledSeats|Number|Incremented as students are marked selected|

## **5.5 talentPoolBatches**

|**Field**|**Type**|**Notes**|
| :- | :- | :- |
|\_id|ObjectId||
|institutionId|ObjectId → institutions||
|coordinatorId|ObjectId → users||
|name|String|e.g. 'Electrical ITI Batch 2024'|
|qualification|Enum: ITI | Diploma | B.Tech | M.Tech | B.Sc | MBA | Other|All students in batch share this|
|branch|String|e.g. 'Electrical'|
|passingYear|Number|Graduation year|
|totalStudents|Number|Count of student records in batch|
|students|Array of StudentSchema|Embedded student records|
|status|Enum: draft | active | archived||

StudentSchema (embedded in talentPoolBatches.students array):

|**Field**|**Type**|**Notes**|
| :- | :- | :- |
|\_id|ObjectId||
|name|String|Student full name|
|rollNumber|String|Institutional roll number|
|dob|Date||
|gender|Enum: Male | Female | Other||
|cgpa|Number|Or percentage|
|skills|Array[String]|Relevant skills|
|resumeUrl|String|S3/cloud storage URL of uploaded PDF|
|resumeOriginalName|String|Original file name|
|phone|String||
|email|String|Personal email (optional)|
|address|String|Home state/district|
|languagesKnown|Array[String]||
|certifications|Array[String]||

## **5.6 applications**

|**Field**|**Type**|**Notes**|
| :- | :- | :- |
|\_id|ObjectId||
|jobRequirementId|ObjectId → jobRequirements||
|talentPoolBatchId|ObjectId → talentPoolBatches||
|coordinatorId|ObjectId → users||
|companyId|ObjectId → companies|Denormalised for fast queries|
|status|Enum: submitted | under\_review | shortlisting | closed|Application-level status|
|coverNote|String|Coordinator's note to recruiter|
|studentStatuses|Array of StudentStatusSchema|Per-student status within this application|
|submittedAt|Date||
|lastUpdatedBy|ObjectId → users||
|resumeZipUrl|String|Generated on-demand, stored temporarily|

StudentStatusSchema (embedded in applications.studentStatuses):

|**Field**|**Type**|**Notes**|
| :- | :- | :- |
|studentId|ObjectId (ref talentPoolBatches.students.\_id)||
|status|Enum: applied | shortlisted | rejected | selected | on\_hold||
|recruiterNote|String|Internal recruiter note|
|updatedAt|Date||

## **5.7 notifications**

|**Field**|**Type**|**Notes**|
| :- | :- | :- |
|\_id|ObjectId||
|userId|ObjectId → users|Recipient|
|type|String|Enum of notification types (see Section 9)|
|message|String|Human-readable notification text|
|link|String|Deep link path in the app|
|read|Boolean|Default false|
|createdAt|Date||

# **6. Feature Specifications**
## **6.1 Registration & Onboarding Flow**
### **6.1.1 Landing Page**
- Public landing page with hero section explaining the platform's purpose
- Two CTA buttons: 'Register as Faculty Coordinator' and 'Register as Industry Recruiter'
- 'Login' button for existing users — redirects to Google OAuth
- Platform stats widget: total institutions, total companies, total placements facilitated (real-time from DB)

### **6.1.2 Registration Flow (Post-Google OAuth)**
- After Google OAuth callback, system checks if googleId exists in DB
- If new user: redirect to /register with role selection step
- Role selection: two large cards — 'I represent a Government College / ITI' vs 'I represent a Company / Industry'
- Coordinator form fields: Full Name (pre-filled from Google), Designation, Institution Name, Institution Type (dropdown), State (dropdown — all Indian states), District, AICTE/DTE Code, Official Phone
- Recruiter form fields: Full Name (pre-filled from Google), Designation, Company Name, Company Email Domain (auto-filled from Google email), Company Website, Sector (dropdown), Official Phone
- On submit: user record created with approvalStatus: pending. Session not yet active for protected routes
- User sees: 'Your registration is under review. You will receive an email once approved.' page
- If existing user with approved status: redirect to role-appropriate dashboard
- If existing user with pending status: show pending page
- If existing user with rejected status: show rejection reason and contact info

## **6.2 Super Admin Panel**
### **6.2.1 Admin Dashboard — /admin**
- Accessible only to users with role: super\_admin
- Summary cards: Pending Approvals count, Total Coordinators, Total Recruiters, Total Job Postings, Total Applications
- Quick action: Pending Approvals table with Approve / Reject buttons inline
- Recent activity feed: last 20 registrations, job postings, applications

### **6.2.2 Approval Management — /admin/approvals**
- Tabbed view: Pending | Approved | Rejected
- Each pending card shows: name, email, role declared, institution/company details submitted, registration date
- Admin can click 'View Details' to see full submitted form data
- Approve button: sets approvalStatus to approved, sends approval email, creates institution or company record if not exists
- Reject button: opens modal asking for rejection reason (required text field), sets status to rejected, sends rejection email with reason
- Search and filter by: role, state, registration date

### **6.2.3 User Management — /admin/users**
- Full list of all users with filters: role, state, approval status
- Can suspend / reinstate any account (sets approvalStatus: suspended / approved)
- Cannot delete accounts — audit trail must be preserved
- View individual user's full activity: job postings, applications, batch submissions

### **6.2.4 Platform Analytics — /admin/analytics**
- Total job requirements posted by state, by sector, by qualification type — bar charts
- Total talent pool submissions: by institution type, by state, by qualification
- Placement conversion rate: applications submitted → shortlisted → selected (funnel chart)
- Top 10 most active companies (by job postings)
- Top 10 most active institutions (by talent pool applications)
- Time series: registrations per month, applications per month
- Export all charts data as CSV

## **6.3 Industry Recruiter Features**
### **6.3.1 Recruiter Dashboard — /recruiter**
- Summary cards: Open Job Requirements, Total Applications Received, Students Shortlisted, Students Selected
- Active Job Requirements list with status badges and quick links
- Recent applications received (last 7 days) with coordinator and institution name
- Upcoming deadlines widget

### **6.3.2 Post a Job Requirement — /recruiter/jobs/new**
Form fields — all required unless marked optional:

- Job Title (text input)
- Job Description (rich text editor — markdown rendered, using a lightweight editor like react-md-editor)
- Sector (dropdown — auto-filled from company profile, editable)
- Work Location — City (text) + State (dropdown)
- Geography Scope: radio — 'This state only' (defaults to company's state) OR 'Pan-India (all states)'
- Qualification Slots — dynamic, repeatable section:
  - `  `Add Slot button adds a row: Qualification (dropdown) | Branch/Specialisation (text) | Number of Seats (number input)
  - `  `Minimum 1 slot required, maximum 10 slots
- Salary Range — Min (INR/month) and Max (INR/month) — optional
- Required Skills (tag input — comma-separated or enter-to-add)
- Experience Level (dropdown: Fresher / 0–2 years / 2–5 years)
- Application Deadline (date picker — must be future date)
- Save as Draft / Publish buttons
- On Publish: status set to open, visible to coordinators matching geography scope

### **6.3.3 Manage Job Requirements — /recruiter/jobs**
- List of all job requirements: Draft | Open | Closed | Filled — filtered by tab
- Each card shows: title, slots summary (e.g. '100 ITI · 5 B.Tech · 4 M.Tech'), deadline, applications count, seats filled
- Edit button available for Draft and Open postings
- Close button: sets status to closed (no new applications accepted). Requires confirmation modal
- View Applications button: navigates to application management for that job

### **6.3.4 Application Management — /recruiter/jobs/[jobId]/applications**
- Lists all talent pool batch applications submitted for this job requirement
- Each application card: institution name, coordinator name, state, qualification type, student count, submission date, application status badge
- Expand application: shows student-level table with columns: Name, Roll No., CGPA, Skills, Resume link, Status dropdown
- Status dropdown per student: Applied | Shortlisted | On Hold | Rejected | Selected
- Recruiter can change any student's status — change is saved immediately with optimistic UI
- 'Download All Resumes as ZIP' button: triggers server-side ZIP generation of all PDFs in this batch application, returns download link (valid for 1 hour)
- 'Download Shortlisted Resumes' button: same but only shortlisted students
- Bulk actions: Select all → Mark as Shortlisted / Mark as Rejected
- Add internal recruiter note per student (visible only to recruiter)
- Application-level status auto-updates: submitted → under\_review (when recruiter first opens) → shortlisting (when first status change made)
- Coordinator receives in-app + email notification on every status change

## **6.4 Faculty Coordinator Features**
### **6.4.1 Coordinator Dashboard — /coordinator**
- Summary cards: Active Talent Pool Batches, Open Applications, Students Shortlisted (across all applications), Students Selected
- Recent activity feed: status updates received from recruiters
- Matching Job Requirements widget: top 5 new job postings matching coordinator's state and institution's qualification types
- Quick link: 'Browse New Job Requirements'

### **6.4.2 Institution Profile — /coordinator/institution**
- View and edit institution details: name, type, state, district, AICTE code, website, address
- Cannot change institution type or state after admin approval without re-triggering admin review

### **6.4.3 Talent Pool Batch Management — /coordinator/batches**
- List of all batches with status badges: Draft | Active | Archived
- Create New Batch button → /coordinator/batches/new
- Batch creation form:
  - Batch Name (e.g. 'Electrical ITI Passout 2024')
  - Qualification (dropdown: ITI | Diploma | B.Tech | M.Tech | etc.)
  - Branch / Trade / Specialisation (text)
  - Passing Year (number — current or upcoming year)
  - Save as Draft → then Add Students
- Add Students to Batch:
  - Bulk Upload via CSV template (downloadable template provided) — parses and creates student records
  - OR Manual Add Student form (one at a time)
  - Resume upload per student: PDF only, max 5MB per file, stored in cloud object storage (Cloudinary or AWS S3 — use environment variable to configure)
  - Student table: sortable by name, CGPA, branch; inline edit enabled
  - Delete student from batch (with confirmation) — only if batch not yet applied to any job
  - Activate batch button: sets status to active — batch now eligible for job applications

### **6.4.4 Browse Job Requirements — /coordinator/jobs**
- Grid of open job requirement cards visible to this coordinator (filtered by: their state OR pan-India postings)
- Filter panel: Qualification Type, Sector, State, Salary Range, Posted Date
- Search by: job title, company name
- Each card: Company name, Job title, Slots summary, Location, Deadline, 'Already Applied' badge if applicable
- Click card: Job Requirement Detail page

### **6.4.5 Job Requirement Detail — /coordinator/jobs/[jobId]**
- Full job description rendered (markdown)
- Qualification slots table: Qualification | Branch | Seats Required
- Company info: name, sector, location
- 'Apply with Talent Pool' button — opens application modal
- Application Modal:
  - Dropdown: Select Talent Pool Batch (shows only Active batches; filtered to matching qualification if possible)
  - Shows: batch student count, qualification, batch name
  - Cover Note text area (optional message to recruiter)
  - Student count confirmation: 'You are submitting X students for this requirement'
  - Confirm & Submit button: creates Application record, sets status: submitted
- One batch can apply to multiple jobs. One job can receive applications from multiple coordinators
- A coordinator cannot submit the same batch to the same job twice (duplicate check)

### **6.4.6 My Applications — /coordinator/applications**
- List of all applications submitted by this coordinator
- Filterable by: Job status, Application status, Company, Date range
- Each application row: Company, Job Title, Batch Name, Students Submitted, Application Status, Last Update
- Expand to see per-student status (read-only view of what recruiter has set)
- 'Withdraw Application' button — allowed only if application status is 'submitted' and job is still open


# **7. API Route Specifications (Next.js App Router)**
All API routes are under /api. All protected routes verify the NextAuth session and role via a middleware wrapper. API responses follow the structure: { success: boolean, data?: any, error?: string, pagination?: {...} }.

## **7.1 Auth Routes**

|**Method**|**Route**|**Description**|**Auth**|
| :- | :- | :- | :- |
|GET/POST|/api/auth/[...nextauth]|NextAuth Google OAuth handler|Public|
|POST|/api/auth/register|Complete registration after OAuth (saves role, institution/company data)|Authenticated (no role yet)|
|GET|/api/auth/me|Returns current user session with role, institutionId/companyId, approvalStatus|Authenticated|

## **7.2 Admin Routes**

|**Method**|**Route**|**Description**|
| :- | :- | :- |
|GET|/api/admin/approvals|List all pending/approved/rejected users with pagination|
|PATCH|/api/admin/approvals/[userId]|Approve or reject a user registration { action: 'approve'|'reject', rejectionReason?: string }|
|GET|/api/admin/users|Full user list with filters|
|PATCH|/api/admin/users/[userId]/suspend|Suspend or reinstate a user|
|GET|/api/admin/analytics|Aggregated platform statistics for dashboard|
|GET|/api/admin/analytics/export|CSV export of analytics data|

## **7.3 Job Requirements Routes**

|**Method**|**Route**|**Description**|**Role**|
| :- | :- | :- | :- |
|GET|/api/jobs|List open jobs (filtered by coordinator's state + pan-India, or recruiter's own)|Coord / Recruiter|
|POST|/api/jobs|Create a new job requirement|Recruiter|
|GET|/api/jobs/[jobId]|Get single job requirement detail|Coord / Recruiter|
|PATCH|/api/jobs/[jobId]|Update job requirement (title, desc, slots, deadline, status)|Recruiter (owner)|
|DELETE|/api/jobs/[jobId]|Soft-delete (set status: closed) — cannot hard delete|Recruiter (owner)|

## **7.4 Talent Pool Batch Routes**

|**Method**|**Route**|**Description**|
| :- | :- | :- |
|GET|/api/batches|List coordinator's batches|
|POST|/api/batches|Create new batch (name, qualification, branch, passingYear)|
|GET|/api/batches/[batchId]|Get batch detail with student list|
|PATCH|/api/batches/[batchId]|Update batch metadata or status|
|POST|/api/batches/[batchId]/students|Add a single student record|
|PATCH|/api/batches/[batchId]/students/[studentId]|Edit student record|
|DELETE|/api/batches/[batchId]/students/[studentId]|Remove student from batch|
|POST|/api/batches/[batchId]/students/bulk|Bulk upload via CSV parse (multipart/form-data)|
|POST|/api/batches/[batchId]/resume|Upload resume PDF for a student (multipart/form-data)|

## **7.5 Application Routes**

|**Method**|**Route**|**Description**|**Role**|
| :- | :- | :- | :- |
|GET|/api/applications|List applications: coordinator gets own; recruiter gets received by company|Both|
|POST|/api/applications|Submit a batch application to a job { jobRequirementId, talentPoolBatchId, coverNote }|Coordinator|
|GET|/api/applications/[appId]|Full application detail with student statuses|Both|
|PATCH|/api/applications/[appId]/students/[studentId]|Update individual student status { status, recruiterNote }|Recruiter|
|PATCH|/api/applications/[appId]/students/bulk|Bulk update student statuses [{ studentId, status }]|Recruiter|
|DELETE|/api/applications/[appId]|Withdraw application (coordinator only, if status: submitted)|Coordinator|
|GET|/api/applications/[appId]/download|Generate and return ZIP download URL for resumes|Recruiter|

## **7.6 Notification Routes**

|**Method**|**Route**|**Description**|
| :- | :- | :- |
|GET|/api/notifications|List user's notifications (paginated, newest first)|
|PATCH|/api/notifications/[notifId]/read|Mark a notification as read|
|PATCH|/api/notifications/read-all|Mark all notifications as read|


# **8. UI/UX Specifications**
## **8.1 Design System**
Use shadcn/ui as the component library, installed with the 'new-york' style variant. Tailwind CSS for all styling. Do not use any other CSS framework. The design language is clean, government-appropriate, and professional — not consumer-app playful.

|**Token**|**Value**|**Usage**|
| :- | :- | :- |
|Primary|#1E3A5F (navy)|Headers, primary buttons, nav|
|Accent|#2563EB (blue)|Links, active states, secondary actions|
|Success|#16A34A (green)|Approved, selected, active badges|
|Warning|#EA580C (orange)|Pending, deadline approaching|
|Danger|#DC2626 (red)|Rejected, closed, delete actions|
|Surface|#F8FAFC|Page background|
|Card|#FFFFFF|Card backgrounds|
|Border|#E2E8F0|Card borders, dividers|
|Text Primary|#1E293B|Body text|
|Text Muted|#64748B|Secondary labels, hints|

## **8.2 Layout Architecture**
- Root layout (layout.tsx): Provides NextAuth SessionProvider, Toaster (shadcn/ui toast), global nav
- Authenticated layout: Sidebar navigation (collapsible on mobile) + top header with user avatar, notification bell, logout
- Sidebar items differ per role: Admin sees Admin nav; Coordinator sees Coordinator nav; Recruiter sees Recruiter nav
- All authenticated pages server-rendered where possible (Next.js App Router RSC), client components only for interactive elements
- Mobile-first responsive design: sidebar collapses to hamburger on < 768px

## **8.3 Key Page Layouts**
### **Navigation — Coordinator Sidebar**
- Dashboard
- Browse Job Requirements
- My Applications
- Talent Pool Batches
- Institution Profile
- Notifications (with unread badge)
### **Navigation — Recruiter Sidebar**
- Dashboard
- Job Requirements → My Postings / Post New
- Applications Received
- Company Profile
- Notifications (with unread badge)
### **Navigation — Admin Sidebar**
- Dashboard
- Pending Approvals (with count badge)
- All Users
- All Job Requirements
- Platform Analytics

## **8.4 Component Specifications**

|**Component**|**Description**|
| :- | :- |
|<JobRequirementCard>|Shows title, company, slots summary, deadline, geography scope, Apply / View button. Used in browse grid.|
|<SlotBadge>|Pill badge: '100 ITI · 5 B.Tech · 4 M.Tech'. Color-coded by qualification.|
|<ApplicationStatusBadge>|Color-coded status pill: submitted (blue) | under\_review (yellow) | shortlisting (orange) | closed (gray).|
|<StudentStatusDropdown>|Inline dropdown for per-student status in recruiter view. Optimistic update with toast feedback.|
|<TalentBatchCard>|Shows batch name, qualification, branch, student count, status. Used in coordinator batch list.|
|<NotificationBell>|Icon with unread count badge. Dropdown showing last 5 notifications with mark-as-read.|
|<ApprovalCard>|Admin approval queue card: user info, declared role, institution/company details, Approve/Reject buttons.|
|<StatsCard>|Dashboard summary card with icon, number, label, optional trend indicator.|
|<CSVUploadZone>|Drag-and-drop zone for CSV bulk student upload. Shows parse preview before confirmation.|
|<ResumeUploadButton>|Per-student PDF upload button. Shows file name + size after upload. Validates file type and size client-side.|


# **9. Notification System**
Notifications are both in-app (stored in the notifications collection) and email (sent via Resend or Nodemailer with an SMTP provider — configured via environment variable). All email templates are HTML with inline styles.

|**Event**|**Recipient**|**In-App**|**Email**|
| :- | :- | :- | :- |
|New registration submitted|Super Admin|✅|✅|
|Registration approved|Coordinator / Recruiter|✅|✅|
|Registration rejected|Coordinator / Recruiter|✅|✅ (with reason)|
|New job requirement posted (state match)|All coordinators in matching state|✅|❌ (digest only)|
|New application received|Recruiter|✅|✅|
|Student status updated (shortlisted/rejected/selected)|Coordinator|✅|✅|
|Application withdrawn by coordinator|Recruiter|✅|✅|
|Job requirement deadline approaching (3 days)|Recruiter|✅|✅|
|Job requirement closed|All coordinators who applied|✅|✅|
|Account suspended|Affected user|✅|✅|

Email digest: Coordinators receive a weekly digest of new job postings matching their qualification profile. Digest is sent every Monday at 8AM IST via a scheduled job (use a simple cron endpoint called by Vercel Cron or similar).


# **10. File Handling**
## **10.1 Resume Upload**
- File type: PDF only
- Max size: 5MB per file
- Validation: client-side (file type + size) AND server-side
- Storage: Cloud object storage. Use Cloudinary (free tier) or AWS S3. Configure via STORAGE\_PROVIDER env var
- Naming convention: resumes/{institutionId}/{batchId}/{studentId}\_{timestamp}.pdf
- Access: Resume URLs are signed/private — accessed via a server-side proxy route /api/resumes/[studentId] that verifies the requesting user has rights to view this student's resume (must be coordinator of the institution or recruiter who received an application containing this student)
- Never expose direct cloud storage URLs in the frontend — always proxy through the API

## **10.2 CSV Bulk Upload**
- Downloadable CSV template from /api/batches/template.csv
- Template columns: Name, Roll Number, DOB (DD/MM/YYYY), Gender, CGPA, Skills (semicolon-separated), Phone, Email, Address, Languages Known (semicolon-separated), Certifications (semicolon-separated)
- Server-side parsing using papaparse or csv-parse
- Validation: required fields (Name, Roll Number, DOB, Gender), format checks (CGPA 0-10 or 0-100, phone format)
- On successful parse: show preview table with row count and validation errors highlighted
- User confirms → batch save. Rows with errors are skipped and listed in a summary
- Max 500 students per CSV upload. Larger batches should be split

## **10.3 Resume ZIP Download**
- Triggered by recruiter on /recruiter/jobs/[jobId]/applications/[appId]
- Server-side route: /api/applications/[appId]/download?filter=all|shortlisted
- Server fetches all relevant resume files from cloud storage, streams into a ZIP using archiver npm package
- ZIP filename: {CompanyName}\_{JobTitle}\_{BatchName}\_{timestamp}.zip
- ZIP is streamed directly as a response (Content-Disposition: attachment) — not stored persistently
- Rate limit: max 5 ZIP downloads per recruiter per hour to prevent abuse


# **11. Project Structure**
The project is a single Next.js 14 monorepo with App Router. Use TypeScript throughout.

|**Path**|**Description**|
| :- | :- |
|/app|Next.js App Router root|
|/app/(public)/page.tsx|Landing page|
|/app/(public)/register/page.tsx|Registration form (post-OAuth)|
|/app/(public)/pending/page.tsx|Registration pending confirmation page|
|/app/(auth)/admin/...|All admin panel pages|
|/app/(auth)/coordinator/...|All coordinator pages|
|/app/(auth)/recruiter/...|All recruiter pages|
|/app/api/...|All API route handlers|
|/components/ui/...|shadcn/ui components (auto-generated)|
|/components/shared/...|Shared app components (NotificationBell, StatsCard, etc.)|
|/components/admin/...|Admin-specific components|
|/components/coordinator/...|Coordinator-specific components|
|/components/recruiter/...|Recruiter-specific components|
|/lib/db.ts|MongoDB connection singleton using Mongoose|
|/lib/auth.ts|NextAuth config with Google provider and callbacks|
|/lib/storage.ts|Cloud storage abstraction (upload, getSignedUrl, delete)|
|/lib/email.ts|Email sending abstraction (send, templates)|
|/lib/middleware/auth.ts|Route protection helpers: withRole(role)(handler)|
|/models/...|Mongoose models (User, Institution, Company, JobRequirement, TalentPoolBatch, Application, Notification)|
|/hooks/...|React custom hooks (useNotifications, useAuth, etc.)|
|/types/index.ts|Shared TypeScript type definitions|
|/.env.local|Environment variables (never committed)|


# **12. Environment Variables**

|**Variable**|**Description**|**Example**|
| :- | :- | :- |
|MONGODB\_URI|MongoDB Atlas connection string|mongodb+srv://...|
|NEXTAUTH\_URL|App base URL|http://localhost:3000|
|NEXTAUTH\_SECRET|Random secret for JWT signing|openssl rand -base64 32|
|GOOGLE\_CLIENT\_ID|Google OAuth App client ID|From Google Cloud Console|
|GOOGLE\_CLIENT\_SECRET|Google OAuth App client secret|From Google Cloud Console|
|STORAGE\_PROVIDER|cloudinary or s3|cloudinary|
|CLOUDINARY\_CLOUD\_NAME|Cloudinary cloud name|your-cloud-name|
|CLOUDINARY\_API\_KEY|Cloudinary API key||
|CLOUDINARY\_API\_SECRET|Cloudinary API secret||
|AWS\_REGION|AWS region (if using S3)|ap-south-1|
|AWS\_ACCESS\_KEY\_ID|AWS access key (if using S3)||
|AWS\_SECRET\_ACCESS\_KEY|AWS secret key (if using S3)||
|S3\_BUCKET\_NAME|S3 bucket (if using S3)|skillbridge-resumes|
|EMAIL\_PROVIDER|resend or smtp|resend|
|RESEND\_API\_KEY|Resend API key (if using Resend)||
|SMTP\_HOST|SMTP host (if using SMTP)||
|SMTP\_PORT|SMTP port|587|
|SMTP\_USER|SMTP username||
|SMTP\_PASS|SMTP password||
|EMAIL\_FROM|Sender email address|noreply@skillbridge.gov.in|
|ADMIN\_EMAIL|Super admin email (seeded at init)|admin@skillbridge.gov.in|
|NEXT\_PUBLIC\_APP\_URL|Public app URL (for email links)|https://skillbridge.gov.in|


# **13. Database Seeding**
A seed script at /scripts/seed.ts should be runnable via: npx ts-node scripts/seed.ts

- Creates the Super Admin user record using ADMIN\_EMAIL from environment variable
- Super Admin user: { email: process.env.ADMIN\_EMAIL, role: super\_admin, approvalStatus: approved, name: 'Platform Administrator' }
- Seeds master list of Indian states (28 states + 8 UTs) into a static config file at /lib/constants/states.ts — no DB collection needed
- Seeds qualification types into /lib/constants/qualifications.ts
- Seeds industry sectors list into /lib/constants/sectors.ts
- Optionally seeds 2 demo institutions, 2 demo companies, 1 demo job requirement, and 1 demo talent batch (controlled by SEED\_DEMO\_DATA=true env flag)


# **14. Error Handling & Validation**
## **14.1 API Error Responses**

|**Scenario**|**HTTP Code**|**Error Message**|
| :- | :- | :- |
|Unauthenticated request to protected route|401|Authentication required|
|Authenticated but wrong role|403|Insufficient permissions|
|Resource not found|404|Resource not found|
|Duplicate application (same batch + job)|409|Application already submitted for this job|
|File too large|413|File exceeds 5MB limit|
|Invalid file type|415|Only PDF files are accepted|
|Validation error (missing/invalid fields)|422|{ errors: [{ field, message }] }|
|Rate limit exceeded|429|Too many requests — try again later|
|Server error|500|Internal server error — contact support|

## **14.2 Form Validation**
- Client-side: use react-hook-form with zod schemas for all forms
- Server-side: independently validate all inputs using the same zod schemas (never trust client)
- Zod schemas defined in /lib/validators/ — shared between client and server
- Error messages shown inline below each form field using shadcn FormMessage component


# **15. Security Requirements**
- All API routes protected by NextAuth session check as first middleware layer
- Role-based access enforced server-side on every API call — never trust client-side role claims
- Resume files are never publicly accessible — all access proxied through authenticated API
- MongoDB queries always scoped by authenticated user's institutionId/companyId — never return cross-tenant data
- Input sanitization: sanitize all rich text fields (job description) using DOMPurify on server before storage
- Rate limiting: use upstash/ratelimit or simple in-memory rate limiter for: registration (5/IP/hour), login (10/IP/15min), ZIP download (5/user/hour), CSV upload (10/user/hour)
- CSRF: handled by NextAuth automatically for auth routes; API routes use session token validation
- File upload: validate MIME type server-side (not just extension), scan for PDF structure validity
- No sensitive data in URL params: resume access always via server-side proxy, never direct S3/Cloudinary URL in client
- Mongoose strict mode: true on all schemas to reject unknown fields
- Logging: log all admin actions (approvals, suspensions) to a separate adminAuditLog collection with timestamp, adminId, action, targetUserId


# **16. Build, Testing & Deployment**
## **16.1 Dependencies (package.json — key packages)**

|**Package**|**Version**|**Purpose**|
| :- | :- | :- |
|next|14\.x|Framework|
|react|18\.x|UI runtime|
|typescript|5\.x|Type safety|
|mongoose|8\.x|MongoDB ODM|
|next-auth|4\.x|Google OAuth + session|
|tailwindcss|3\.x|Styling|
|@shadcn/ui|latest|UI component library|
|react-hook-form|7\.x|Form state management|
|zod|3\.x|Schema validation|
|papaparse|5\.x|CSV parsing|
|archiver|6\.x|ZIP file generation|
|cloudinary|2\.x|File storage (if Cloudinary)|
|@aws-sdk/client-s3|3\.x|File storage (if S3)|
|resend|3\.x|Email sending (if Resend)|
|nodemailer|6\.x|Email sending (if SMTP)|
|react-md-editor|3\.x|Rich text editor for job descriptions|
|date-fns|3\.x|Date formatting and calculations|
|lucide-react|latest|Icon library|
|sonner|latest|Toast notifications|

## **16.2 Development Commands**

|**Command**|**Action**|
| :- | :- |
|npm run dev|Start development server on port 3000|
|npm run build|Production build|
|npm run start|Start production server|
|npm run lint|ESLint check|
|npx ts-node scripts/seed.ts|Run database seed script|
|npx shadcn@latest add [component]|Add new shadcn/ui component|

## **16.3 Deployment Target**
- Primary: Vercel (recommended for Next.js) — connect GitHub repo, configure environment variables
- Database: MongoDB Atlas (M0 free tier sufficient for MVP)
- File storage: Cloudinary free tier (25GB storage, 25GB bandwidth/month — sufficient for MVP)
- Email: Resend free tier (3,000 emails/month — sufficient for MVP)
- All environment variables configured via Vercel project settings — never in code


# **17. V1 MVP Scope — Explicit Inclusions & Exclusions**
## **17.1 In Scope for V1**

|<p>**V1 Deliverables**</p><p>- Full Google SSO authentication with role-based registration and Super Admin approval workflow</p><p>- Super Admin panel: approvals, user management, platform analytics dashboard</p><p>- Industry Recruiter: post/manage job requirements with qualification slots, geography scoping, manage applications, per-student status updates, resume ZIP download</p><p>- Faculty Coordinator: institution profile, create/manage talent pool batches with bulk CSV upload, individual resume uploads, browse job requirements, submit applications, view application status updates</p><p>- In-app notification system with unread badge</p><p>- Email notifications for all key events</p><p>- State-level geography scoping with pan-India option</p><p>- Mobile-responsive UI using Tailwind + shadcn/ui</p><p>- Secure file storage and access proxy for resumes</p><p>- Database seed script with Super Admin creation</p>|
| :- |

## **17.2 Explicitly Out of Scope for V1**

|<p>**V2+ Features**</p><p>- Student self-registration or direct student portal access</p><p>- In-platform messaging / chat between coordinator and recruiter</p><p>- Interview scheduling integration (Google Calendar, etc.)</p><p>- Offer letter generation or management</p><p>- Multi-coordinator support per institution</p><p>- Public API for third-party integrations</p><p>- Multi-language (Hindi etc.) UI support</p><p>- Mobile app (iOS/Android) — web only for V1</p><p>- Payment gateway or premium plans</p><p>- ML-based job-to-batch matching recommendations</p><p>- District-level geography scoping (state-level only for V1)</p><p>- SSO for coordinators using institutional email (LDAP/Shibboleth)</p>|
| :- |


# **18. Recommended Implementation Order**
Follow this order to maintain a working application at each step. Do not skip ahead.

1. Project scaffolding: next create-app with TypeScript, install Tailwind, shadcn/ui (new-york style), configure ESLint
1. MongoDB connection: /lib/db.ts singleton, all Mongoose models
1. NextAuth setup: Google provider, session callbacks to attach userId/role/approvalStatus, middleware to protect routes
1. Registration flow: landing page → Google OAuth → role selection form → pending page → API routes
1. Super Admin panel: seed script → admin dashboard → approvals queue → approve/reject flow with email
1. Institution and Company profile creation (auto-created on admin approval)
1. Job Requirements CRUD: recruiter post/edit/close, coordinator browse with geography filter
1. Talent Pool Batch CRUD: create batch, manual student add, CSV bulk upload, student list with edit/delete
1. Resume upload per student: Cloudinary/S3 integration, server-side proxy route
1. Application flow: coordinator applies batch to job → application record created → recruiter receives notification
1. Application management: recruiter views applications, updates student statuses, coordinator sees status updates
1. ZIP download: archiver integration, authenticated download route
1. Notification system: in-app notifications, email notifications for all events
1. Admin analytics: aggregation queries, dashboard charts
1. Polish: mobile responsiveness, loading states, error boundaries, toast notifications, form validation

***End of Document — SkillBridge PRD v1.0***

*This document is intended for direct ingestion by an AI coding agent or engineering team. All decisions are final for V1 scope.*
SkillBridge Portal — Product Requirements Document   |   Confidential   |   Page  of 
