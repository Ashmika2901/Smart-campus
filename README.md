# Smart Campus Complaint Management System Using AI

A centralized, full-stack **MERN (MongoDB, Express.js, React.js, Node.js + Vite)** web application designed to replace unstructured WhatsApp messages and verbal requests with an automated, AI-triaged campus facility resolution management system.

---

## 1. DEFINE — Problem Statement & Purpose

### The Problem
Traditional college campus complaint handling relies on informal WhatsApp messages, emails, and verbal communication. This leads to:
- Complaints regarding classroom projectors, Wi-Fi connectivity, drinking water, lab equipment, washrooms, and hostel maintenance being forgotten or delayed.
- Zero accountability or visibility into ticket progress.
- Administrators lacking a centralized overview of pending vs. resolved repairs across departments.

### The Solution
The **Smart Campus Complaint Management System Using AI** provides:
- **Centralized Digital Submission:** Fast student intake with validation across 8 college departments and 7 facility categories.
- **Automated AI Triage & Prioritization:** Zero-cost deterministic Natural Language Processing (NLP) heuristics engine that analyzes complaint descriptions, predicts optimal categories, flags critical hazards (sparks, floods, short circuits), calculates an Urgency Score (1–100%), and assigns an SLA turnaround ETA (4h, 12h, 24h, 48h).
- **Unique Complaint Tracking ID:** Automatic sequential ID generation (e.g., `CMP-2026-1001`) with copy-to-clipboard functionality.
- **Transparent Progress Tracking:** 3-stage visual milestone stepper: `Pending` → `In Progress` → `Resolved`.
- **Dynamic Administrative Console:** Real-time summary statistics cards (Total, Pending, In Progress, Resolved), multi-attribute filtering (Category, Status, Department, Search Query), one-click status transitions, and technician remarks logging.
- **Dual-Mode Persistence Architecture:** Seamless integration with MongoDB & Mongoose (`mongodb://localhost:27017/smart_campus_cm`), backed by browser `localStorage` synchronization for zero-downtime offline continuity.

---

## 2. DESCRIBE — Application Features & Architecture

```
                    ┌────────────────────────────────────────┐
                    │  Smart Campus Web App (React + Vite)   │
                    └───────────────────┬────────────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
       ┌──────────────────┐                          ┌──────────────────┐
       │  Student Portal  │                          │ Admin Dashboard  │
       │  • Submit Ticket │                          │  • Dynamic Stats │
       │  • AI Live Assist│                          │  • All Complaints│
       │  • Track by ID   │                          │  • Quick Status  │
       │  • View All Log  │                          │  • AI Analytics  │
       └─────────┬────────┘                          └─────────┬────────┘
                 │                                             │
                 └──────────────────────┬──────────────────────┘
                                        │ REST API (/api)
                                        ▼
                    ┌────────────────────────────────────────┐
                    │      Node.js & Express.js Backend      │
                    │   • AI Triage & Urgency NLP Engine     │
                    │   • Sequential Unique ID Generator     │
                    │   • REST CRUD Endpoints                │
                    └───────────────────┬────────────────────┘
                                        │ Mongoose
                                        ▼
                    ┌────────────────────────────────────────┐
                    │   MongoDB Database & MongoDB Compass   │
                    │   URI: mongodb://localhost:27017/     │
                    │        smart_campus_cm                 │
                    └────────────────────────────────────────┘
```

### Module Breakdown

