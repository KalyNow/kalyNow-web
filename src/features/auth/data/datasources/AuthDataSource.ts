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

    async login(params: LoginParams): Promise<AuthTokens> {
        try {
            const response = await this.axiosService.post('/api/auth/login', {
                email: params.email.trim().toLowerCase(),
                password: params.password,
            });

            if (!response.data?.accessToken || !response.data?.refreshToken) {
                throw new AppError('Invalid login response', '400', 'invalid_auth_response');
            }

            return {
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
            };
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            if (error?.name === 'AxiosError') {
                throw new AppError(
                    error.response?.data?.message || 'Login failed',
                    String(error.response?.status || '500'),
                    error.response?.data
                );
            }
            throw new AppError('Login failed', '500', error);
        }
    }

    async register(params: RegisterParams): Promise<AuthUserEntity> {
        try {
            const response = await this.axiosService.post('/api/auth/register', {
                email: params.email.trim().toLowerCase(),
                password: params.password,
                first_name: params.firstName,
                last_name: params.lastName,
            });

            if (!response.data) {
                throw new AppError('Empty register response', '400', 'empty_response');
            }

            return AuthModel.fromJson(response.data);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            if (error?.name === 'AxiosError') {
                throw new AppError(
                    error.response?.data?.message || 'Registration failed',
                    String(error.response?.status || '500'),
                    error.response?.data
                );
            }
            throw new AppError('Registration failed', '500', error);
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
