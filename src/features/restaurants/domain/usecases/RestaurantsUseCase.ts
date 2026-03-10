import { Either, left } from '@sweet-monads/either';
import { AppError } from '../../../../core/types/AppError';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { IRestaurantsRepository } from '../repositories/IRestaurantsRepository';
import { IRestaurantsUseCase } from './IRestaurantsUseCase';
import { RestaurantEntity } from '../entities/RestaurantEntity';
import { GetRestaurantsFiltersParams, GetRestaurantByIdParams } from '../types/RestaurantsDomainTypes';

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
}
