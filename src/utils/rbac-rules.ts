// src/utils/rbac-rules.ts
import { UserRole, Event } from "../types";

type Action = "read" | "create" | "edit" | "delete" | "manage";
type Resource = "events";

interface RBACRules {
  [key: string]: {
    events: Action[];
    allowedEvents?: (userId: number, event: Event) => boolean;
  };
}

const rules: RBACRules = {
  VIEWER: {
    events: ["read"],
  },
  ORGANIZER: {
    events: ["read", "create", "edit", "delete"],
    allowedEvents: (userId: number, event: Event) =>
      event.organizerId === userId,
  },
  ADMIN: {
    events: ["read", "create", "edit", "delete", "manage"],
  },
};

export const check = (
  role: UserRole,
  action: Action,
  resource: Resource,
  userId?: number,
  resourceData?: Event
): boolean => {
  const permissions = rules[role];
  if (!permissions) {
    return false;
  }

  const resourcePermissions = permissions[resource];
  if (!resourcePermissions) {
    return false;
  }

  if (role === "ORGANIZER" && resourceData && userId) {
    return (
      resourcePermissions.includes(action) &&
      (permissions.allowedEvents?.(userId, resourceData) ?? false)
    );
  }

  return resourcePermissions.includes(action);
};
