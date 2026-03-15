import { Either, left, right } from '@sweet-monads/either';
import { AppError } from '../../../../core/types/AppError';
import { PaginatedArray } from '../../../../core/types/PaginatedArray';
import { IOffersDataSource } from '../datasources/OffersDataSource';
import { IOffersRepository } from '../../domain/repositories/IOffersRepository';
import { OfferEntity } from '../../domain/entities/OfferEntity';
import {
    GetOffersFiltersParams,
    GetOfferByIdParams,
    CreateOfferParams,
    UpdateOfferParams,
    UploadOfferImageParams,
} from '../../domain/types/OffersDomainTypes';
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

    async createOffer(data: CreateOfferParams): Promise<Either<AppError, OfferEntity>> {
        try {
            const tokenResult = await this.authService.getValidToken();
            if (tokenResult.isLeft()) return left(tokenResult.value);
            const offer = await this.dataSource.createOffer(tokenResult.value, data);
            return right(offer);
        } catch (error) {
            if (error instanceof AppError) return left(error);
            return left(new AppError('An error occurred', '000', error));
        }
    }

    async updateOffer(id: string, data: UpdateOfferParams): Promise<Either<AppError, OfferEntity>> {
        try {
            const tokenResult = await this.authService.getValidToken();
            if (tokenResult.isLeft()) return left(tokenResult.value);
            const offer = await this.dataSource.updateOffer(tokenResult.value, id, data);
            return right(offer);
        } catch (error) {
            if (error instanceof AppError) return left(error);
            return left(new AppError('An error occurred', '000', error));
        }
    }

    async deactivateOffer(id: string): Promise<Either<AppError, OfferEntity>> {
        try {
            const tokenResult = await this.authService.getValidToken();
            if (tokenResult.isLeft()) return left(tokenResult.value);
            const offer = await this.dataSource.deactivateOffer(tokenResult.value, id);
            return right(offer);
        } catch (error) {
            if (error instanceof AppError) return left(error);
            return left(new AppError('An error occurred', '000', error));
        }
    }

    async activateOffer(id: string): Promise<Either<AppError, OfferEntity>> {
        try {
            const tokenResult = await this.authService.getValidToken();
            if (tokenResult.isLeft()) return left(tokenResult.value);
            const offer = await this.dataSource.activateOffer(tokenResult.value, id);
            return right(offer);
        } catch (error) {
            if (error instanceof AppError) return left(error);
            return left(new AppError('An error occurred', '000', error));
        }
    }

    async uploadOfferImage(params: UploadOfferImageParams): Promise<Either<AppError, OfferEntity>> {
        try {
            const tokenResult = await this.authService.getValidToken();
            if (tokenResult.isLeft()) return left(tokenResult.value);
            const offer = await this.dataSource.uploadOfferImage(tokenResult.value, params);
            return right(offer);
        } catch (error) {
            if (error instanceof AppError) return left(error);
            return left(new AppError('An error occurred', '000', error));
        }
    }
}
