import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store, persistor, RootState } from './store/store';
import PrivateRoute from './components/PrivateRoute';
import LoginForm from './components/LoginForm';
import Dashboard from './components/admin/Dashboard';
import { PersistGate } from 'redux-persist/integration/react';

const queryClient = new QueryClient();

// Create a separate component for the routes
const AppRoutes = () => {
  // Now useSelector is used inside a component that's wrapped by Provider
  const roles = useSelector((state: RootState) => state.roles.roles);
  const roleNames = roles.map(role => role.name);
  console.log('Current roles:', roles);
  console.log('Role names:', roleNames);
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route element={<PrivateRoute allowedRoles={roleNames}><Outlet /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;