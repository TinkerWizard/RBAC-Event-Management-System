// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import roleReducer from './roleSlice';
import userReducer from './userSlice';
import eventReducer from './eventSlice';
// Create separate persist configs for each reducer if needed
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated'] // Specify which parts of auth state to persist
};

const rolePersistConfig = {
  key: 'roles',
  storage
};

const userPersistConfig = {
  key: 'users',
  storage
};

const eventPersistConfig = {
  key: 'events',
  storage
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedRoleReducer = persistReducer(rolePersistConfig, roleReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedEventReducer = persistReducer(eventPersistConfig, eventReducer);

// Combine the reducers
const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  roles: persistedRoleReducer,
  users: persistedUserReducer,
  events: persistedEventReducer
});

// Configure the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;