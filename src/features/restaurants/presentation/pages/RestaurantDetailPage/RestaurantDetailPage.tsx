import React, { useEffect } from 'react';
import {
    Typography,
    Box,
    Chip,
    CircularProgress,
    Alert,
    Button,
    Divider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../../../core/store';
import { getRestaurantByIdProvider } from '../../redux/restaurantsProvider';
import { clearCurrentRestaurant, clearError } from '../../redux/restaurantsSlice';
import Layout from '../../../../../components/Layout/Layout';
import { PLACEHOLDER_IMAGES } from '../../../../../app/constants';

const RestaurantDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { currentRestaurant, loading, error } = useSelector(
        (state: RootState) => state.restaurants
    );

    useEffect(() => {
        if (id) {
            dispatch(getRestaurantByIdProvider({ id }));
        }
        return () => {
            dispatch(clearCurrentRestaurant());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if (error) {
            setTimeout(() => dispatch(clearError()), 4000);
        }
    }, [error, dispatch]);

    if (loading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
                <Button variant="outlined" onClick={() => navigate('/restaurants')}>
                    Back to Restaurants
                </Button>
            </Layout>
        );
    }

    if (!currentRestaurant) {
        return null;
    }

    return (
        <Layout>
            <Button
                variant="text"
                onClick={() => navigate('/restaurants')}
                sx={{ mb: 2 }}
            >
                ← Back to Restaurants
            </Button>

            <Box
                component="img"
                src={currentRestaurant.logoUrl || PLACEHOLDER_IMAGES.restaurantDetail}
                alt={currentRestaurant.name}
                sx={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 2, mb: 3 }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Typography variant="h3" component="h1" fontWeight={700}>
                    {currentRestaurant.name}
                </Typography>
                <Chip
                    label={currentRestaurant.isOpen ? 'Open Now' : 'Closed'}
                    color={currentRestaurant.isOpen ? 'success' : 'default'}
                />
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {currentRestaurant.description}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1">
                    📍 {currentRestaurant.address}
                </Typography>
                {currentRestaurant.phone && (
                    <Typography variant="body1">
                        📞 {currentRestaurant.phone}
                    </Typography>
                )}
                {currentRestaurant.email && (
                    <Typography variant="body1">
                        ✉️ {currentRestaurant.email}
                    </Typography>
                )}
            </Box>
        </Layout>
    );
};

export default RestaurantDetailPage;
