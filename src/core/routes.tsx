import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from './store';

// Pages publiques
import HomePage from '../features/users/presentation/pages/HomePage';
import UsersPage from '../features/users/presentation/pages/UsersPage';
import LoginPage from '../features/auth/presentation/pages/LoginPage/LoginPage';
import RegisterPage from '../features/auth/presentation/pages/RegisterPage/RegisterPage';
import RestaurantsPage from '../features/restaurants/presentation/pages/RestaurantsPage/RestaurantsPage';
import RestaurantDetailPage from '../features/restaurants/presentation/pages/RestaurantDetailPage/RestaurantDetailPage';
import OffersPage from '../features/offers/presentation/pages/OffersPage/OffersPage';
import OfferDetailPage from '../features/offers/presentation/pages/OfferDetailPage/OfferDetailPage';

// Pages par rôle
import MaintenancePage from '../features/users/presentation/pages/MaintenancePage';
import SellerDashboardPage from '../features/restaurants/presentation/pages/SellerDashboardPage/SellerDashboardPage';
import RestaurantOffersPage from '../features/restaurants/presentation/pages/RestaurantOffersPage/RestaurantOffersPage';

// Guards
import RoleRoute from './guards/RoleRoute';
import { USER_ROLES } from './constants/roles';

const theme = createTheme({
    palette: {
        primary: { main: '#C75B12' },
        secondary: { main: '#FFB067' },
    },
});

/**
 * Redirige un utilisateur connecté vers la page correspondant à son rôle.
 * Utilisé sur /login et /register pour éviter d'y retourner une fois connecté.
 */
const AuthRedirect: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { user, isLoading } = useSelector((state: RootState) => state.auth);

    if (isLoading) return children;

    if (user) {
        if (user.role === USER_ROLES.SELLER) return <Navigate to="/dashboard/seller" replace />;
        if (user.role === USER_ROLES.BUYER) return <Navigate to="/maintenance" replace />;
    }

    return children;
};

const AppRoutes: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    {/* ── Pages publiques ── */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route
                        path="/login"
                        element={<AuthRedirect><LoginPage /></AuthRedirect>}
                    />
                    <Route
                        path="/register"
                        element={<AuthRedirect><RegisterPage /></AuthRedirect>}
                    />
                    <Route path="/restaurants" element={<RestaurantsPage />} />
                    <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
                    <Route path="/offers" element={<OffersPage />} />
                    <Route path="/offers/:id" element={<OfferDetailPage />} />

                    {/* ── Pages BUYER (mobile only) ── */}
                    <Route
                        path="/maintenance"
                        element={
                            <RoleRoute requiredRole={USER_ROLES.BUYER} fallback="/dashboard/seller">
                                <MaintenancePage />
                            </RoleRoute>
                        }
                    />

                    {/* ── Pages SELLER ── */}
                    <Route
                        path="/dashboard/seller"
                        element={
                            <RoleRoute requiredRole={USER_ROLES.SELLER} fallback="/maintenance">
                                <SellerDashboardPage />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/dashboard/seller/restaurants/:restaurantId/offers"
                        element={
                            <RoleRoute requiredRole={USER_ROLES.SELLER} fallback="/maintenance">
                                <RestaurantOffersPage />
                            </RoleRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default AppRoutes;
