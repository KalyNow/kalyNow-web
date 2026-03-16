import React, { useEffect, useState } from 'react';
import {
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    Box,
    Chip,
    CircularProgress,
    Alert,
    Pagination,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../../../core/store';
import { getOffersProvider } from '../../redux/offersProvider';
import { clearError } from '../../redux/offersSlice';
import Layout from '../../../../../components/Layout/Layout';
import { PLACEHOLDER_IMAGES } from '../../../../../app/constants';

const OffersPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { offers, loading, error } = useSelector(
        (state: RootState) => state.offers
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeOnly, setActiveOnly] = useState(false);

    useEffect(() => {
        dispatch(getOffersProvider({ page: currentPage, activeOnly }));
    }, [currentPage, activeOnly, dispatch]);

    useEffect(() => {
        if (error) {
            setTimeout(() => dispatch(clearError()), 4000);
        }
    }, [error, dispatch]);

    const handleSearch = () => {
        setCurrentPage(1);
        dispatch(getOffersProvider({ page: 1, search: searchTerm, activeOnly }));
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    return (
        <Layout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
                    Offers
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Exclusive deals and discounts from our restaurant partners
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                    sx={{ flexGrow: 1, minWidth: 200 }}
                    label="Search offers"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    disabled={loading}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={activeOnly}
                            onChange={(e) => {
                                setActiveOnly(e.target.checked);
                                setCurrentPage(1);
                            }}
                            disabled={loading}
                        />
                    }
                    label="Active only"
                />
                <Button variant="contained" onClick={handleSearch} disabled={loading}>
                    Search
                </Button>
            </Box>

            {loading && !offers && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            )}

            {offers && (
                <>
                    <Grid container spacing={3}>
                        {offers.data.map((offer) => (
                            <Grid item xs={12} sm={6} md={4} key={offer.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardActionArea
                                        onClick={() => navigate(`/offers/${offer.id}`)}
                                        sx={{ flexGrow: 1 }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="160"
                                            image={offer.imageUrls[0] || PLACEHOLDER_IMAGES.offer}
                                            alt={offer.title}
                                        />
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom noWrap>
                                                {offer.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                gutterBottom
                                                sx={{
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                }}
                                            >
                                                {offer.description}
                                            </Typography>
                                            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                {offer.discountedPrice !== null && (
                                                    <Chip
                                                        label={`-${Math.round((1 - offer.discountedPrice / offer.price) * 100)}%`}
                                                        size="small"
                                                        color="error"
                                                    />
                                                )}
                                                <Chip
                                                    label={offer.isActive && !offer.isExpired ? 'Active' : 'Expired'}
                                                    size="small"
                                                    color={offer.isActive && !offer.isExpired ? 'success' : 'default'}
                                                />
                                            </Box>
                                            <Typography
                                                variant="body1"
                                                fontWeight={700}
                                                color="primary"
                                                sx={{ mt: 1 }}
                                            >
                                                ${offer.effectivePrice.toFixed(2)}
                                                {offer.discountedPrice !== null && (
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ ml: 1, textDecoration: 'line-through' }}
                                                    >
                                                        ${offer.price.toFixed(2)}
                                                    </Typography>
                                                )}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {offers.data.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="h6" color="text.secondary">
                                No offers found
                            </Typography>
                        </Box>
                    )}

                    {offers.totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={offers.totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                disabled={loading}
                            />
                        </Box>
                    )}

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            {offers.totalItems} offer(s) total
                        </Typography>
                    </Box>
                </>
            )}
        </Layout>
    );
};

export default OffersPage;
