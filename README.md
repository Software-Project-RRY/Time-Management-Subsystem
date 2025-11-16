# Time Management Subsystem – HR Management System

This repository contains the **Time Management Subsystem** for the HR Management System project.  
It handles all time-related processes including:

- Shift structures  
- Shift assignments  
- Attendance tracking  
- Exception handling  
- Leave conflict validation  
- Integration with other HR subsystems via dummy data  

This subsystem is built using **NestJS**, **MongoDB**, and **dummy JSON files** for cross-team integration during Milestone 1.

---

## 🧩 Subsystem Objectives

The Time Management subsystem enables the organization to:

✔ Create and manage shift schedules  
✔ Assign employees to shifts  
✔ Track employee attendance  
✔ Handle exceptions (late, early, OT, missing logs)  
✔ Validate assignments against leaves & employment details  
✔ Provide shift & attendance data to payroll  
✔ Integrate with Employee Profile, Leaves, and Org Structure subsystems

---

## 🏗 Architecture Overview

```
time-management-subsystem/
│
├── backend/
│    ├── src/
│    │    ├── modules/
│    │    │    ├── shift/           
│    │    │    ├── assignment/      
│    │    │    ├── attendance/      
│    │    │    ├── exceptions/      
│    │    │    └── utils/           
│    │    │
│    │    ├── external/             
│    │    │    ├── employees.json
│    │    │    ├── departments.json
│    │    │    ├── positions.json
│    │    │    ├── leaves.json
│    │    │    ├── offboarding.json
│    │    │    └── availability.json
│    │    │
│    │    └── app.module.ts
│    │
│    └── .env
│
└── README.md
```

---

## 👥 Subsystem Roles (3 Members)

### **Member 1 – Shifts & Assignments**
- Shift Module (CRUD)  
- Shift entity design  
- Assignment Module (CRUD + validation)  
- Employee validation via employees.json  
- Scheduling logic foundation  

### **Member 2 – Attendance & Exceptions**
- Attendance Module  
- Clock-in / clock-out simulation  
- Late/early/absence/OT calculations  
- Exception logs (missing check-ins/check-outs)  
- Link attendance with assignments  

### **Member 3 – Leave Conflicts & Offboarding Integration**
- Validate shift assignments against leaves  
- Block scheduling during leave  
- Disallow attendance after termination  
- Use leaves.json & offboarding.json  
- Provide conflict warnings & payroll data  

---

## 🔗 Subsystem Dependencies via Dummy Data

During Milestone 1, inter-subsystem communication is simulated using JSON files:

| External Subsystem | Dummy File | Purpose |
|---------------------|------------|---------|
| Employee Profile | employees.json | Validate employee existence |
| Org Structure | departments.json / positions.json | Department logic |
| Leaves | leaves.json | Prevent scheduling during leave |
| Offboarding | offboarding.json | Prevent scheduling after termination |
| Recruitment | availability.json | Scheduling for interviews |

Stored in:

```
backend/src/external/
```

---

## ⚙ Installation & Setup

### 1. Enter backend
```
cd backend
```

### 2. Install dependencies
```
npm install
```

### 3. Create `.env`
```
MONGO_URI=your_connection_string_here
```

### 4. Start server
```
npm run start:dev
```

---

## 🧩 Subsystem Modules & Endpoints

---

## 🟦 1. Shift Module
Handles shift definitions.

### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /shifts | Create shift |
| GET | /shifts | List shifts |
| GET | /shifts/:id | Get shift |
| PATCH | /shifts/:id | Update shift |
| DELETE | /shifts/:id | Delete shift |

---

## 🟩 2. Assignment Module
Assigns employees to shifts.

### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /assignments | Assign shift |
| GET | /assignments/employee/:id | List assignments |
| DELETE | /assignments/:id | Remove assignment |

---

## 🟧 3. Attendance Module (Member 2)
Handles:

- Check-in / check-out  
- Late, early, absence, OT  
- Matching logs to assigned shifts  

Example Endpoints:
| Method | Endpoint |
|--------|----------|
| POST | /attendance/check-in |
| POST | /attendance/check-out |
| GET | /attendance/employee/:id |

---

## 🟥 4. Exceptions Module (Member 2)
Tracks:

- Missing logs  
- Lateness  
- Early departures  
- Permission-based exceptions  

Example Endpoints:
| Method | Endpoint |
|--------|----------|
| GET | /exceptions/employee/:id |
| GET | /exceptions/daily |

---

## 🟪 5. Leave Conflict Module (Member 3)
Validates shift assignments & attendance using:

- **leaves.json**
- **offboarding.json**

Rules:
- Cannot assign shift during leave  
- Cannot assign after termination  
- Cannot attend during leave  

---

## 🗺 High-Level ERD (Full Subsystem)

```
+-------------+      1      +----------------+        1       +----------------+
|   Shift     |────────────<|  Assignment    |──────────────<|  Attendance     |
+-------------+             +----------------+                +----------------+
| _id         |             | _id            |                | _id            |
| name        |             | employeeId     |                | employeeId     |
| code        |             | shiftId        |                | date           |
| startTime   |             | startDate      |                | checkIn        |
| endTime     |             | endDate        |                | checkOut       |
+-------------+             | active         |                | status         |
                           +----------------+                +----------------+
                             ^
                             |
                             |  Connects to
                             |
                     +----------------+
                     |  Exceptions    |
                     +----------------+
```

---

## 🧪 Testing

Use **Thunder Client** or **Postman**.

Each module includes a testable set of sample requests:
- Create shift  
- Assign shift  
- Check-in / Check-out  
- Trigger exceptions  
- Create leave conflict  

---

## 📌 Milestone 1 Completed

✔ Shift module (CRUD)  
✔ Assignment module (CRUD + validation)  
✔ Dummy-data integration  
✔ Attendance foundations laid  
✔ Subsystem architecture structured  
✔ ERD created  
✔ Cross-team dummy integration ready  

---

## 🚀 Milestone 2 Roadmap

- Full attendance automation  
- Exception rules engine  
- Leave conflict validator  
- Overtime calculations  
- Shift rotation engine  
- Department-based scheduling rules  
- Payroll integration  
- Supervisor dashboards  

---

## 👨‍💻 Team Members

| Member | Responsibility |
|--------|----------------|
| Member 1 | Shifts + Assignments + Integration |
| Member 2 | Attendance + Exceptions |
| Member 3 | Leaves + Offboarding Integration |

---


