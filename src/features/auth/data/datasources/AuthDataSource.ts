import AxiosService from '../../../../core/services/axiosService';
import { AppError } from '../../../../core/types/AppError';
import { AuthTokens } from '../../../../core/types/AuthTypes';
import { AuthUserEntity } from '../../domain/entities/AuthUserEntity';
import { LoginParams, RegisterParams } from '../../domain/types/AuthDomainTypes';
import { AuthModel } from '../DTO/AuthModel';

export interface IAuthDataSource {
    login(params: LoginParams): Promise<AuthTokens>;
    register(params: RegisterParams): Promise<AuthUserEntity>;
    logout(): Promise<boolean>;
}

export class AuthDataSource implements IAuthDataSource {
    private axiosService = AxiosService.getInstance();

    private normalizeEmail(email: string): string {
        return email.trim().toLowerCase();
    }

    private handleAxiosError(error: unknown, defaultMessage: string): never {
        if (error instanceof AppError) throw error;
        const axiosError = error as Record<string, any>;
        if (axiosError?.name === 'AxiosError') {
            throw new AppError(
                axiosError.response?.data?.message || defaultMessage,
                String(axiosError.response?.status || '500'),
                axiosError.response?.data
            );
        }
        throw new AppError(defaultMessage, '500', error);
    }

    async login(params: LoginParams): Promise<AuthTokens> {
        try {
            const response = await this.axiosService.post('/api/us/auth/login', {
                email: this.normalizeEmail(params.email),
                password: params.password,
            });

            if (!response.data?.accessToken || !response.data?.refreshToken) {
                throw new AppError('Réponse de connexion invalide', '400', 'invalid_auth_response');
            }

            return {
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
            };
        } catch (error) {
            this.handleAxiosError(error, 'Échec de la connexion');
        }
    }

    async register(params: RegisterParams): Promise<AuthUserEntity> {
        try {
            const response = await this.axiosService.post('/api/us/auth/register', {
                email: this.normalizeEmail(params.email),
                password: params.password,
                first_name: params.firstName,
                last_name: params.lastName,
            });

            if (!response.data) {
                throw new AppError('Empty register response', '400', 'empty_response');
            }

            return AuthModel.fromJson(response.data);
        } catch (error) {
            this.handleAxiosError(error, 'Registration failed');
        }
    }

    async logout(): Promise<boolean> {
        try {
            await this.axiosService.post('/api/auth/logout', {});
            return true;
        } catch {
            return true;
        }
    }
}
