import { Either, left } from '@sweet-monads/either';
import { AppError } from '../../../../core/types/AppError';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { IOffersRepository } from '../repositories/IOffersRepository';
import { IOffersUseCase } from './IOffersUseCase';
import { OfferEntity } from '../entities/OfferEntity';
import { GetOffersFiltersParams, GetOfferByIdParams } from '../types/OffersDomainTypes';

export class OffersUseCase implements IOffersUseCase {
    private repository: IOffersRepository;

    constructor(repository: IOffersRepository) {
        this.repository = repository;
    }

    async getOffers(
        filters: GetOffersFiltersParams
    ): Promise<Either<AppError, PaginatedArray<OfferEntity>>> {
        if (filters.page !== undefined && filters.page < 1) {
            return left(new AppError('Page must be greater than 0', '400', 'validation_error'));
        }
        return this.repository.getOffers(filters);
    }

    async getOfferById(
        params: GetOfferByIdParams
    ): Promise<Either<AppError, OfferEntity>> {
        if (!params.id || !params.id.trim()) {
            return left(new AppError('Offer ID is required', '400', 'validation_error'));
        }
        return this.repository.getOfferById(params);
    }
}
