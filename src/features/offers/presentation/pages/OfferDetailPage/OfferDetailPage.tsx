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
import { PLACEHOLDER_IMAGES } from '../../../../../app/constants';

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
    const coverImage = currentOffer.imageUrls[0] || PLACEHOLDER_IMAGES.offerDetail;
    const discountPercent = currentOffer.discountedPrice !== null
        ? Math.round((1 - currentOffer.discountedPrice / currentOffer.price) * 100)
        : null;

    return (
        <Layout>
            <Button variant="text" onClick={() => navigate('/offers')} sx={{ mb: 2 }}>
                ← Back to Offers
            </Button>

            <Box
                component="img"
                src={coverImage}
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
                {discountPercent !== null && (
                    <Chip label={`-${discountPercent}%`} color="error" />
                )}
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {currentOffer.description}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography variant="h5" fontWeight={700} color="primary">
                        ${currentOffer.effectivePrice.toFixed(2)}
                    </Typography>
                    {currentOffer.discountedPrice !== null && (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ textDecoration: 'line-through' }}
                        >
                            ${currentOffer.price.toFixed(2)}
                        </Typography>
                    )}
                </Box>
                {(currentOffer.availableFrom || currentOffer.availableTo) && (
                    <Typography variant="body2" color="text.secondary">
                        {currentOffer.availableFrom && (
                            <>Valid from <strong>{currentOffer.availableFrom.toLocaleDateString()}</strong>{' '}</>)}
                        {currentOffer.availableTo && (
                            <>to <strong>{currentOffer.availableTo.toLocaleDateString()}</strong></>)}
                    </Typography>
                )}
            </Box>
        </Layout>
    );
};

export default OfferDetailPage;
