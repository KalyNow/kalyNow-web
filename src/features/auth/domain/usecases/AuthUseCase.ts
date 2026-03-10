import { Either, left } from '@sweet-monads/either';
import { AppError } from '../../../../core/types/AppError';
import { AuthTokens } from '../../../../core/types/AuthTypes';
import { IAuthRepository } from '../repositories/IAuthRepository';
import { IAuthUseCase } from './IAuthUseCase';
import { AuthUserEntity } from '../entities/AuthUserEntity';
import { LoginParams, RegisterParams } from '../types/AuthDomainTypes';

export class AuthUseCase implements IAuthUseCase {
    private repository: IAuthRepository;

    constructor(repository: IAuthRepository) {
        this.repository = repository;
    }

    async login(params: LoginParams): Promise<Either<AppError, AuthTokens>> {
        const emailError = this.validateEmail(params.email);
        if (emailError) return left(emailError);
        const passwordError = this.validatePassword(params.password);
        if (passwordError) return left(passwordError);
        return this.repository.login(params);
    }

    async register(params: RegisterParams): Promise<Either<AppError, AuthUserEntity>> {
        if (!params.firstName || !params.firstName.trim()) {
            return left(new AppError('First name is required', '400', 'validation_error'));
        }
        if (!params.lastName || !params.lastName.trim()) {
            return left(new AppError('Last name is required', '400', 'validation_error'));
        }
        const emailError = this.validateEmail(params.email);
        if (emailError) return left(emailError);
        const passwordError = this.validatePassword(params.password);
        if (passwordError) return left(passwordError);
        return this.repository.register(params);
    }

    async logout(): Promise<Either<AppError, boolean>> {
        return this.repository.logout();
    }

    private validateEmail(email: string): AppError | null {
        if (!email || !email.trim()) {
            return new AppError('Email is required', '400', 'validation_error');
        }
        return null;
    }

    private validatePassword(password: string): AppError | null {
        if (!password || password.length < 6) {
            return new AppError('Password must be at least 6 characters', '400', 'validation_error');
        }
        return null;
    }
}
