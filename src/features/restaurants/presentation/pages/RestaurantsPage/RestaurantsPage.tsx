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
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../../../core/store';
import { getRestaurantsProvider } from '../../redux/restaurantsProvider';
import { clearError } from '../../redux/restaurantsSlice';
import Layout from '../../../../../components/Layout/Layout';
import { PLACEHOLDER_IMAGES } from '../../../../../app/constants';

const RestaurantsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { restaurants, loading, error } = useSelector(
        (state: RootState) => state.restaurants
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(getRestaurantsProvider({ page: currentPage }));
    }, [currentPage, dispatch]);

    useEffect(() => {
        if (error) {
            setTimeout(() => dispatch(clearError()), 4000);
        }
    }, [error, dispatch]);

    const handleSearch = () => {
        setCurrentPage(1);
        dispatch(getRestaurantsProvider({ page: 1, search: searchTerm }));
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    return (
        <Layout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
                    Restaurants
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Discover restaurants near you
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <TextField
                    fullWidth
                    label="Search restaurants"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    disabled={loading}
                />
                <Button variant="contained" onClick={handleSearch} disabled={loading}>
                    Search
                </Button>
            </Box>

            {loading && !restaurants && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            )}

            {restaurants && (
                <>
                    <Grid container spacing={3}>
                        {restaurants.data.map((restaurant) => (
                            <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardActionArea
                                        onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                                        sx={{ flexGrow: 1 }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="160"
                                            image={restaurant.logoUrl || PLACEHOLDER_IMAGES.restaurant}
                                            alt={restaurant.name}
                                        />
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom noWrap>
                                                {restaurant.name}
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
                                                {restaurant.description}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                📍 {restaurant.address}
                                            </Typography>
                                            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                <Chip
                                                    label={restaurant.isOpen ? 'Open' : 'Closed'}
                                                    size="small"
                                                    color={restaurant.isOpen ? 'success' : 'default'}
                                                />
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {restaurants.data.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="h6" color="text.secondary">
                                No restaurants found
                            </Typography>
                        </Box>
                    )}

                    {restaurants.totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={restaurants.totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                disabled={loading}
                            />
                        </Box>
                    )}

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            {restaurants.totalItems} restaurant(s) total
                        </Typography>
                    </Box>
                </>
            )}
        </Layout>
    );
};

export default RestaurantsPage;
