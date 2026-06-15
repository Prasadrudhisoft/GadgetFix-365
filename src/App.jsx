// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { UIProvider } from './contexts/UIContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { OrdersProvider } from './contexts/OrdersContext';
import { AdminProvider } from './contexts/AdminContext';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import AppRoutes from './routes';
import './App.css';

// ✅ New wrapper component
function ConditionalAdminProvider({ children }) {
  const { user } = useContext(AuthContext);
  
  if (user?.role === 'admin') {
    return <AdminProvider>{children}</AdminProvider>;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <UIProvider>
        <AuthProvider>
          <DataProvider>
            <OrdersProvider>
              <ConditionalAdminProvider>  {/* ✅ फक्त admin साठी */}
                <AppRoutes />
              </ConditionalAdminProvider>
            </OrdersProvider>
          </DataProvider>
        </AuthProvider>
      </UIProvider>
    </BrowserRouter>
  );
}

export default App;