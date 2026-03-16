import { createSlice } from '@reduxjs/toolkit';
import { RestaurantEntity } from '../../domain/entities/RestaurantEntity';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { getRestaurantsProvider, getRestaurantByIdProvider, createRestaurantProvider, uploadRestaurantLogoProvider } from './restaurantsProvider';

interface RestaurantsState {
    loading: boolean;
    createLoading: boolean;
    logoLoading: string | null; // restaurantId en cours d'upload, null sinon
    error: string | null;
    success: string | null;
    restaurants: PaginatedArray<RestaurantEntity> | null;
    currentRestaurant: RestaurantEntity | null;
    createdRestaurant: RestaurantEntity | null;
}

const initialState: RestaurantsState = {
    loading: false,
    createLoading: false,
    logoLoading: null,
    error: null,
    success: null,
    restaurants: null,
    currentRestaurant: null,
    createdRestaurant: null,
};

const restaurantsSlice = createSlice({
    name: 'restaurants',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = null;
        },
        clearCurrentRestaurant: (state) => {
            state.currentRestaurant = null;
        },
        resetRestaurantsState: (state) => {
            Object.assign(state, initialState);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRestaurantsProvider.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRestaurantsProvider.fulfilled, (state, action) => {
                state.loading = false;
                state.restaurants = action.payload;
            })
            .addCase(getRestaurantsProvider.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load restaurants';
            })

            .addCase(getRestaurantByIdProvider.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentRestaurant = null;
            })
            .addCase(getRestaurantByIdProvider.fulfilled, (state, action) => {
                state.loading = false;
                state.currentRestaurant = action.payload;
            })
            .addCase(getRestaurantByIdProvider.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Restaurant not found';
            })

            .addCase(createRestaurantProvider.pending, (state) => {
                state.createLoading = true;
                state.error = null;
                state.createdRestaurant = null;
            })
            .addCase(createRestaurantProvider.fulfilled, (state, action) => {
                state.createLoading = false;
                state.success = 'Restaurant créé avec succès !';
                state.createdRestaurant = action.payload;
                state.restaurants = null;
            })
            .addCase(createRestaurantProvider.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.error.message || 'Erreur lors de la création du restaurant';
            })

            .addCase(uploadRestaurantLogoProvider.pending, (state, action) => {
                state.logoLoading = action.meta.arg.restaurantId;
                state.error = null;
            })
            .addCase(uploadRestaurantLogoProvider.fulfilled, (state, action) => {
                state.logoLoading = null;
                state.success = 'Logo mis à jour !';
                // Met à jour le restaurant dans la liste locale
                if (state.restaurants && action.payload) {
                    state.restaurants = {
                        ...state.restaurants,
                        data: state.restaurants.data.map((r) =>
                            r.id === action.payload!.id ? action.payload! : r
                        ),
                    };
                }
            })
            .addCase(uploadRestaurantLogoProvider.rejected, (state, action) => {
                state.logoLoading = null;
                state.error = action.error.message || 'Erreur lors de l\'upload du logo';
            });
    },
});

export const { clearError, clearSuccess, clearCurrentRestaurant, resetRestaurantsState } =
    restaurantsSlice.actions;
export const restaurantsReducer = restaurantsSlice.reducer;
