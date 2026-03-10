import AxiosService from '../../../../core/services/axiosService';
import { AppError } from '../../../../core/types/AppError';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { RestaurantEntity } from '../../domain/entities/RestaurantEntity';
import { GetRestaurantsFiltersParams, GetRestaurantByIdParams } from '../../domain/types/RestaurantsDomainTypes';
import { RestaurantModel } from '../DTO/RestaurantModel';

export interface IRestaurantsDataSource {
    getRestaurants(token: string, filters: GetRestaurantsFiltersParams): Promise<PaginatedArray<RestaurantEntity>>;
    getRestaurantById(token: string, params: GetRestaurantByIdParams): Promise<RestaurantEntity>;
}

export class RestaurantsDataSource implements IRestaurantsDataSource {
    private axiosService = AxiosService.getInstance();

    async getRestaurants(
        token: string,
        filters: GetRestaurantsFiltersParams
    ): Promise<PaginatedArray<RestaurantEntity>> {
        const endpoint =
            '/api/restaurants' +
            `?page=${filters.page || 1}` +
            (filters.search ? `&search=${encodeURIComponent(filters.search)}` : '') +
            (filters.cuisine ? `&cuisine=${encodeURIComponent(filters.cuisine)}` : '') +
            (filters.city ? `&city=${encodeURIComponent(filters.city)}` : '');

        try {
            const response = await this.axiosService.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.data) {
                throw new AppError('Empty response', '001', 'restaurants data is empty');
            }

            return new PaginatedArray(
                response.data.data.map((item: unknown) => RestaurantModel.fromJson(item)),
                response.data.meta.totalPages,
                response.data.meta.currentPage,
                response.data.meta.totalItems
            );
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            if (error?.name === 'AxiosError') {
                throw new AppError(
                    error.response?.data?.message || 'Failed to fetch restaurants',
                    String(error.response?.status || '001'),
                    error.response?.data
                );
            }
            throw new AppError('Error', '000', error);
        }
    }

    async getRestaurantById(token: string, params: GetRestaurantByIdParams): Promise<RestaurantEntity> {
        try {
            const response = await this.axiosService.get(`/api/restaurants/${params.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.data) {
                throw new AppError('Empty response', '001', 'restaurant data is empty');
            }

            return RestaurantModel.fromJson(response.data);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            if (error?.name === 'AxiosError') {
                throw new AppError(
                    error.response?.data?.message || 'Restaurant not found',
                    String(error.response?.status || '001'),
                    error.response?.data
                );
            }
            throw new AppError('Error', '000', error);
        }
    }
}
