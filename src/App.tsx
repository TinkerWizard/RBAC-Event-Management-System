import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store, persistor } from './store/store';
import PrivateRoute from './components/PrivateRoute';
import LoginForm from './components/LoginForm';
import Dashboard from './components/admin/Dashboard';
import { PersistGate } from 'redux-persist/integration/react';

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginForm />} />

              <Route element={<PrivateRoute allowedRoles={['ADMIN', 'ORGANIZER', 'VIEWER']}><Outlet /></PrivateRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;