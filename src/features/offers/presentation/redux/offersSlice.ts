import { createSlice } from '@reduxjs/toolkit';
import { OfferEntity } from '../../domain/entities/OfferEntity';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { getOffersProvider, getOfferByIdProvider } from './offersProvider';

interface OffersState {
    loading: boolean;
    error: string | null;
    success: string | null;
    offers: PaginatedArray<OfferEntity> | null;
    currentOffer: OfferEntity | null;
}

const initialState: OffersState = {
    loading: false,
    error: null,
    success: null,
    offers: null,
    currentOffer: null,
};

const offersSlice = createSlice({
    name: 'offers',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = null;
        },
        clearCurrentOffer: (state) => {
            state.currentOffer = null;
        },
        resetOffersState: (state) => {
            Object.assign(state, initialState);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOffersProvider.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOffersProvider.fulfilled, (state, action) => {
                state.loading = false;
                state.offers = action.payload;
            })
            .addCase(getOffersProvider.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load offers';
            })

            .addCase(getOfferByIdProvider.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentOffer = null;
            })
            .addCase(getOfferByIdProvider.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOffer = action.payload;
            })
            .addCase(getOfferByIdProvider.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Offer not found';
            });
    },
});

export const { clearError, clearSuccess, clearCurrentOffer, resetOffersState } = offersSlice.actions;
export const offersReducer = offersSlice.reducer;
