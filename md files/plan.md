# Step-by-Step Implementation Roadmap (plan.md)

## Project Title: NextHire — Full-Stack Job & Internship Portal

This plan outlines the exact execution sequence to build, test, and deploy the application from scratch to a production-ready portfolio project.

---

## Milestone 1: Project Scaffolding & Architecture
- [ ] Initialize Git repository with proper `.gitignore` (node_modules, .env).
- [ ] Set up monorepo or two-folder structure:
  ```
  Job Portal/
  ├── client/        # React + Vite + Tailwind CSS
  ├── server/        # Node.js + Express + Mongoose
  ├── PRD.md
  ├── Flow.md
  ├── UI.md
  ├── TRD.md
  ├── DB.md
  └── plan.md
  ```
- [ ] Create `server/.env.example` and `client/.env.example`.

---

## Milestone 2: Backend Core & Database Setup
- [ ] Initialize `server/package.json` and install core dependencies:
  * `express`, `mongoose`, `dotenv`, `cors`, `cookie-parser`, `helmet`, `morgan`.
- [ ] Configure MongoDB connection via Mongoose with reconnect handling.
- [ ] Build global error-handling middleware and 404 handler.
- [ ] Set up development server with `nodemon` or node watch mode.

---

## Milestone 3: Authentication & Role-Based Access Control (RBAC)
- [ ] Create `User` Mongoose schema in `server/models/User.js`.
- [ ] Implement password hashing using `bcryptjs` on user registration.
- [ ] Implement JWT generation utility (`jsonwebtoken`).
- [ ] Build auth routes & controllers:
  * `POST /api/v1/auth/register` (Validates input, assigns role: seeker/employer).
  * `POST /api/v1/auth/login` (Verifies credentials, issues JWT).
  * `GET /api/v1/auth/me` (Fetches authenticated user context).
  * `POST /api/v1/auth/logout` (Clears auth cookie).
- [ ] Create `verifyToken` and `authorizeRoles('seeker', 'employer', 'admin')` middlewares.

---

## Milestone 4: Job Management REST API
- [ ] Create `Job` Mongoose schema in `server/models/Job.js` with indexes.
- [ ] Build Job controllers and routes:
  * `GET /api/v1/jobs` with dynamic query filtering (search, jobType, location, salary range, pagination).
  * `GET /api/v1/jobs/:id` (Fetch single job details).
  * `POST /api/v1/jobs` (Protected: Employer only).
  * `PUT /api/v1/jobs/:id` (Protected: Employer owner only).
  * `DELETE /api/v1/jobs/:id` (Protected: Employer owner only).
- [ ] Test all endpoints via Postman, Thunder Client, or cURL.

---

## Milestone 5: File Upload & Application Pipeline API
- [ ] Set up `multer` storage for memory buffering.
- [ ] Integrate Cloudinary SDK (or local static uploads for offline dev) for PDF resumes.
- [ ] Create `Application` Mongoose schema with unique compound index `(jobId, seekerId)`.
- [ ] Build Application controllers:
  * `POST /api/v1/applications/apply/:jobId` (Uploads resume, validates PDF, creates application).
  * `GET /api/v1/applications/my-applications` (Seeker view: applied jobs & statuses).
  * `GET /api/v1/applications/job/:jobId` (Employer view: applicants for a specific job).
  * `PATCH /api/v1/applications/:applicationId/status` (Employer updates status: Shortlisted/Rejected).

---

## Milestone 6: Frontend Setup & Design System
- [ ] Initialize client using Vite: `npm create vite@latest client -- --template react`.
- [ ] Install dependencies: `tailwindcss`, `@tailwindcss/vite` (or postcss), `lucide-react`, `axios`, `react-router-dom`.
- [ ] Configure Tailwind CSS color palette (Indigo/Slate) and typography.
- [ ] Create reusable UI components:
  * `Navbar` (Responsive with auth state)
  * `Footer`
  * `Button`, `Input`, `Badge`, `Modal`
  * `JobCard` and `StatusBadge`

---

## Milestone 7: Public Job Discovery & Details UI
- [ ] Build **Home Page (`/`)**:
  * Hero banner with search bar.
  * Popular categories & featured jobs grid.
  * Call-to-action sections.
- [ ] Build **Job Explorer Page (`/jobs`)**:
  * Left sidebar filters (Job type, workplace type, experience, salary).
  * Search bar + sorting dropdown.
  * Paginated job list with active card preview.
- [ ] Build **Job Details Page (`/jobs/:id`)**:
  * Comprehensive job information, requirements, company overview.
  * "Apply Now" modal with resume file upload input and cover note.

---

## Milestone 8: Authentication UI & Protected Dashboards
- [ ] Build **Login & Register UI (`/login`, `/register`)**:
  * Tab switcher for Seeker vs Employer registration.
  * Quick Demo Logins ("Login as Demo Seeker", "Login as Demo Employer").
- [ ] Build **Candidate Dashboard (`/seeker/dashboard`)**:
  * Metrics: Total Applied, In Review, Shortlisted.
  * Applied Jobs table with live status badges.
- [ ] Build **Employer Dashboard (`/employer/dashboard`)**:
  * Metrics: Total Jobs, Total Applicants.
  * "Post a Job" form with validations.
  * Posted Jobs management table.
  * Candidate Review ATS modal (Inspect candidate info, preview PDF resume, change status).

---

## Milestone 9: Testing, Optimization & Deployment
- [ ] Perform end-to-end user testing (Seeker apply $\rightarrow$ Employer review).
- [ ] Verify error states (file upload size limit, duplicate applications, unauthorized access).
- [ ] Deploy Backend to **Render / Railway**.
- [ ] Deploy Frontend to **Vercel / Netlify**.
- [ ] Configure environment variables in production and test live API communication.

---

## Milestone 10: Portfolio Polish & Documentation
- [ ] Create a compelling `README.md` at project root with:
  * Project overview & live link.
  * Screenshots / GIFs of core features.
  * Tech stack badges.
  * Architecture diagram.
  * Step-by-step local setup guide.
  * Demo credentials for instant recruiter access.
