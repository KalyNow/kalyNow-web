import { Either, left, right } from '@sweet-monads/either';
import { AppError } from '../../../../core/types/AppError';
import { AuthTokens } from '../../../../core/types/AuthTypes';
import { IAuthDataSource } from '../datasources/AuthDataSource';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { AuthUserEntity } from '../../domain/entities/AuthUserEntity';
import { LoginParams, RegisterParams } from '../../domain/types/AuthDomainTypes';
import AuthService from '../../../../core/services/authService';
import TokenService from '../../../../core/services/tokenService';

export class AuthRepository implements IAuthRepository {
    private dataSource: IAuthDataSource;
    private authService = AuthService.getInstance();
    private tokenService = TokenService.getInstance();

    constructor(dataSource: IAuthDataSource) {
        this.dataSource = dataSource;
    }

    async login(params: LoginParams): Promise<Either<AppError, AuthTokens>> {
        try {
            const tokens = await this.dataSource.login(params);
            this.tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
            return right(tokens);
        } catch (error) {
            if (error instanceof AppError) return left(error);
            return left(new AppError('Login failed', '500', error));
        }
    }

    async register(params: RegisterParams): Promise<Either<AppError, AuthUserEntity>> {
        try {
            const user = await this.dataSource.register(params);
            return right(user);
        } catch (error) {
            if (error instanceof AppError) return left(error);
            return left(new AppError('Registration failed', '500', error));
        }
    }

    async logout(): Promise<Either<AppError, boolean>> {
        try {
            await this.dataSource.logout();
            this.authService.logout();
            return right(true);
        } catch (error) {
            if (error instanceof AppError) return left(error);
            return left(new AppError('Logout failed', '500', error));
        }
    }
}