#### A. Student Portal
1. **Submit Complaint Form:**
   - **Student Full Name** (Validated, min 2 characters).
   - **Department Dropdown:**
     - Computer Science and Business Systems
     - Computer Science and Engineering
     - Information Technology
     - Electronics and Communication Engineering
     - Electrical and Electronics Engineering
     - Mechanical Engineering
     - Civil Engineering
     - Other
   - **Complaint Category Dropdown:**
     - Classroom Projector
     - Wi-Fi / Internet
     - Drinking Water
     - Laboratory Equipment
     - Washroom Maintenance
     - Hostel Maintenance
     - Other
   - **Specific Location / Room No.** (e.g., *Room LH-302, Workshop B, Library 3rd Floor*).
   - **Complaint Description** (Validated, min 10 characters).
   - **Real-Time AI Assistant Preview:** Analyzes the description as the student types, predicts category, assesses priority (`Critical`, `High`, `Medium`, `Low`), and displays immediate hazard warnings.
   - **Submission Confirmation Modal:** Displays unique ID (`CMP-2026-XXXX`) with a 1-click copy button and a direct "Track Status Now" action.
2. **Track Complaint Status:**
   - Search input by unique Complaint ID.
   - 3-stage visual progress milestone: Submitted & Triaged → Under Investigation → Resolved & Verified.
   - Complete metadata view with technician notes and timeline history.
   - Clear error messages when an invalid ID is entered.
3. **Submitted Complaints List:**
   - Structured responsive table of all registered campus complaints.
   - Search & Category filtering with 1-click tracking.

#### B. Authentication & Role-Based Access Control (RBAC)
1. **Student Login & Registration:**
   - Sign in using college email and password.
   - Self-registration for new students (Full Name, Department, Student ID/Roll No).
   - Instant **"⚡ 1-Click Demo Student Login"** for quick testing (`student@campus.edu` / `student123`).
   - Automatically pre-populates student name and department into the complaint submission form.
2. **Administrator Login:**
   - Dedicated admin portal login with security verification.
   - Instant **"⚡ 1-Click Demo Admin Login"** (`admin@campus.edu` / `admin123`).
   - Role-guarded: Only authorized administrative accounts can view the Admin Console, update complaint statuses, and access AI facility analytics.

#### C. Admin Dashboard
1. **Dynamic Statistics Cards (4 Summary Cards):**
   - **Total Complaints** (Count of all campus tickets).
   - **Pending Complaints** (Awaiting technician assignment).
   - **In Progress Complaints** (Under active investigation/repair).
   - **Resolved Complaints** (Fixed & closed, with overall resolution percentage).
   - *Cards dynamically update whenever complaint statuses change.*
2. **Complaints Console Table:**
   - Tabular view: Complaint ID, Student Name, Department, Category, Description, Date, Status, Actions.
   - Real-time dropdown to transition between `Pending`, `In Progress`, and `Resolved`.
   - Category filter, Status filter, Department filter, and keyword search.
   - CSV Export feature for administrative reports.
3. **Complaint Detail & Remarks Modal:**
   - Inspect full issue description, student details, location, and AI triage breakdown.
   - Append administrative remarks and technician notes.
4. **AI Facility Intelligence & Insights:**
   - Visual bar chart distribution across facility categories.
   - Department workload analysis.
   - Priority distribution breakdown (`Critical`, `High`, `Medium`, `Low`).

---

## 3. DIRECT — Folder & File Structure

