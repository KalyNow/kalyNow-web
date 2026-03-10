import { createAsyncThunk } from '@reduxjs/toolkit';
import { RestaurantsUseCase } from '../../domain/usecases/RestaurantsUseCase';
import { RestaurantsRepository } from '../../data/repositories/RestaurantsRepository';
import { RestaurantsDataSource } from '../../data/datasources/RestaurantsDataSource';
import { GetRestaurantsFiltersParams, GetRestaurantByIdParams } from '../../domain/types/RestaurantsDomainTypes';

const dataSource = new RestaurantsDataSource();
const repository = new RestaurantsRepository(dataSource);
const useCase = new RestaurantsUseCase(repository);

export const getRestaurantsProvider = createAsyncThunk(
    'restaurants/getRestaurants',
    async (filters: GetRestaurantsFiltersParams, { rejectWithValue }) => {
        const result = await useCase.getRestaurants(filters);
        return result.mapRight((data) => data)
            .mapLeft((error) => rejectWithValue(error.message))
            .value;
    }
);

export const getRestaurantByIdProvider = createAsyncThunk(
    'restaurants/getRestaurantById',
    async (params: GetRestaurantByIdParams, { rejectWithValue }) => {
        const result = await useCase.getRestaurantById(params);
        return result.mapRight((data) => data)
            .mapLeft((error) => rejectWithValue(error.message))
            .value;
    }
);
