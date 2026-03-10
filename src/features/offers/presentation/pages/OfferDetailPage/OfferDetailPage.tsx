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
import { getOfferByIdProvider } from '../../redux/offersProvider';
import { clearCurrentOffer, clearError } from '../../redux/offersSlice';
import Layout from '../../../../../components/Layout/Layout';

const OfferDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { currentOffer, loading, error } = useSelector(
        (state: RootState) => state.offers
    );

    useEffect(() => {
        if (id) {
            dispatch(getOfferByIdProvider({ id }));
        }
        return () => {
            dispatch(clearCurrentOffer());
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
                <Button variant="outlined" onClick={() => navigate('/offers')}>
                    Back to Offers
                </Button>
            </Layout>
        );
    }

    if (!currentOffer) {
        return null;
    }

    const isValid = currentOffer.isActive && !currentOffer.isExpired;

    return (
        <Layout>
            <Button variant="text" onClick={() => navigate('/offers')} sx={{ mb: 2 }}>
                ← Back to Offers
            </Button>

            <Box
                component="img"
                src={currentOffer.imageUrl || 'https://placehold.co/800x300?text=Offer'}
                alt={currentOffer.title}
                sx={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 2, mb: 3 }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Typography variant="h3" component="h1" fontWeight={700}>
                    {currentOffer.title}
                </Typography>
                <Chip
                    label={isValid ? 'Active' : 'Expired'}
                    color={isValid ? 'success' : 'default'}
                />
                {currentOffer.discountPercent !== null && (
                    <Chip label={`-${currentOffer.discountPercent}%`} color="error" />
                )}
            </Box>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                🍽️ {currentOffer.restaurantName}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {currentOffer.description}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {currentOffer.discountedPrice !== null && (
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                        <Typography variant="h5" fontWeight={700} color="primary">
                            ${currentOffer.discountedPrice.toFixed(2)}
                        </Typography>
                        {currentOffer.originalPrice !== null && (
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ textDecoration: 'line-through' }}
                            >
                                ${currentOffer.originalPrice.toFixed(2)}
                            </Typography>
                        )}
                    </Box>
                )}
                <Typography variant="body2" color="text.secondary">
                    Valid from{' '}
                    <strong>{currentOffer.validFrom.toLocaleDateString()}</strong>
                    {' '}to{' '}
                    <strong>{currentOffer.validUntil.toLocaleDateString()}</strong>
                </Typography>
            </Box>
        </Layout>
    );
};

export default OfferDetailPage;
