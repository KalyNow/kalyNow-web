import { Either } from '@sweet-monads/either';
import { AppError } from '../../../../core/types/AppError';
import { AuthTokens } from '../../../../core/types/AuthTypes';
import { AuthUserEntity } from '../entities/AuthUserEntity';
import { LoginParams, RegisterParams } from '../types/AuthDomainTypes';

export interface IAuthRepository {
    login(params: LoginParams): Promise<Either<AppError, AuthTokens>>;
    register(params: RegisterParams): Promise<Either<AppError, AuthUserEntity>>;
    logout(): Promise<Either<AppError, boolean>>;
}
