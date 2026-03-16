import { Either, left, right } from '@sweet-monads/either';
import { AppError } from '../../../../core/types/AppError';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { IRestaurantsDataSource } from '../datasources/RestaurantsDataSource';
import { IRestaurantsRepository } from '../../domain/repositories/IRestaurantsRepository';
import { RestaurantEntity } from '../../domain/entities/RestaurantEntity';
import { GetRestaurantsFiltersParams, GetRestaurantByIdParams, CreateRestaurantParams } from '../../domain/types/RestaurantsDomainTypes';
import AuthService from '../../../../core/services/authService';

export class RestaurantsRepository implements IRestaurantsRepository {
    private dataSource: IRestaurantsDataSource;
    private authService = AuthService.getInstance();

    constructor(dataSource: IRestaurantsDataSource) {
        this.dataSource = dataSource;
    }

    async getRestaurants(
        filters: GetRestaurantsFiltersParams
    ): Promise<Either<AppError, PaginatedArray<RestaurantEntity>>> {
        try {
            const tokenResult = await this.authService.getValidToken();
            if (tokenResult.isLeft()) return left(tokenResult.value);

            const restaurants = await this.dataSource.getRestaurants(tokenResult.value, filters);
            return right(restaurants);
        } catch (error) {
            if (error instanceof AppError) return left(error);
            return left(new AppError('An error occurred', '000', error));
        }
    }

    async getRestaurantById(
        params: GetRestaurantByIdParams
    ): Promise<Either<AppError, RestaurantEntity>> {
        try {
            const tokenResult = await this.authService.getValidToken();
            if (tokenResult.isLeft()) return left(tokenResult.value);

            const restaurant = await this.dataSource.getRestaurantById(tokenResult.value, params);
            return right(restaurant);
        } catch (error) {
            if (error instanceof AppError) return left(error);
            return left(new AppError('An error occurred', '000', error));
        }
    }

    async createRestaurant(
        params: CreateRestaurantParams
    ): Promise<Either<AppError, RestaurantEntity>> {
        try {
            const tokenResult = await this.authService.getValidToken();
            if (tokenResult.isLeft()) return left(tokenResult.value);

            const restaurant = await this.dataSource.createRestaurant(tokenResult.value, params);
            return right(restaurant);
        } catch (error) {
            if (error instanceof AppError) return left(error);
            return left(new AppError('An error occurred', '000', error));
        }
    }

    async uploadRestaurantLogo(
        restaurantId: string,
        file: File
    ): Promise<Either<AppError, RestaurantEntity>> {
        try {
            const tokenResult = await this.authService.getValidToken();
            if (tokenResult.isLeft()) return left(tokenResult.value);

            const restaurant = await this.dataSource.uploadRestaurantLogo(tokenResult.value, restaurantId, file);
            return right(restaurant);
        } catch (error) {
            if (error instanceof AppError) return left(error);
            return left(new AppError('An error occurred', '000', error));
        }
    }
}
