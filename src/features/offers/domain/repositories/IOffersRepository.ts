import { Either } from '@sweet-monads/either';
import { AppError } from '../../../../core/types/AppError';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { OfferEntity } from '../entities/OfferEntity';
import { GetOffersFiltersParams, GetOfferByIdParams } from '../types/OffersDomainTypes';

export interface IOffersRepository {
    getOffers(filters: GetOffersFiltersParams): Promise<Either<AppError, PaginatedArray<OfferEntity>>>;
    getOfferById(params: GetOfferByIdParams): Promise<Either<AppError, OfferEntity>>;
}
