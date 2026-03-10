import { createSlice } from '@reduxjs/toolkit';
import { RestaurantEntity } from '../../domain/entities/RestaurantEntity';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { getRestaurantsProvider, getRestaurantByIdProvider } from './restaurantsProvider';

interface RestaurantsState {
    loading: boolean;
    error: string | null;
    success: string | null;
    restaurants: PaginatedArray<RestaurantEntity> | null;
    currentRestaurant: RestaurantEntity | null;
}

const initialState: RestaurantsState = {
    loading: false,
    error: null,
    success: null,
    restaurants: null,
    currentRestaurant: null,
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
            });
    },
});

export const { clearError, clearSuccess, clearCurrentRestaurant, resetRestaurantsState } =
    restaurantsSlice.actions;
export const restaurantsReducer = restaurantsSlice.reducer;
