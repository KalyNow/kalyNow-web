import { createAsyncThunk } from '@reduxjs/toolkit';
import { OffersUseCase } from '../../domain/usecases/OffersUseCase';
import { OffersRepository } from '../../data/repositories/OffersRepository';
import { OffersDataSource } from '../../data/datasources/OffersDataSource';
import {
    GetOffersFiltersParams,
    GetOfferByIdParams,
    CreateOfferParams,
    UpdateOfferParams,
    UploadOfferImageParams,
} from '../../domain/types/OffersDomainTypes';

const dataSource = new OffersDataSource();
const repository = new OffersRepository(dataSource);
const useCase = new OffersUseCase(repository);

export const getOffersProvider = createAsyncThunk(
    'offers/getOffers',
    async (filters: GetOffersFiltersParams, { rejectWithValue }) => {
        const result = await useCase.getOffers(filters);
        return result.mapRight((data) => data)
            .mapLeft((error) => rejectWithValue(error.message))
            .value;
    }
);

export const getOfferByIdProvider = createAsyncThunk(
    'offers/getOfferById',
    async (params: GetOfferByIdParams, { rejectWithValue }) => {
        const result = await useCase.getOfferById(params);
        return result.mapRight((data) => data)
            .mapLeft((error) => rejectWithValue(error.message))
            .value;
    }
);

export const createOfferProvider = createAsyncThunk(
    'offers/createOffer',
    async (data: CreateOfferParams, { rejectWithValue }) => {
        const result = await useCase.createOffer(data);
        return result.mapRight((offer) => offer)
            .mapLeft((error) => rejectWithValue(error.message))
            .value;
    }
);

export const updateOfferProvider = createAsyncThunk(
    'offers/updateOffer',
    async ({ id, data }: { id: string; data: UpdateOfferParams }, { rejectWithValue }) => {
        const result = await useCase.updateOffer(id, data);
        return result.mapRight((offer) => offer)
            .mapLeft((error) => rejectWithValue(error.message))
            .value;
    }
);

export const deactivateOfferProvider = createAsyncThunk(
    'offers/deactivateOffer',
    async (id: string, { rejectWithValue }) => {
        const result = await useCase.deactivateOffer(id);
        return result.mapRight((offer) => offer)
            .mapLeft((error) => rejectWithValue(error.message))
            .value;
    }
);

export const activateOfferProvider = createAsyncThunk(
    'offers/activateOffer',
    async (id: string, { rejectWithValue }) => {
        const result = await useCase.activateOffer(id);
        return result.mapRight((offer) => offer)
            .mapLeft((error) => rejectWithValue(error.message))
            .value;
    }
);

export const uploadOfferImageProvider = createAsyncThunk(
    'offers/uploadOfferImage',
    async (params: UploadOfferImageParams, { rejectWithValue }) => {
        const result = await useCase.uploadOfferImage(params);
        return result.mapRight((offer) => offer)
            .mapLeft((error) => rejectWithValue(error.message))
            .value;
    }
);

