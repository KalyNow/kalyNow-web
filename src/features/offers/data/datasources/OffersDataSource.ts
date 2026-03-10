import AxiosService from '../../../../core/services/axiosService';
import { AppError } from '../../../../core/types/AppError';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { OfferEntity } from '../../domain/entities/OfferEntity';
import { GetOffersFiltersParams, GetOfferByIdParams } from '../../domain/types/OffersDomainTypes';
import { OfferModel } from '../DTO/OfferModel';

export interface IOffersDataSource {
    getOffers(token: string, filters: GetOffersFiltersParams): Promise<PaginatedArray<OfferEntity>>;
    getOfferById(token: string, params: GetOfferByIdParams): Promise<OfferEntity>;
}

export class OffersDataSource implements IOffersDataSource {
    private axiosService = AxiosService.getInstance();

    async getOffers(token: string, filters: GetOffersFiltersParams): Promise<PaginatedArray<OfferEntity>> {
        const endpoint =
            '/api/offers' +
            `?page=${filters.page || 1}` +
            (filters.search ? `&search=${encodeURIComponent(filters.search)}` : '') +
            (filters.restaurantId ? `&restaurant_id=${encodeURIComponent(filters.restaurantId)}` : '') +
            (filters.activeOnly !== undefined ? `&active=${filters.activeOnly}` : '');

        try {
            const response = await this.axiosService.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.data) {
                throw new AppError('Empty response', '001', 'offers data is empty');
            }

            return new PaginatedArray(
                response.data.data.map((item: unknown) => OfferModel.fromJson(item)),
                response.data.meta.totalPages,
                response.data.meta.currentPage,
                response.data.meta.totalItems
            );
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            if (error?.name === 'AxiosError') {
                throw new AppError(
                    error.response?.data?.message || 'Failed to fetch offers',
                    String(error.response?.status || '001'),
                    error.response?.data
                );
            }
            throw new AppError('Error', '000', error);
        }
    }

    async getOfferById(token: string, params: GetOfferByIdParams): Promise<OfferEntity> {
        try {
            const response = await this.axiosService.get(`/api/offers/${params.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.data) {
                throw new AppError('Empty response', '001', 'offer data is empty');
            }

            return OfferModel.fromJson(response.data);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            if (error?.name === 'AxiosError') {
                throw new AppError(
                    error.response?.data?.message || 'Offer not found',
                    String(error.response?.status || '001'),
                    error.response?.data
                );
            }
            throw new AppError('Error', '000', error);
        }
    }
}
