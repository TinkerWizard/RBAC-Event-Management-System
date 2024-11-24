import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";

interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: [
    {
      id: 1,
      username: "sadha",
      password: "sadha",
      email: "sadha@example.com",
      role: "ADMIN",
      status: "ACTIVE",
      createdAt: "2024-01-01",
      otherPermissions: ["register_events", "unregister_events"],
    },
    {
      id: 2,
      username: "sarves",
      password: "sarves",
      email: "sarves@example.com",
      role: "ORGANIZER",
      status: "ACTIVE",
      createdAt: "2024-01-01",
      otherPermissions: ["register_events", "unregister_events"],
    },
    {
      id: 3,
      username: "sanjay",
      password: "sanjay",
      email: "sanjay@example.com",
      role: "VIEWER",
      status: "ACTIVE",
      createdAt: "2024-01-01",
      otherPermissions: [],
    },
    {
      id: 4,
      username: "saran",
      password: "saran",
      email: "saran@example.com",
      role: "VIEWER",
      status: "INACTIVE",
      createdAt: "2024-01-01",
      otherPermissions: [],
    },
  ],
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addUser(state, action: PayloadAction<User>) {
            state.users.push(action.payload);
        },
        updateUser(state, action: PayloadAction<User>) {
            const index = state.users.findIndex(
                (user) => user.id === action.payload.id
            );
            console.log('Updating user:', action.payload);
            console.log('Found at index:', index);
            if (index !== -1) {
                state.users[index] = action.payload;
                console.log('Updated state:', state.users);
            }
        },
        deleteUser(state, action: PayloadAction<User>) {
            state.users = state.users.filter((user) => user.id !== action.payload.id);
        },        
    },
});


export const {addUser, updateUser, deleteUser} = userSlice.actions;
export default userSlice.reducer;