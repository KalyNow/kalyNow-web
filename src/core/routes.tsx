import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import HomePage from '../features/users/presentation/pages/HomePage';
import UsersPage from '../features/users/presentation/pages/UsersPage';
import LoginPage from '../features/auth/presentation/pages/LoginPage/LoginPage';
import RegisterPage from '../features/auth/presentation/pages/RegisterPage/RegisterPage';
import RestaurantsPage from '../features/restaurants/presentation/pages/RestaurantsPage/RestaurantsPage';
import RestaurantDetailPage from '../features/restaurants/presentation/pages/RestaurantDetailPage/RestaurantDetailPage';
import OffersPage from '../features/offers/presentation/pages/OffersPage/OffersPage';
import OfferDetailPage from '../features/offers/presentation/pages/OfferDetailPage/OfferDetailPage';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

const AppRoutes: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/restaurants" element={<RestaurantsPage />} />
                    <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
                    <Route path="/offers" element={<OffersPage />} />
                    <Route path="/offers/:id" element={<OfferDetailPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default AppRoutes;
