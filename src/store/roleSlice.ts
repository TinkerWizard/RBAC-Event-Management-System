import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role } from "../types/index";

// Define the initial state
interface RoleState {
  roles: Role[];
}

const initialState: RoleState = {
  roles: [
    {
      id: 1,
      name: "ADMIN",
      permissions: ["manage_users", "manage_roles"],
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      name: "ORGANIZER",
      permissions: ["manage_events", "export_events"],
      createdAt: "2024-01-01",
    },
    {
      id: 3,
      name: "VIEWER",
      permissions: ["register_events"],
      createdAt: "2024-01-01",
    },
  ],
};

// Create the roleSlice
const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    addRole(state, action: PayloadAction<Role>) {
      state.roles.push(action.payload);
    },
    updateRole(state, action: PayloadAction<Role>) {
      const index = state.roles.findIndex(
        (role) => role.id === action.payload.id
      );
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
    },
    deleteRole(state, action: PayloadAction<number>) {
      state.roles = state.roles.filter((role) => role.id !== action.payload);
    },
  },
});

// Export the actions
export const { addRole, updateRole, deleteRole } = roleSlice.actions;

// Export the reducer
export default roleSlice.reducer;
