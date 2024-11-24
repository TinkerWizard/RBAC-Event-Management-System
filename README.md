
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
3. Log in as an ADMIN:
    - Use sadha's credentials to login.
    - You are presented with cards and metric bars showing some metadata's of users and roles. Below that, you can see Roles table and Users tables. Also, you can see the events list since `sadha` has been given the permission `register_events`.
    - You will see Roles tables with predefined roles `ADMIN`, `ORGANIZER` and `VIEWER`.
    - By default, you(even the admin) cannot delete/edit these roles. Since, the basic CRUD operations require these three roles.
    - Add a role. Then, you can perform other operations such as read, update and delete roles. 
    - You cannot add a duplicate role. 
    - You can give multiple permissions for the role. Each permissions give you rights to access certain screens and certain actions.
    - You can delete roles.
    - You will see Users tables with predefined users `sadha`, `sarves`, `sanjay`, `saran` and `nalan`.
    - You can filter users based on roles or status.
    - You can sort based on username or email.
    - By default, you(even the admin) cannot delete the users `sadha`, `sarves` and `sanjay`. Since, the basic CRUD operations require users with the respective rights.
    - Add a user. Then, you can perform other operations such as read, update and delete users or tinker around with `saran` or `nalan`.
    - Try logging in as `saran`. Since, `saran` is `INACTIVE`, you won't be prompted to the dashboard. You have to log in as an admin to update `saran` as `ACTIVE`.
    - You cannot add a duplicate username or email.
    - You can give additional permissions for the user. Each permissions give you rights to access certain screens and certain actions. 
    - By giving `register_events` permission to an ADMIN, the ADMIN can view the event list screen. Just like the user `sadha`.
    - You can delete users.
4. Log in as an ORGANIZER:
    - Use `sarves` credentials to log in as an ORGANIZER.
    - You are presented with cards showing some metadata's of events. Below that, you can see Events in Grid. Also, you can see the events list since `sarves` has been given the permission `register_events`.
    - The events section below has all the neccessary data of all events.
    - You can do CRUD operations on the events listed.
    - Since you're logged in as `sarves`, you're presented with events that are added using `sarves`.
    - If you login as `nalan`, you wont see any events. You're free to add events to check how other ORGANIZER's events are not listed. Thus, you cannot read, update or delete other ORGANIZER's events.
    - You can export events details and get them as an excel sheet.
    - You can delete events.
5. Log in as a VIEWER:
    - Use `sanjay` credentials to log in as an VIEWER.
    - You are presented with events list.
    - You can filter/search the event list by typing the location.
    - You can filter the event list based on the STATUS of the events.(Upcoming,  Ongoing, Completed, Cancelled).
    - You can sort events by Title or Date.
    - Registering an event was not implemented and marked for future implementations.

---

## Creating a better experince

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
