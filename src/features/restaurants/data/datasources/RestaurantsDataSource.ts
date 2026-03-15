import AxiosService from '../../../../core/services/axiosService';
import { AppError } from '../../../../core/types/AppError';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { RestaurantEntity } from '../../domain/entities/RestaurantEntity';
import { GetRestaurantsFiltersParams, GetRestaurantByIdParams, CreateRestaurantParams } from '../../domain/types/RestaurantsDomainTypes';
import { RestaurantModel } from '../DTO/RestaurantModel';

export interface IRestaurantsDataSource {
    getRestaurants(token: string, filters: GetRestaurantsFiltersParams): Promise<PaginatedArray<RestaurantEntity>>;
    getRestaurantById(token: string, params: GetRestaurantByIdParams): Promise<RestaurantEntity>;
    createRestaurant(token: string, params: CreateRestaurantParams): Promise<RestaurantEntity>;
    uploadRestaurantLogo(token: string, restaurantId: string, file: File): Promise<RestaurantEntity>;
}

export class RestaurantsDataSource implements IRestaurantsDataSource {
    private axiosService = AxiosService.getInstance();

    async getRestaurants(
        token: string,
        filters: GetRestaurantsFiltersParams
    ): Promise<PaginatedArray<RestaurantEntity>> {
        const endpoint =
            '/api/of/restaurants/me' +
            `?page=${filters.page || 1}` +
            `&limit=${filters.limit || 20}` +
            (filters.search ? `&search=${encodeURIComponent(filters.search)}` : '');

        try {
            const response = await this.axiosService.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.data) {
                throw new AppError('Empty response', '001', 'restaurants data is empty');
            }

            // L'API retourne maintenant { data, total, page, limit, totalPages }
            const body = response.data;
            const items: RestaurantEntity[] = Array.isArray(body)
                ? body.map((item: unknown) => RestaurantModel.fromJson(item))
                : (body.data as unknown[]).map((item) => RestaurantModel.fromJson(item));
            const totalPages = body.totalPages ?? 1;
            const currentPage = body.page ?? filters.page ?? 1;
            const totalItems = body.total ?? items.length;

            return new PaginatedArray(items, totalPages, currentPage, totalItems);
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

    async createRestaurant(token: string, params: CreateRestaurantParams): Promise<RestaurantEntity> {
        try {
            const response = await this.axiosService.post(
                '/api/of/restaurants',
                {
                    name: params.name,
                    description: params.description ?? '',
                    address: params.address,
                    phone: params.phone ?? null,
                    email: params.email ?? null,
                    logoUrl: params.logoUrl ?? null,
                    latitude: params.latitude ?? null,
                    longitude: params.longitude ?? null,
                    isActive: params.isActive ?? true,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!response.data) {
                throw new AppError('Empty response', '001', 'restaurant creation failed');
            }

            return RestaurantModel.fromJson(response.data);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            if (error?.name === 'AxiosError') {
                throw new AppError(
                    error.response?.data?.message || 'Failed to create restaurant',
                    String(error.response?.status || '001'),
                    error.response?.data
                );
            }
            throw new AppError('Error', '000', error);
        }
    }

    async uploadRestaurantLogo(token: string, restaurantId: string, file: File): Promise<RestaurantEntity> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await this.axiosService.post(
                `/api/of/restaurants/${restaurantId}/logo`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (!response.data) {
                throw new AppError('Empty response', '001', 'logo upload failed');
            }

            return RestaurantModel.fromJson(response.data);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            if (error?.name === 'AxiosError') {
                throw new AppError(
                    error.response?.data?.message || 'Failed to upload logo',
                    String(error.response?.status || '001'),
                    error.response?.data
                );
            }
            throw new AppError('Error', '000', error);
        }
    }
}