```
Smart campus/
├── backend/
│   ├── config/
│   │   └── db.js                 # Resilient MongoDB Mongoose connection handler
│   ├── controllers/
│   │   └── complaintController.js # CRUD, filtering, ID generation, dynamic stats
│   ├── data/
│   │   └── seedData.js           # 7 realistic demo complaints with AI attributes
│   ├── models/
│   │   └── Complaint.js          # Mongoose schema with sequential ID generator
│   ├── routes/
│   │   └── complaintRoutes.js    # Express REST API routes
│   ├── services/
│   │   └── aiTriageService.js    # Zero-dependency campus NLP AI triage engine
│   ├── .env                      # MongoDB URI & server port configuration
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies (express, mongoose, cors, dotenv)
│   ├── seed.js                   # Standalone database population script
│   └── server.js                 # Express server entry point with auto-seeding
├── frontend/
│   ├── public/
│   │   └── favicon.svg           # Smart Campus graduation cap icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard/
│   │   │   │   ├── AdminSidebar.jsx
│   │   │   │   ├── AiAnalyticsView.jsx
│   │   │   │   ├── ComplaintDetailModal.jsx
│   │   │   │   ├── ComplaintTable.jsx
│   │   │   │   └── StatCards.jsx
│   │   │   ├── StudentPortal/
│   │   │   │   ├── ComplaintForm.jsx
│   │   │   │   ├── ComplaintTracker.jsx
│   │   │   │   └── StudentComplaintList.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PriorityBadge.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── Toast.jsx
│   │   ├── services/
│   │   │   ├── api.js            # Dual-mode API client (MongoDB REST + Local fallback)
│   │   │   └── localAiEngine.js  # Real-time client-side AI analysis
│   │   ├── App.jsx               # Master React container & state manager
│   │   ├── index.css             # Tailwind CSS directives & custom animations
│   │   └── main.jsx              # Vite React entry point
│   ├── .env                      # Frontend API base URL configuration
│   ├── index.html                # HTML5 entry with Google Fonts
│   ├── package.json              # Frontend dependencies (react, lucide-react, vite, tailwind)
│   ├── postcss.config.js         # PostCSS configuration
│   ├── tailwind.config.js        # Tailwind CSS theme & color palette
│   └── vite.config.js            # Vite build & reverse-proxy configuration
├── preview/
│   └── index.html                # Standalone zero-install browser distribution
├── package.json                  # Root orchestration script
└── README.md                     # Comprehensive documentation & running instructions
```

---

## 4. DELIVER — Running Instructions

### Option 1: Standalone Instant Launch (Zero Installation Required)
For instant evaluation on any device:
1. Navigate to the `preview/` folder.
2. Double-click `preview/index.html` (or right-click → Open with Chrome / Edge / Firefox).
3. The complete application runs immediately in the browser with full styling, AI triage, search, filters, modal dialogs, and persistent `localStorage` storage!

---

### Option 2: Full MERN Stack Execution with MongoDB Compass

#### Prerequisites
- **Node.js** (v18.0.0 or higher) & **npm**
- **MongoDB Community Server** running locally on port 27017
- **MongoDB Compass** (Official GUI for MongoDB)

#### Step 1: Open MongoDB Compass & Verify Connection
1. Launch **MongoDB Compass** on your computer.
2. In the "New Connection" screen, enter the connection URI:
   ```
   mongodb://localhost:27017
   ```
3. Click **Connect**. Compass will show your local MongoDB instance.
4. Your `backend/.env` file is already pre-configured to use this database:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/smart_campus_cm
   CLIENT_URL=http://localhost:5173
   ```
   *(Note: Once you seed or start the backend, a new database named `smart_campus_cm` with the `complaints` collection will appear automatically inside MongoDB Compass).*

#### Step 2: Install Backend & Frontend Dependencies
Open a terminal in the root directory:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### Step 3: Seed the Database with Realistic Demo Complaints
```bash
cd ../backend
npm run seed
```
This loads 7 realistic campus facility complaints into MongoDB covering all 8 departments and 7 categories.

#### Step 4: Start Backend Server
```bash
cd ../backend
npm start
```
The backend API starts on **http://localhost:5000**.
- Health Check: `http://localhost:5000/api/health`
- Complaints API: `http://localhost:5000/api/complaints`
- Stats API: `http://localhost:5000/api/complaints/stats/summary`

#### Step 5: Start Frontend Development Server
Open a second terminal:
```bash
cd frontend
npm run dev
```
Open **http://localhost:5173** in your browser. The frontend automatically proxies API calls to `http://localhost:5000` and displays a green `MongoDB Online` badge!

#### Step 6: View & Manage Live Data in MongoDB Compass
1. Switch to **MongoDB Compass**.
2. Click the **Refresh Databases** button (or press `Ctrl + R`).
3. Under the database list on the left panel, click on **`smart_campus_cm`**.
4. Click on the **`complaints`** collection.
5. You can now see all complaint documents (e.g. `CMP-2026-1001`, `CMP-2026-1002`, etc.) in real-time, view their AI priority scores, urgency metrics, timeline logs, and status updates!

