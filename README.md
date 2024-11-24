# RBAC Event Management System

## Overview

The **Event Management System (EMS)** is a **Role-Based Access Control (RBAC)** application designed for secure and efficient event management. With predefined roles such as `ADMIN`, `ORGANIZER`, and `VIEWER`, and granular permissions like `Manage Users`, `Manage Roles`, `Manage Events`, and `Register/Unregister Events`, the system ensures that users have appropriate access levels based on their roles and responsibilities.

---

## Features

### Manage Roles
- **Create/Add Roles**:  
  Only `ADMIN` and users with the `manage_roles` permission can create roles and assign predefined permissions.
- **Read/View Roles**:  
  Only `ADMIN` and users with the `manage_roles` permission can view roles.
- **Update Roles**:  
  Only `ADMIN` and users with the `manage_roles` permission can update roles by modifying their names or permissions.
- **Delete Roles**:  
  Only `ADMIN` and users with the `manage_roles` permission can delete roles.

---

### Manage Users
- **Create/Add Users**:  
  Only `ADMIN` and users with the `manage_users` permission can add users and set their account status (either `ACTIVE` or `INACTIVE`).
- **Read/View Users**:  
  Only `ADMIN` and users with the `manage_users` permission can view users.
- **Update Users**:  
  Only `ADMIN` and users with the `manage_users` permission can update user details such as email, role, account status, or additional permissions.
- **Delete Users**:  
  Only `ADMIN` and users with the `manage_users` permission can delete users.

---

### Manage Events
- **Create/Add Events**:  
  Only `ORGANIZER` and users with the `manage_events` permission can create events.
- **Read/View Events**:  
  - `ORGANIZER` (the event creator) and users with the `manage_events` or `register_events` permission can view events.
  - **Special Case**:  
    - **Sarves** is a predefined `ORGANIZER` who has added multiple events.  
    - **Nalan** is another predefined `ORGANIZER` who cannot view events created by `Sarves` unless they have the `register_events` permission.
- **Update Events**:  
  Only `ORGANIZER` (the creator) or users with the `manage_events` permission can update events.
- **Delete Events**:  
  Only `ORGANIZER` (the creator) or users with the `manage_events` permission can delete events.

---

### Export Events
- **Export to Excel**:  
  Only `ORGANIZER` or users with both the `manage_events` and `export_events` permissions can export events to an Excel file.
- **Export to PDF**:  
  **Planned for future implementation.**

---

### Register/Unregister Events
- **View and Register Events**:  
  `VIEWER` or users with the `register_events` and `unregister_events` permissions can view the list of events and register/unregister for events.

---

## Technology Stack

- **Frontend**:  
  - 🚀 [React](https://reactjs.org) with modern tools like Vite for fast development.  
  - 💻 Built with **TypeScript**, **Hooks**, and a robust frontend ecosystem.  
  - 🎨 [Material UI (MUI)](https://mui.com/material-ui/) for prebuilt, customizable UI components.  
  - 📖 [Redux](https://redux.js.org) for centralized state management.  
  - 🎨 [Tailwind CSS](https://tailwindcss.com) for responsive and modern UI styling.  

---

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/TinkerWizard/RBAC-Event-Management-System.git
```

### 2. Extract, navigate to the root directory and install dependencies
```bash
cd RBAC-Event-Management-System
npm install
```
### 3. Run the Application
```bash
npm run dev
```

## Credentials

| Role       | Username | Password | Status|
|------------|----------|----------|-------|
| **ADMIN**  | sadha | sadha |ACTIVE|
| **ORGANIZER** | sarves | sarves |ACTIVE|
| **VIEWER** | sanjay | sanjay |ACTIVE|
|**VIEWER**| saran | saran | INACTIVE|
|**ORGANIZER** | nalan | nalan | ACTIVE |

