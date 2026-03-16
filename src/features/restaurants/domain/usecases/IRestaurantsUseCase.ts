import { Either } from '@sweet-monads/either';
import { AppError } from '../../../../core/types/AppError';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { RestaurantEntity } from '../entities/RestaurantEntity';
import { GetRestaurantsFiltersParams, GetRestaurantByIdParams, CreateRestaurantParams } from '../types/RestaurantsDomainTypes';

export interface IRestaurantsUseCase {
    getRestaurants(filters: GetRestaurantsFiltersParams): Promise<Either<AppError, PaginatedArray<RestaurantEntity>>>;
    getRestaurantById(params: GetRestaurantByIdParams): Promise<Either<AppError, RestaurantEntity>>;
    createRestaurant(params: CreateRestaurantParams): Promise<Either<AppError, RestaurantEntity>>;
    uploadRestaurantLogo(restaurantId: string, file: File): Promise<Either<AppError, RestaurantEntity>>;
}
