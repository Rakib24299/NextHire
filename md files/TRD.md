# Technical Requirements Document (TRD)

## 1. System Architecture Overview

CareerPulse is built as a decoupled Client-Server architecture utilizing RESTful APIs over HTTPS with secure token-based authentication.

```
┌────────────────────────────────────────────────────────┐
│                   Frontend Client                      │
│       React.js / Vite + Tailwind CSS + Lucide Icons     │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS (REST API / JSON)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Backend Server                       │
│             Node.js + Express.js Framework             │
│  ├── Middlewares (Auth, RBAC, RateLimit, CORS, Multer) │
│  ├── Controllers (Auth, Jobs, Applications, Users)     │
│  └── Validation Layer (Zod / Joi)                      │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
              ▼                           ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│     MongoDB Database      │ │ Cloudinary / File Storage│
│  Mongoose ODM + Indexes   │ │ (PDF Resumes & Avatars)  │
└───────────────────────────┘ └──────────────────────────┘
```

---

## 2. Technology Stack & Decision Matrix

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | React.js (Vite) | Lightning-fast development builds, component-driven, standard across tech job requirements. |
| **Styling & Icons** | Tailwind CSS + Lucide React | Utility-first CSS for rapid, modern UI without CSS bloat; crisp, accessible icon set. |
| **State & API Handling** | Axios + TanStack Query (React Query) | Server-state caching, automatic refetching, pagination management, and request deduping. |
| **Backend Runtime** | Node.js + Express.js | Industry standard for JavaScript full-stack developers, robust ecosystem, asynchronous I/O. |
| **Database** | MongoDB + Mongoose | Schema-flexibility with Mongoose schema validation, rapid iteration, native JSON support. |
| **File Storage** | Cloudinary / Supabase Storage | Offloads file storage from server, secure CDN delivery for PDF resumes and logos. |
| **Authentication** | JWT (JSON Web Tokens) + bcryptjs | Stateless authentication, encrypted password hashing, RBAC claims stored in payload. |

---

## 3. REST API Specifications

### 3.1 Authentication Endpoints (`/api/v1/auth`)

#### `POST /api/v1/auth/register`
* **Access:** Public
* **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123!",
    "role": "seeker" // or "employer"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "6740a1b2...",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "seeker"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

#### `POST /api/v1/auth/login`
* **Access:** Public
* **Request Body:** `{ "email": "...", "password": "..." }`
* **Response (200 OK):** User object and JWT token.

#### `GET /api/v1/auth/me`
* **Access:** Protected (Seeker & Employer)
* **Response (200 OK):** Current authenticated user's profile and role.

---

### 3.2 Job Management Endpoints (`/api/v1/jobs`)

#### `GET /api/v1/jobs`
* **Access:** Public
* **Query Parameters:**
  * `search` (string) - Matches title, company, skills
  * `jobType` (string) - `full-time`, `internship`, `part-time`
  * `workplaceType` (string) - `remote`, `onsite`, `hybrid`
  * `experienceLevel` (string) - `fresher`, `junior`, `mid`
  * `page` (number, default: 1)
  * `limit` (number, default: 10)
  * `sort` (string) - `newest`, `salary_desc`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "totalJobs": 45,
    "currentPage": 1,
    "totalPages": 5,
    "data": [
      {
        "_id": "6740b3c4...",
        "title": "Junior Full Stack Developer",
        "companyName": "TechCorp Solutions",
        "location": "Dhaka, Bangladesh",
        "workplaceType": "hybrid",
        "jobType": "full-time",
        "salary": { "min": 35000, "max": 50000, "currency": "BDT" },
        "skillsRequired": ["React", "Node.js", "MongoDB"],
        "createdAt": "2026-11-20T10:00:00.000Z"
      }
    ]
  }
  ```

#### `GET /api/v1/jobs/:id`
* **Access:** Public
* **Response (200 OK):** Complete job object including description, requirements, company info.

#### `POST /api/v1/jobs`
* **Access:** Protected (Employer Only)
* **Request Body:** `{ title, description, companyName, location, workplaceType, jobType, salary, skillsRequired, deadline }`
* **Response (201 Created):** Created job object.

#### `PUT /api/v1/jobs/:id`
* **Access:** Protected (Employer Owner Only)
* **Response (200 OK):** Updated job details.

#### `DELETE /api/v1/jobs/:id`
* **Access:** Protected (Employer Owner Only)
* **Response (200 OK):** `{ "success": true, "message": "Job deleted successfully" }`

---

### 3.3 Application Endpoints (`/api/v1/applications`)

#### `POST /api/v1/applications/apply/:jobId`
* **Access:** Protected (Seeker Only)
* **Form-Data Request:**
  * `resume` (File, PDF only, max 5MB)
  * `coverNote` (string, optional)
* **Response (201 Created):** Application object with initial status `pending`.

#### `GET /api/v1/applications/my-applications`
* **Access:** Protected (Seeker Only)
* **Response (200 OK):** Array of jobs the current user has applied to, populated with job title, company name, applied date, and application status.

#### `GET /api/v1/applications/job/:jobId`
* **Access:** Protected (Employer Owner of this Job)
* **Response (200 OK):** List of all candidates who applied, including candidate name, email, resume URL, applied date, and status.

#### `PATCH /api/v1/applications/:applicationId/status`
* **Access:** Protected (Employer Owner)
* **Request Body:** `{ "status": "shortlisted" }` // `pending` | `reviewing` | `shortlisted` | `rejected`
* **Response (200 OK):** Updated application object.

---

## 4. Middleware & Security Implementation

### 4.1 Authentication & RBAC Guard
* `verifyToken`: Extracts Bearer token from headers/cookies, decodes via `jwt.verify(token, process.env.JWT_SECRET)`.
* `authorizeRoles(...roles)`: Verifies if `req.user.role` matches permitted roles:
  ```javascript
  const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied: Role '${req.user.role}' is not authorized to access this resource`
        });
      }
      next();
    };
  };
  ```

### 4.2 File Upload Middleware
* `multer` memory storage with strict file filter:
  ```javascript
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF resume files are permitted!'), false);
    }
  };
  ```

### 4.3 Standard Error Response Format
All errors return a uniform structure:
```json
{
  "success": false,
  "message": "Human readable error description",
  "errors": [] // Optional validation details
}
```
