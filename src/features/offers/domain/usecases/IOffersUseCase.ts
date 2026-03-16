import { Either } from '@sweet-monads/either';
import { AppError } from '../../../../core/types/AppError';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { OfferEntity } from '../entities/OfferEntity';
import {
    GetOffersFiltersParams,
    GetOfferByIdParams,
    CreateOfferParams,
    UpdateOfferParams,
    UploadOfferImageParams,
} from '../types/OffersDomainTypes';

export interface IOffersUseCase {
    getOffers(filters: GetOffersFiltersParams): Promise<Either<AppError, PaginatedArray<OfferEntity>>>;
    getOfferById(params: GetOfferByIdParams): Promise<Either<AppError, OfferEntity>>;
    createOffer(data: CreateOfferParams): Promise<Either<AppError, OfferEntity>>;
    updateOffer(id: string, data: UpdateOfferParams): Promise<Either<AppError, OfferEntity>>;
    deactivateOffer(id: string): Promise<Either<AppError, OfferEntity>>;
    activateOffer(id: string): Promise<Either<AppError, OfferEntity>>;
    uploadOfferImage(params: UploadOfferImageParams): Promise<Either<AppError, OfferEntity>>;
}
