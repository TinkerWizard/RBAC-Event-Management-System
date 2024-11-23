import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import authReducer from './authSlice';
import roleReducer from './roleSlice';
import userReducer from './userSlice'

const persistConfig = {
  key: 'auth', // Only persist the auth slice
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedRoleReducer = persistReducer(persistConfig, roleReducer);
const persistedUserReducer = persistReducer(persistConfig, userReducer);
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Apply persistence only to the auth slice
    roles: persistedRoleReducer,
    users: persistedUserReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist compatibility
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
