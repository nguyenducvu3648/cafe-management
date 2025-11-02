import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/auth';
import type { ReactNode } from 'react';


export default function ProtectedRoute({ children, requireAdmin = false }: { children: ReactNode; requireAdmin?: boolean }) {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && user?.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}


