# Product Requirements Document (PRD)

## Project Title: NextHire — Full-Stack Job & Internship Portal

---

## 1. Executive Summary
**NextHire** is a modern, full-stack web platform designed to bridge the gap between emerging talent (students, fresh graduates, early-career professionals) and hiring organizations (startups, tech companies, agencies). 

The platform provides a streamlined, transparent, and user-friendly experience for job discovery, resume submissions, and candidate evaluation.

---

## 2. Target Audience & Personas

### 2.1 Job Seeker / Candidate (Focus: Freshers & Students)
* **Demographics:** University students, bootcamp graduates, self-taught developers, career switchers.
* **Pain Points:** 
  * Applying to hundreds of jobs without knowing application status.
  * Cluttered interfaces with irrelevant senior-level postings.
  * Difficulty finding genuine internship or entry-level opportunities.
* **Goals:**
  * Find verified internship and fresher opportunities quickly.
  * Filter jobs by tech stack, remote eligibility, and salary.
  * Track application status in real-time (Pending, Reviewing, Shortlisted, Rejected).

### 2.2 Employer / Recruiter
* **Demographics:** HR managers, startup founders, tech leads.
* **Pain Points:**
  * Inundated with unqualified applications and cluttered email inboxes.
  * Difficulty organizing candidate resumes and sharing candidate status with applicants.
* **Goals:**
  * Post job openings with structured requirements and salary bands.
  * Review applications, inspect PDF resumes with one click, and update hiring statuses.

### 2.3 Platform Admin
* **Goals:** Monitor platform activity, manage inappropriate job postings or spam accounts, and oversee system health.

---

## 3. Core Problem Statement
Traditional job boards are overly complex, non-transparent, and often hostile to entry-level talent. Freshers rarely receive status updates on their applications. NextHire solves this by offering a transparent applicant lifecycle, intuitive search/filtering, and role-based workspaces tailored for both candidates and recruiters.

---

## 4. Key Functional Requirements (Features & Scope)

### 4.1 Authentication & Authorization
* **Registration & Login:**
  * Secure email and password registration with encrypted credentials.
  * Role selection at signup: **Candidate (Seeker)** or **Employer**.
  * JWT (JSON Web Token) authentication stored in secure HTTP-only cookies.
* **Role-Based Access Control (RBAC):**
  * Protected routes ensuring Candidates cannot post jobs and Employers cannot apply to jobs.
  * Profile management (Avatar, contact details, bio, links).

### 4.2 Job Exploration & Search (Public & Candidate)
* **Search Engine:** Real-time text search querying job title, required skills, and company name.
* **Granular Filtering:**
  * **Job Type:** Full-time, Part-time, Internship, Contract.
  * **Workplace Type:** On-site, Remote, Hybrid.
  * **Experience Level:** Fresher (0-1 yrs), Junior (1-3 yrs), Mid-level (3+ yrs).
  * **Salary Range:** Min/Max slider or bracket filtering.
* **Sorting & Pagination:** Sort by newest, salary (high to low), and paginated responses (10/20 per page).

### 4.3 Job Management (Employer Workspace)
* **Create Job Post:**
  * Title, company name, location, job type, salary range.
  * Rich description with responsibilities and requirements.
  * Tags/skills required (e.g., React, Node.js, MongoDB).
  * Application deadline date.
* **Job Listing Lifecycle:**
  * Edit existing job details.
  * Close/Pause job listings (stops accepting new applicants).
  * Delete job listing (with cascade handling).

### 4.4 Application Pipeline & Tracking
* **Applying to a Job (Candidate):**
  * One-click apply using saved profile info or custom cover note.
  * PDF resume upload (validated file type and file size limit, max 5MB).
  * Prevent duplicate applications for the same job.
* **Candidate Dashboard:**
  * Summary metrics: Total Applied, In Review, Shortlisted, Rejected.
  * List of applications with live status badges.
* **Employer Candidate Review (Mini-ATS):**
  * View all applicants per posted job.
  * Quick resume preview / download link.
  * Status transition workflow: `Pending` $\rightarrow$ `Under Review` $\rightarrow$ `Shortlisted` / `Rejected`.
  * Optional recruiter feedback note.

---

## 5. Non-Functional Requirements

### 5.1 Performance & Scalability
* API response time under 250ms for search and listing queries.
* Database indexing on heavily queried fields (`title`, `skills`, `company`, `location`).
* Lazy loading images and cloud asset delivery (Cloudinary/CDN).

### 5.2 Security & Data Integrity
* Passwords hashed using `bcrypt` (salt rounds: 10+).
* Protected against common web vulnerabilities (XSS, CSRF, NoSQL injection, CORS whitelisting).
* Strict input validation on both client and server side (Zod or Joi).
* Secure file upload handling (MIME type verification, file size limits).

### 5.3 Usability & Design
* 100% mobile responsive (Fluid layout from 320px mobile screens to 4K displays).
* Accessible UI (contrast ratios, semantic HTML, screen reader tags).
* Instant feedback via interactive toasts/modals for all user actions.

---

## 6. Success Metrics & KPIs for Portfolio Evaluation
1. **Full User Journey Execution:** A recruiter can test the full flow without errors: Register as Employer $\rightarrow$ Post a Job $\rightarrow$ Switch to Seeker $\rightarrow$ Apply with Resume $\rightarrow$ Switch back to Employer $\rightarrow$ Change status to Shortlisted.
2. **Zero Breaking Errors:** Clean error handling with helpful UI alerts instead of crashed blank screens.
3. **Lighthouse Score:** 90+ on Performance, Accessibility, and Best Practices.
4. **Clean Code & Git History:** Descriptive semantic commits (`feat:`, `fix:`, `docs:`) and clear architecture.
