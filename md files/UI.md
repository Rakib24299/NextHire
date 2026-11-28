# UI/UX Specifications & Page Architecture

## 1. Design System & Theme Foundations

### 1.1 Color Palette (Tailwind CSS Tokens)
* **Primary (Brand):** Indigo
  * Default: `bg-indigo-600` (`#4F46E5`), Hover: `hover:bg-indigo-700`
  * Light Background: `bg-indigo-50` (`#EEF2FF`)
* **Secondary / Neutral:** Slate
  * Dark text: `text-slate-900` (`#0F172A`)
  * Body text: `text-slate-600` (`#475569`)
  * Borders: `border-slate-200` (`#E2E8F0`)
  * App Background: `bg-slate-50` (`#F8FAFC`)
* **Status Colors:**
  * **Pending:** `bg-amber-100 text-amber-800 border-amber-300` (Yellow/Amber)
  * **Under Review:** `bg-blue-100 text-blue-800 border-blue-300` (Blue)
  * **Shortlisted:** `bg-emerald-100 text-emerald-800 border-emerald-300` (Green)
  * **Rejected:** `bg-rose-100 text-rose-800 border-rose-300` (Red)

### 1.2 Typography
* **Font Family:** `Inter`, system-ui, -apple-system, sans-serif
* **Headings:**
  * H1: `text-4xl md:text-5xl font-extrabold tracking-tight`
  * H2: `text-2xl md:text-3xl font-bold`
  * H3: `text-lg font-semibold`
* **Body:** `text-sm md:text-base leading-relaxed`

---

## 2. Global Components

### 2.1 Navigation Bar (`Navbar.jsx`)
* **Left:** NextHire Logo + Brand Name with dynamic glowing dot.
* **Center (Desktop):** Links $\rightarrow$ "Browse Jobs", "Internships", "Companies".
* **Right (Dynamic by Auth State):**
  * *Guest:* "Login" (outline button) + "Register" (solid primary button)
  * *Seeker:* "Saved Jobs", "My Applications", Profile Avatar dropdown with "Logout"
  * *Employer:* "Post a Job" (+ Icon CTA button), "Employer Dashboard", Avatar with "Logout"
* **Mobile:** Responsive hamburger menu opening a slide-in sheet.

### 2.2 Reusable Job Card (`JobCard.jsx`)
* **Header:** Company Logo (or stylized initials fallback), Company Name, Location & Workplace badge (Remote/On-site).
* **Body:** Job Title (`font-bold hover:text-indigo-600`), 2-line truncated description snippet.
* **Tags:** Badges for Job Type (`Internship` or `Full-time`), Experience Level (`Fresher`), and Salary (`$500 - $800/mo` or `Negotiable`).
* **Footer:** Posted time (e.g. "2 days ago") + "View Details" button.

### 2.3 Status Badge (`StatusBadge.jsx`)
* Accepts `status` prop (`pending`, `reviewing`, `shortlisted`, `rejected`) and renders rounded pill badge with corresponding colors and dot indicator.

---

## 3. Page Layouts & Wireframes

### 3.1 Landing / Home Page (`/`)
* **Hero Section:**
  * Punchy Headline: *"Launch Your Tech Career — Find Top Freshers & Internship Roles"*.
  * Subtitle: *"Connect with leading startups and enterprises actively hiring emerging talent."*
  * Quick Search Bar: Inputs for `Job Title / Skill` + `Location` + `Search Jobs` button.
* **Category Pill Grid:** Quick filter badges (Frontend, Backend, MERN Stack, UI/UX, QA, Internship).
* **Featured Jobs Grid:** 6 latest high-priority job postings.
* **Why NextHire Section:** 3 feature cards (Real-time tracking, Verified companies, One-click apply).
* **Call to Action (CTA) Banner:** "Are you hiring? Post your opening in 2 minutes."

### 3.2 Job Explorer Page (`/jobs`)
* **Layout:** Two-column desktop layout (`grid grid-cols-1 lg:grid-cols-4 gap-6`).
* **Sidebar Filter Panel (Left 1 Col):**
  * Search keyword input.
  * Checkbox group: **Job Type** (Full-time, Part-time, Internship, Contract).
  * Checkbox group: **Workplace** (Remote, On-site, Hybrid).
  * Radio group: **Experience** (All, Fresher/Entry-level, Junior 1-2 yrs).
  * Salary Range slider.
  * "Clear All Filters" button.
* **Results Panel (Right 3 Cols):**
  * Result count header: *"Showing 24 open opportunities"*.
  * Sorting dropdown: "Newest first", "Salary: High to Low".
  * Job Card Grid/List.
  * Clean Pagination controls (`Previous`, `Page 1, 2, 3`, `Next`).

### 3.3 Job Details Page (`/jobs/:id`)
* **Header Card:**
  * Large Company Logo, Job Title, Company Name, Location, Post date, and Deadline.
  * Action Buttons: "Apply Now" (Primary) and "Bookmark" (Heart icon).
* **Content Body:**
  * Two-column split:
    * Left column (70%): Detailed Job Description, Responsibilities, Qualifications, Technical Skills needed.
    * Right column (30%): Job Overview summary card (Salary, Job Type, Experience, Workplace type, Total Applicants counter).
* **Apply Modal:**
  * Triggered by "Apply Now".
  * Candidate pre-filled details (Name, Email).
  * Drag-and-drop / File picker for **Resume (PDF only, max 5MB)**.
  * Textarea for optional Cover Note / Message to Recruiter.
  * "Submit Application" button with loading spinner state.

### 3.4 Authentication Pages (`/login` & `/register`)
* Centered card design with clean shadow (`max-w-md mx-auto my-12`).
* Tab Switcher on Register: **"I am looking for a job"** vs **"I am hiring"**.
* Form fields with real-time validation and error hints.
* Demo Credentials Box: "Test as Seeker" and "Test as Employer" one-click autofill buttons (crucial for portfolio reviewers).

### 3.5 Candidate Dashboard (`/seeker/dashboard`)
* **Metric Cards Grid:**
  * Total Applications Submitted
  * Applications Under Review
  * Shortlisted / Interview Offers
* **Applications Table:**
  * Columns: `Company`, `Job Title`, `Applied Date`, `Resume Link`, `Current Status`, `Action` (View Job).
* **Saved Jobs Tab:** Bookmarked jobs saved for later.

### 3.6 Employer Dashboard (`/employer/dashboard`)
* **Overview Stats:** Total Jobs Posted, Total Applications Received, Active Openings.
* **Primary Action:** "+ Post New Job" button.
* **Manage Jobs Table:**
  * Columns: `Job Title`, `Job Type`, `Date Posted`, `Applicants Count`, `Status` (Active/Closed), `Actions` (Edit, View Applicants, Delete).
* **Applicant Review View (`/employer/jobs/:jobId/applicants`):**
  * Header with Job Title & total candidate count.
  * Candidates List / Table:
    * Candidate Name & Email.
    * Applied Date.
    * Resume PDF Link (Opens in new tab or integrated preview modal).
    * Status Dropdown: Quickly switch between `Pending`, `Under Review`, `Shortlisted`, `Rejected`.

---

## 4. Responsive Breakpoints
* **Mobile (`< 640px`):** Stacked single-column layouts, filter drawer sheet, card-based tables.
* **Tablet (`640px - 1024px`):** Two-column card grids, condensed tables with horizontal scroll.
* **Desktop (`> 1024px`):** Sidebar filter layout, rich full-width data tables, interactive popovers.
