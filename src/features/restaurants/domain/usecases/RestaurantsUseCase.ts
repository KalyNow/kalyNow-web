import { Either, left } from '@sweet-monads/either';
import { AppError } from '../../../../core/types/AppError';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { IRestaurantsRepository } from '../repositories/IRestaurantsRepository';
import { IRestaurantsUseCase } from './IRestaurantsUseCase';
import { RestaurantEntity } from '../entities/RestaurantEntity';
import { GetRestaurantsFiltersParams, GetRestaurantByIdParams, CreateRestaurantParams } from '../types/RestaurantsDomainTypes';

export class RestaurantsUseCase implements IRestaurantsUseCase {
    private repository: IRestaurantsRepository;

    constructor(repository: IRestaurantsRepository) {
        this.repository = repository;
    }

    async getRestaurants(
        filters: GetRestaurantsFiltersParams
    ): Promise<Either<AppError, PaginatedArray<RestaurantEntity>>> {
        if (filters.page !== undefined && filters.page < 1) {
            return left(new AppError('Page must be greater than 0', '400', 'validation_error'));
        }
        return this.repository.getRestaurants(filters);
    }

    async getRestaurantById(
        params: GetRestaurantByIdParams
    ): Promise<Either<AppError, RestaurantEntity>> {
        if (!params.id || !params.id.trim()) {
            return left(new AppError('Restaurant ID is required', '400', 'validation_error'));
        }
        return this.repository.getRestaurantById(params);
    }

    async createRestaurant(
        params: CreateRestaurantParams
    ): Promise<Either<AppError, RestaurantEntity>> {
        if (!params.name || !params.name.trim()) {
            return left(new AppError('Le nom du restaurant est requis', '400', 'validation_error'));
        }
        if (!params.address || !params.address.trim()) {
            return left(new AppError("L'adresse est requise", '400', 'validation_error'));
        }
        return this.repository.createRestaurant(params);
    }

    async uploadRestaurantLogo(
        restaurantId: string,
        file: File
    ): Promise<Either<AppError, RestaurantEntity>> {
        if (!restaurantId || !restaurantId.trim()) {
            return left(new AppError('Restaurant ID requis', '400', 'validation_error'));
        }
        if (!file) {
            return left(new AppError('Fichier requis', '400', 'validation_error'));
        }
        return this.repository.uploadRestaurantLogo(restaurantId, file);
    }
}
