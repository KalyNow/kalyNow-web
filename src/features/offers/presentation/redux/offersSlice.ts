import { createSlice } from '@reduxjs/toolkit';
import { OfferEntity } from '../../domain/entities/OfferEntity';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import {
    getOffersProvider,
    getOfferByIdProvider,
    createOfferProvider,
    updateOfferProvider,
    deactivateOfferProvider,
    activateOfferProvider,
    uploadOfferImageProvider,
} from './offersProvider';

interface OffersState {
    loading: boolean;
    dialogLoading: boolean;
    error: string | null;
    success: string | null;
    offers: PaginatedArray<OfferEntity> | null;
    currentOffer: OfferEntity | null;
}

const initialState: OffersState = {
    loading: false,
    dialogLoading: false,
    error: null,
    success: null,
    offers: null,
    currentOffer: null,
};

const offersSlice = createSlice({
    name: 'offers',
    initialState,
    reducers: {
        clearError: (state) => { state.error = null; },
        clearSuccess: (state) => { state.success = null; },
        clearCurrentOffer: (state) => { state.currentOffer = null; },
        resetOffersState: (state) => { Object.assign(state, initialState); },
    },
    extraReducers: (builder) => {
        builder
            // getOffers
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

            // getOfferById
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
            })

            // createOffer
            .addCase(createOfferProvider.pending, (state) => {
                state.dialogLoading = true;
                state.error = null;
            })
            .addCase(createOfferProvider.fulfilled, (state) => {
                state.dialogLoading = false;
                state.success = 'Offre créée avec succès !';
                state.offers = null;
            })
            .addCase(createOfferProvider.rejected, (state, action) => {
                state.dialogLoading = false;
                state.error = action.error.message || 'Erreur lors de la création';
            })

            // updateOffer
            .addCase(updateOfferProvider.pending, (state) => {
                state.dialogLoading = true;
                state.error = null;
            })
            .addCase(updateOfferProvider.fulfilled, (state, action) => {
                state.dialogLoading = false;
                state.success = 'Offre mise à jour avec succès !';
                state.currentOffer = action.payload;
                state.offers = null;
            })
            .addCase(updateOfferProvider.rejected, (state, action) => {
                state.dialogLoading = false;
                state.error = action.error.message || 'Erreur lors de la mise à jour';
            })

            // deactivateOffer
            .addCase(deactivateOfferProvider.pending, (state) => {
                state.dialogLoading = true;
                state.error = null;
            })
            .addCase(deactivateOfferProvider.fulfilled, (state, action) => {
                state.dialogLoading = false;
                state.success = 'Offre désactivée.';
                // update in-place so the tab filter reacts immediately
                if (state.offers) {
                    state.offers = {
                        ...state.offers,
                        data: state.offers.data.map((o) =>
                            o.id === action.payload?.id ? action.payload : o
                        ),
                    } as typeof state.offers;
                }
            })
            .addCase(deactivateOfferProvider.rejected, (state, action) => {
                state.dialogLoading = false;
                state.error = action.error.message || 'Erreur lors de la désactivation';
            })

            // activateOffer
            .addCase(activateOfferProvider.pending, (state) => {
                state.dialogLoading = true;
                state.error = null;
            })
            .addCase(activateOfferProvider.fulfilled, (state, action) => {
                state.dialogLoading = false;
                state.success = 'Offre réactivée !';
                if (state.offers) {
                    state.offers = {
                        ...state.offers,
                        data: state.offers.data.map((o) =>
                            o.id === action.payload?.id ? action.payload : o
                        ),
                    } as typeof state.offers;
                }
            })
            .addCase(activateOfferProvider.rejected, (state, action) => {
                state.dialogLoading = false;
                state.error = action.error.message || 'Erreur lors de la réactivation';
            })

            // uploadOfferImage
            .addCase(uploadOfferImageProvider.pending, (state) => {
                state.dialogLoading = true;
                state.error = null;
            })
            .addCase(uploadOfferImageProvider.fulfilled, (state, action) => {
                state.dialogLoading = false;
                state.success = 'Photo ajoutée avec succès !';
                state.currentOffer = action.payload;
            })
            .addCase(uploadOfferImageProvider.rejected, (state, action) => {
                state.dialogLoading = false;
                state.error = action.error.message || "Erreur lors de l'upload";
            });
    },
});

export const { clearError, clearSuccess, clearCurrentOffer, resetOffersState } = offersSlice.actions;
export const offersReducer = offersSlice.reducer;
