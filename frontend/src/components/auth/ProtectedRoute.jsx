import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { loading, isAuthenticated, user, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-sm text-slate-600">
        Verificando acesso seguro...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const isAdminOverride = user?.role === 'ADMIN';

  if (allowedRoles.length > 0 && !hasRole(...allowedRoles) && !isAdminOverride) {
    const fallbackRoute = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
    return <Navigate to={fallbackRoute} replace />;
  }

  return children;
};

export default ProtectedRoute;
