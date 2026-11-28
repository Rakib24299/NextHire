# User & System Flow Architecture

This document maps out the operational workflows, user interactions, and state transitions across the **NextHire** portal.

---

## 1. Authentication & Role Selection Flow

```mermaid
flowchart TD
    Start([User visits Portal]) --> Choice{Has Account?}
    Choice -- No --> RegisterPage[Navigate to Signup]
    Choice -- Yes --> LoginPage[Navigate to Login]

    RegisterPage --> InputReg[Enter Name, Email, Password & Select Role: Seeker / Employer]
    InputReg --> SubmitReg[Submit Form]
    SubmitReg --> CheckReg{Validation & Unique Email?}
    CheckReg -- Failed --> ShowRegError[Show Error Message]
    ShowRegError --> RegisterPage
    CheckReg -- Passed --> HashPass[Hash Password with bcrypt]
    HashPass --> CreateUser[Save User to Database]
    CreateUser --> IssueJWT[Generate JWT Cookie/Token]
    IssueJWT --> RedirectByRole

    LoginPage --> InputLogin[Enter Email & Password]
    InputLogin --> VerifyUser{Valid Credentials?}
    VerifyUser -- No --> ShowLoginError[Display Invalid Credentials Toast]
    ShowLoginError --> LoginPage
    VerifyUser -- Yes --> IssueJWT

    RedirectByRole{User Role?}
    RedirectByRole -- Seeker --> HomeSeeker[Redirect to Job Browse / Seeker Dashboard]
    RedirectByRole -- Employer --> DashEmployer[Redirect to Employer Management Dashboard]
```

---

## 2. Job Seeker Journey: Discovery to Application

```mermaid
flowchart TD
    SeekerStart([Candidate Lands on Job Explorer]) --> SearchQuery[Input Keywords / Select Filters: Type, Salary, Remote]
    SearchQuery --> FetchJobs[Backend Queries Jobs DB with Pagination]
    FetchJobs --> RenderCards[Render Job Cards List]

    RenderCards --> ClickJob[Click 'View Details' on a Job]
    ClickJob --> JobDetails[Render Job Details & Requirements Page]
    
    JobDetails --> CheckAuth{Is Logged In as Seeker?}
    CheckAuth -- No --> RedirectLogin[Redirect to Login with returnUrl]
    CheckAuth -- Yes --> CheckApplied{Already Applied to this Job?}
    
    CheckApplied -- Yes --> DisableButton[Show 'Already Applied' Badge & Current Status]
    CheckApplied -- No --> OpenModal[Click 'Apply Now' Modal]
    
    OpenModal --> UploadResume[Attach PDF Resume & optional Cover Note]
    UploadResume --> ValidateFile{PDF < 5MB?}
    ValidateFile -- No --> ErrorToast[Show File Size/Format Error]
    ErrorToast --> OpenModal
    
    ValidateFile -- Yes --> CloudUpload[Upload Resume to Cloudinary / Storage]
    CloudUpload --> CreateAppRecord[Create Application Document in DB with status: 'Pending']
    CreateAppRecord --> IncCounter[Increment Job Application Counter]
    IncCounter --> SuccessToast[Show Application Submitted Success Alert]
    SuccessToast --> SeekerDashboard[User tracks application in 'My Applications']
```

---

## 3. Employer Journey: Post Job & Candidate Review (ATS Flow)

```mermaid
flowchart TD
    EmpStart([Employer Logs In]) --> EmpDash[Employer Dashboard Overview]
    
    subgraph Job Posting Flow
        EmpDash --> ClickPost[Click 'Post a New Job']
        ClickPost --> FillJobForm[Fill Job Title, Skills, Description, Salary, Deadline]
        FillJobForm --> SubmitJob[Submit Job Listing]
        SubmitJob --> ValidateJob{Valid Inputs?}
        ValidateJob -- No --> ShowFormErr[Highlight Input Errors]
        ValidateJob -- Yes --> SaveJobDB[Save Job to DB with status: 'active']
        SaveJobDB --> RefreshList[Job visible on Public Board]
    end

    subgraph Applicant Management Flow
        EmpDash --> ViewListings[View List of My Posted Jobs]
        ViewListings --> ClickApplicants[Click 'View Applicants' for a Job]
        ClickApplicants --> FetchCandidates[Fetch all Applications for this Job ID]
        FetchCandidates --> RenderTable[Render Applicants Table: Name, Email, Resume, Status]
        
        RenderTable --> InspectCandidate[Click 'Preview Resume' PDF]
        InspectCandidate --> Decision{Recruiter Action}
        
        Decision -- Shortlist --> MarkShortlist[Set status: 'Shortlisted']
        Decision -- Reject --> MarkReject[Set status: 'Rejected']
        Decision -- Under Review --> MarkReview[Set status: 'Reviewing']
        
        MarkShortlist --> UpdateDB[Update Application Document in DB]
        MarkReject --> UpdateDB
        MarkReview --> UpdateDB
        UpdateDB --> NotifySeeker[Candidate sees updated badge in real time]
    end
```

---

## 4. Protected Route & Token Verification Flow

Every API call to sensitive resources passes through the RBAC Middleware:

```mermaid
flowchart LR
    IncomingReq[Incoming Request] --> CheckToken{Bearer / Cookie Token Exists?}
    CheckToken -- No --> Ret401[401 Unauthorized: Please Login]
    CheckToken -- Yes --> VerifyJWT{Verify Signature & Expiry}
    VerifyJWT -- Invalid/Expired --> Ret403[403 Forbidden: Invalid or Expired Token]
    VerifyJWT -- Valid --> AttachUser[Attach req.user = decodedPayload]
    
    AttachUser --> CheckRole{Role matches Route Permission?}
    CheckRole -- No (e.g., Seeker trying to POST /jobs) --> RetDenied[403 Forbidden: Access Denied for this Role]
    CheckRole -- Yes --> NextController[Forward to Next Controller]
```

---

## 5. Application Status State Machine

```
              ┌───────────────┐
              │    Pending    │ (Initial state on submit)
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ Under Review  │ (Recruiter opened resume)
              └───────┬───────┘
                      │
             ┌────────┴────────┐
             ▼                 ▼
     ┌───────────────┐ ┌───────────────┐
     │  Shortlisted  │ │   Rejected    │ (Final terminal states)
     └───────────────┘ └───────────────┘
```
