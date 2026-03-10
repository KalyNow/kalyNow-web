import { Either, left, right } from '@sweet-monads/either';
import { AppError } from '../../../../core/types/AppError';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { IOffersDataSource } from '../datasources/OffersDataSource';
import { IOffersRepository } from '../../domain/repositories/IOffersRepository';
import { OfferEntity } from '../../domain/entities/OfferEntity';
import { GetOffersFiltersParams, GetOfferByIdParams } from '../../domain/types/OffersDomainTypes';
import AuthService from '../../../../core/services/authService';

export class OffersRepository implements IOffersRepository {
    private dataSource: IOffersDataSource;
    private authService = AuthService.getInstance();

    constructor(dataSource: IOffersDataSource) {
        this.dataSource = dataSource;
    }

    async getOffers(filters: GetOffersFiltersParams): Promise<Either<AppError, PaginatedArray<OfferEntity>>> {
        try {
            const tokenResult = await this.authService.getValidToken();
            if (tokenResult.isLeft()) return left(tokenResult.value);

            const offers = await this.dataSource.getOffers(tokenResult.value, filters);
            return right(offers);
        } catch (error) {
            if (error instanceof AppError) return left(error);
            return left(new AppError('An error occurred', '000', error));
        }
    }

    async getOfferById(params: GetOfferByIdParams): Promise<Either<AppError, OfferEntity>> {
        try {
            const tokenResult = await this.authService.getValidToken();
            if (tokenResult.isLeft()) return left(tokenResult.value);

            const offer = await this.dataSource.getOfferById(tokenResult.value, params);
            return right(offer);
        } catch (error) {
            if (error instanceof AppError) return left(error);
            return left(new AppError('An error occurred', '000', error));
        }
    }
}
