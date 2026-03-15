import { Either, left } from '@sweet-monads/either';
import { AppError } from '../../../../core/types/AppError';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { IOffersRepository } from '../repositories/IOffersRepository';
import { IOffersUseCase } from './IOffersUseCase';
import { OfferEntity } from '../entities/OfferEntity';
import {
    GetOffersFiltersParams,
    GetOfferByIdParams,
    CreateOfferParams,
    UpdateOfferParams,
    UploadOfferImageParams,
} from '../types/OffersDomainTypes';

export class OffersUseCase implements IOffersUseCase {
    private repository: IOffersRepository;

    constructor(repository: IOffersRepository) {
        this.repository = repository;
    }

    async getOffers(filters: GetOffersFiltersParams): Promise<Either<AppError, PaginatedArray<OfferEntity>>> {
        if (filters.page !== undefined && filters.page < 1) {
            return left(new AppError('Page must be greater than 0', '400', 'validation_error'));
        }
        return this.repository.getOffers(filters);
    }

    async getOfferById(params: GetOfferByIdParams): Promise<Either<AppError, OfferEntity>> {
        if (!params.id?.trim()) {
            return left(new AppError('Offer ID is required', '400', 'validation_error'));
        }
        return this.repository.getOfferById(params);
    }

    async createOffer(data: CreateOfferParams): Promise<Either<AppError, OfferEntity>> {
        if (!data.restaurantId?.trim()) {
            return left(new AppError('Restaurant ID is required', '400', 'validation_error'));
        }
        if (!data.title?.trim()) {
            return left(new AppError('Title is required', '400', 'validation_error'));
        }
        if (data.price < 0) {
            return left(new AppError('Price must be positive', '400', 'validation_error'));
        }
        return this.repository.createOffer(data);
    }

    async updateOffer(id: string, data: UpdateOfferParams): Promise<Either<AppError, OfferEntity>> {
        if (!id?.trim()) {
            return left(new AppError('Offer ID is required', '400', 'validation_error'));
        }
        return this.repository.updateOffer(id, data);
    }

    async deactivateOffer(id: string): Promise<Either<AppError, OfferEntity>> {
        if (!id?.trim()) {
            return left(new AppError('Offer ID is required', '400', 'validation_error'));
        }
        return this.repository.deactivateOffer(id);
    }

    async activateOffer(id: string): Promise<Either<AppError, OfferEntity>> {
        if (!id?.trim()) {
            return left(new AppError('Offer ID is required', '400', 'validation_error'));
        }
        return this.repository.activateOffer(id);
    }

    async uploadOfferImage(params: UploadOfferImageParams): Promise<Either<AppError, OfferEntity>> {
        if (!params.id?.trim()) {
            return left(new AppError('Offer ID is required', '400', 'validation_error'));
        }
        if (!params.file) {
            return left(new AppError('Image file is required', '400', 'validation_error'));
        }
        return this.repository.uploadOfferImage(params);
    }
}
