// src/types/index.ts

export type UserRole = 'ADMIN' | 'ORGANIZER' | 'VIEWER';

export type UserStatus = 'ACTIVE' | 'INACTIVE';

export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  otherPermissions?: string[];
}

export interface Role {
  id: number;
  name: UserRole;
  permissions: string[];
  createdAt: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  organizerId: number;
  status: EventStatus;
  capacity?: number;
  registrations?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalEvents: number;
  upcomingEvents: number;
  usersByRole: {
    role: UserRole;
    count: number;
  }[];
}