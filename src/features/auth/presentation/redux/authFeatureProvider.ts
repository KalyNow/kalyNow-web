import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthUseCase } from '../../domain/usecases/AuthUseCase';
import { AuthRepository } from '../../data/repositories/AuthRepository';
import { AuthDataSource } from '../../data/datasources/AuthDataSource';
import { LoginParams, RegisterParams } from '../../domain/types/AuthDomainTypes';

const dataSource = new AuthDataSource();
const repository = new AuthRepository(dataSource);
const useCase = new AuthUseCase(repository);

export const loginProvider = createAsyncThunk(
    'authFeature/login',
    async (params: LoginParams, { rejectWithValue }) => {
        const result = await useCase.login(params);
        return result.mapRight((tokens) => tokens)
            .mapLeft((error) => rejectWithValue(error.message))
            .value;
    }
);

export const registerProvider = createAsyncThunk(
    'authFeature/register',
    async (params: RegisterParams, { rejectWithValue }) => {
        const result = await useCase.register(params);
        return result.mapRight((user) => user)
            .mapLeft((error) => rejectWithValue(error.message))
            .value;
    }
);

export const logoutProvider = createAsyncThunk(
    'authFeature/logout',
    async (_, { rejectWithValue }) => {
        const result = await useCase.logout();
        return result.mapRight((success) => success)
            .mapLeft((error) => rejectWithValue(error.message))
            .value;
    }
);