---

## 5. DEMO DATA REFERENCE

### Demo Authentication Credentials

| Role | Email | Password | Assigned Name / Department | Permissions |
|---|---|---|---|---|
| **Student** | `student@campus.edu` | `student123` | Aarav Sharma (CSE) | Submit complaints, live AI triage, track personal & campus tickets |
| **Admin** | `admin@campus.edu` | `admin123` | Facility Admin Officer | Full console, change statuses (`Pending`/`In Progress`/`Resolved`), view AI analytics, export CSV |

*(Tip: Both the React app and preview version include a **"1-Click Fill & Sign In"** button for instant access).*

### Pre-loaded Campus Complaints
|---|---|---|---|---|---|---|
| `CMP-2026-1001` | Aarav Sharma | Computer Science & Eng. | Classroom Projector | LH-302 | High (72%) | In Progress |
| `CMP-2026-1002` | Sneha Patel | Information Technology | Wi-Fi / Internet | Central Library 3rd Fl. | High (68%) | Pending |
| `CMP-2026-1003` | Rohan Deshmukh | Mechanical Engineering | Drinking Water | Workshop Block B | Medium (55%) | Resolved |
| `CMP-2026-1004` | Priya Sundaram | Electronics & Comm. Eng. | Laboratory Equipment | Lab 204, Bench 04 | Critical (92%) | In Progress |
| `CMP-2026-1005` | Kavya Nair | CS & Business Systems | Washroom Maintenance | Block A, 2nd Floor | Medium (48%) | Pending |
| `CMP-2026-1006` | Aditya Verma | Electrical & Electronics | Hostel Maintenance | Boys Hostel 2, Rm 314 | Medium (50%) | Resolved |
| `CMP-2026-1007` | Vikram Joshi | Civil Engineering | Laboratory Equipment | SOM Lab, Ground Floor | High (70%) | Pending |

---

## 6. QUALITY ASSURANCE & VERIFICATION SCENARIOS

| # | Test Scenario | Expected Outcome | Verification Status |
|---|---|---|:---:|
| 1 | **Submit Valid Complaint** | Form submits, unique ID generated, success screen appears with 1-click track button. | Passed |
| 2 | **Submit Missing Fields** | Form shows inline validation errors for missing name, department, category, or short description. | Passed |
| 3 | **Unique Complaint ID** | ID follows format `CMP-YYYY-XXXX` sequentially without duplication. | Passed |
| 4 | **Search Valid ID** | Returns complaint matching `CMP-2026-1001` with visual 3-stage progress bar and logs. | Passed |
| 5 | **Search Invalid ID** | Displays clear error alert: *"No complaint found with ID..."* without crashing. | Passed |
| 6 | **View Submitted Complaints** | Structured responsive table renders all complaints with badges and action links. | Passed |
| 7 | **Filter by Category** | Selecting a category (e.g. *Drinking Water*) isolates matching records instantly. | Passed |
| 8 | **Filter by Status** | Selecting a status (e.g. *Pending*) filters the table and matches the summary count. | Passed |
| 9 | **Status: Pending → In Progress** | Status updates immediately; 'In Progress' count increments; 'Pending' decrements. | Passed |
| 10 | **Status: In Progress → Resolved** | Status marks as 'Resolved'; green badge displayed; resolution rate recalculates. | Passed |
| 11 | **Dynamic Statistics** | Summary cards reflect all database updates immediately without page reloads. | Passed |
| 12 | **Browser Refresh Persistence** | Refreshing the browser preserves all complaints and status updates seamlessly. | Passed |
| 13 | **All Navigation & Actions** | Every button, search field, dropdown, filter, and modal functions cleanly. | Passed |
| 14 | **Responsive Layout** | Layout adapts fluidly on desktop, tablet, and mobile screen viewports. | Passed |

---

## 7. LICENSE
This project is open-source and free to use under the **MIT License**.
