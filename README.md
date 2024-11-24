
# RBAC Event Management System

## Overview

The **Event Management System (EMS)** is a **Role-Based Access Control (RBAC)** application designed to streamline event management with a secure and efficient approach. With predefined roles such as `ADMIN`, `ORGANIZER`, and `VIEWER`, alongside granular permissions like `Manage Users`, `Manage Roles`, `Manage Events`, and `Register Events`, the system ensures users have appropriate access based on their responsibilities.

---

## Features

### Manage Roles
- **Create/Add Roles**: Only `ADMIN` or users with the `manage_roles` permission can create roles and assign permissions.
- **Read/View Roles**: Only accessible to `ADMIN` or users with the `manage_roles` permission.
- **Update Roles**: Only `ADMIN` or users with the `manage_roles` permission can modify role names or permissions.
- **Delete Roles**: Only `ADMIN` or users with the `manage_roles` permission can delete roles.

### Manage Users
- **Create/Add Users**: Only `ADMIN` or users with the `manage_users` permission can add users and set their account status (`ACTIVE` or `INACTIVE`).
- **Read/View Users**: Only accessible to `ADMIN` or users with the `manage_users` permission.
- **Update Users**: Modify details like email, role, status, or additional permissions (`ADMIN` or users with `manage_users`).
- **Delete Users**: Only `ADMIN` or users with the `manage_users` permission can delete users.

### Manage Events
- **Create/Add Events**: `ORGANIZER` or users with `manage_events` permission can create events.
- **Read/View Events**:  
  - `ORGANIZER` (creator) or users with `manage_events`/`register_events` permissions can view events.  
  - **Special Case**: Log in as `sarves` (predefined `ORGANIZER`) to view multiple events. If a new `ORGANIZER` logs in, no events will be listed until they create one.
- **Update/Delete Events**:  
  Only `ORGANIZER` (creator) or users with `manage_events` permission can update or delete events.

### Export Events
- **Export to Excel**: Accessible to `ORGANIZER` or users with `manage_events` and `export_events` permissions.
- **Export to PDF**: **Planned for future implementation.**

### Register Events
- **View and Register**:  
  `VIEWER` or users with the `register_events` permission can view and register for events.

---

## Technology Stack

- **Frontend**:  
  - 🚀 [React](https://reactjs.org) powered by **Vite** for lightning-fast development.  
  - 💻 Built with **TypeScript**, **Hooks**, and modern tools.  
  - 🎨 [Material UI (MUI)](https://mui.com/material-ui/) for prebuilt, customizable components.  
  - 📖 [Redux](https://redux.js.org) for centralized state management.  
  - 🎨 [Tailwind CSS](https://tailwindcss.com) for responsive and modern UI styling.  

---

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/TinkerWizard/RBAC-Event-Management-System.git
```

### 2. Navigate to the root directory and install dependencies
```bash
cd RBAC-Event-Management-System
npm install
```

### 3. Run the Application
```bash
npm run dev
```

---

## Login Details

Use the following credentials to test the application:

| Role       | Username | Password | Status   |
|------------|----------|----------|----------|
| **ADMIN**  | sadha    | sadha    | ACTIVE   |
| **ORGANIZER** | sarves   | sarves   | ACTIVE   |
| **VIEWER** | sanjay   | sanjay   | ACTIVE   |
| **VIEWER** | saran    | saran    | INACTIVE |
| **ORGANIZER** | nalan    | nalan    | ACTIVE   |

---

## Workflow

1. Log in using the credentials above.
2. Perform actions based on your role and permissions:
   - `ADMIN`: Manage users, roles, and permissions.
   - `ORGANIZER`: Create, view, update, delete, and export events.
   - `VIEWER`: View and register for events.

---

## Acknowledgments

- [React](https://reactjs.org) for building the user interface.
- [Redux](https://redux.js.org) for state management.
- [Material UI](https://mui.com/) for UI components.
- [Tailwind CSS](https://tailwindcss.com) for styling.

---

## Future Enhancements

- **PDF Export**: Enable exporting events to PDF.  
- **Notifications**: Add notifications for event registrations.  
- **Activity Logs**: Track and display user activity.
- **Register events**: Register and unregister events in real-time.

---

## FAQ

**Q: Can multiple users share the same role?**  
A: Yes, roles can be assigned to multiple users.

**Q: Can an organizer edit another organizer's events?**  
A: No, only the creator of the events can edit events.

---
