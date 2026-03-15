import AxiosService from '../../../../core/services/axiosService';
import { AppError } from '../../../../core/types/AppError';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { OfferEntity } from '../../domain/entities/OfferEntity';
import {
    GetOffersFiltersParams,
    GetOfferByIdParams,
    CreateOfferParams,
    UpdateOfferParams,
    UploadOfferImageParams,
} from '../../domain/types/OffersDomainTypes';
import { OfferModel } from '../DTO/OfferModel';

export interface IOffersDataSource {
    getOffers(token: string, filters: GetOffersFiltersParams): Promise<PaginatedArray<OfferEntity>>;
    getOfferById(token: string, params: GetOfferByIdParams): Promise<OfferEntity>;
    createOffer(token: string, data: CreateOfferParams): Promise<OfferEntity>;
    updateOffer(token: string, id: string, data: UpdateOfferParams): Promise<OfferEntity>;
    deactivateOffer(token: string, id: string): Promise<OfferEntity>;
    activateOffer(token: string, id: string): Promise<OfferEntity>;
    uploadOfferImage(token: string, params: UploadOfferImageParams): Promise<OfferEntity>;
}

export class OffersDataSource implements IOffersDataSource {
    private axiosService = AxiosService.getInstance();

    private headers(token: string) {
        return { Authorization: `Bearer ${token}` };
    }

    private handleError(error: any, fallback: string): never {
        if (error instanceof AppError) throw error;
        if (error?.name === 'AxiosError') {
            throw new AppError(
                error.response?.data?.message || fallback,
                String(error.response?.status || '001'),
                error.response?.data
            );
        }
        throw new AppError(fallback, '000', error);
    }

    async getOffers(token: string, filters: GetOffersFiltersParams): Promise<PaginatedArray<OfferEntity>> {
        const endpoint =
            '/api/of/offers' +
            `?page=${filters.page || 1}` +
            `&limit=${filters.limit || 20}` +
            (filters.search ? `&search=${encodeURIComponent(filters.search)}` : '') +
            (filters.restaurantId ? `&restaurantId=${encodeURIComponent(filters.restaurantId)}` : '') +
            (filters.activeOnly !== undefined ? `&activeOnly=${filters.activeOnly}` : '');

        try {
            const response = await this.axiosService.get(endpoint, {
                headers: this.headers(token),
            });
            // API now returns { data, total, page, limit, totalPages }
            const body = response.data;
            const items: OfferEntity[] = Array.isArray(body)
                ? body.map((item: unknown) => OfferModel.fromJson(item))
                : (body.data as unknown[]).map((item) => OfferModel.fromJson(item));
            const totalPages = body.totalPages ?? 1;
            const currentPage = body.page ?? filters.page ?? 1;
            const totalItems = body.total ?? items.length;
            return new PaginatedArray(items, totalPages, currentPage, totalItems);
        } catch (error) {
            this.handleError(error, 'Failed to fetch offers');
        }
    }

    async getOfferById(token: string, params: GetOfferByIdParams): Promise<OfferEntity> {
        try {
            const response = await this.axiosService.get(`/api/of/offers/${params.id}`, {
                headers: this.headers(token),
            });
            return OfferModel.fromJson(response.data);
        } catch (error) {
            this.handleError(error, 'Offer not found');
        }
    }

    async createOffer(token: string, data: CreateOfferParams): Promise<OfferEntity> {
        try {
            const response = await this.axiosService.post('/api/of/offers', data, {
                headers: this.headers(token),
            });
            return OfferModel.fromJson(response.data);
        } catch (error) {
            this.handleError(error, 'Failed to create offer');
        }
    }

    async updateOffer(token: string, id: string, data: UpdateOfferParams): Promise<OfferEntity> {
        try {
            const response = await this.axiosService.put(`/api/of/offers/${id}`, data, {
                headers: this.headers(token),
            });
            return OfferModel.fromJson(response.data);
        } catch (error) {
            this.handleError(error, 'Failed to update offer');
        }
    }

    async deactivateOffer(token: string, id: string): Promise<OfferEntity> {
        try {
            const response = await this.axiosService.patch(`/api/of/offers/${id}/deactivate`, {}, {
                headers: this.headers(token),
            });
            return OfferModel.fromJson(response.data);
        } catch (error) {
            this.handleError(error, 'Failed to deactivate offer');
        }
    }

    async activateOffer(token: string, id: string): Promise<OfferEntity> {
        try {
            const response = await this.axiosService.patch(`/api/of/offers/${id}/activate`, {}, {
                headers: this.headers(token),
            });
            return OfferModel.fromJson(response.data);
        } catch (error) {
            this.handleError(error, 'Failed to activate offer');
        }
    }

    async uploadOfferImage(token: string, params: UploadOfferImageParams): Promise<OfferEntity> {
        try {
            const formData = new FormData();
            formData.append('file', params.file);
            const response = await this.axiosService.post(
                `/api/of/offers/${params.id}/images`,
                formData,
                {
                    headers: {
                        ...this.headers(token),
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return OfferModel.fromJson(response.data);
        } catch (error) {
            this.handleError(error, 'Failed to upload image');
        }
    }
}
