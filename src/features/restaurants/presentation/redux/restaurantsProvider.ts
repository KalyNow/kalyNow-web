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

export const createRestaurantProvider = createAsyncThunk(
    'restaurants/createRestaurant',
    async (data: {
        name: string;
        description?: string;
        address: string;
        phone?: string;
        email?: string;
        logoUrl?: string;
        latitude?: number;
        longitude?: number;
        isActive?: boolean;
    }, { rejectWithValue }) => {
        const result = await useCase.createRestaurant(data);
        return result.mapRight((r) => r)
            .mapLeft((error) => rejectWithValue(error.message))
            .value;
    }
);

export const uploadRestaurantLogoProvider = createAsyncThunk(
    'restaurants/uploadLogo',
    async ({ restaurantId, file }: { restaurantId: string; file: File }, { rejectWithValue }) => {
        const result = await useCase.uploadRestaurantLogo(restaurantId, file);
        return result.mapRight((r) => r)
            .mapLeft((error) => rejectWithValue(error.message))
            .value;
    }
);
