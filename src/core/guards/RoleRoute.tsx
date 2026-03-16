import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { RootState } from '../store';
import { BRAND } from '../theme/brandTokens';
import { UserRole } from '../constants/roles';

interface RoleRouteProps {
    /** Rôle requis pour accéder à cette route */
    requiredRole: UserRole;
    /** Element à rendre si le rôle correspond */
    children: React.ReactElement;
    /** Redirection si le rôle ne correspond pas (défaut: '/') */
    fallback?: string;
}

/**
 * Guard de route basé sur le rôle.
 * - Non authentifié → /login
 * - Chargement en cours → spinner
 * - Rôle OK → render children
 * - Rôle KO → fallback (défaut: '/')
 */
const RoleRoute: React.FC<RoleRouteProps> = ({
    requiredRole,
    children,
    fallback = '/',
}) => {
    const { user, isLoading } = useSelector((state: RootState) => state.auth);

    if (isLoading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: BRAND.bg,
                }}
            >
                <CircularProgress sx={{ color: BRAND.primary }} />
            </Box>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== requiredRole) {
        return <Navigate to={fallback} replace />;
    }

    return children;
};

export default RoleRoute;
