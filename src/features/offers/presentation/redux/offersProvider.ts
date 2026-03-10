import { createAsyncThunk } from '@reduxjs/toolkit';
import { OffersUseCase } from '../../domain/usecases/OffersUseCase';
import { OffersRepository } from '../../data/repositories/OffersRepository';
import { OffersDataSource } from '../../data/datasources/OffersDataSource';
import { GetOffersFiltersParams, GetOfferByIdParams } from '../../domain/types/OffersDomainTypes';

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
