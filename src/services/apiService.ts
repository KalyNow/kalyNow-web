import { AxiosRequestConfig } from 'axios';
import AxiosService from '../core/services/axiosService';
import { AppError } from '../core/types/AppError';

/**
 * Base API service wrapping AxiosService for shared usage across features.
 * Provides convenience methods with consistent error handling.
 */
export class ApiService {
    private static instance: ApiService;
    private axiosService = AxiosService.getInstance();

    private constructor() {}

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    public async get<T = any>(url: string, token?: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosService.get<T>(url, {
                ...config,
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    ...config?.headers,
                },
            });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    public async post<T = any>(url: string, data?: any, token?: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosService.post<T>(url, data, {
                ...config,
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    ...config?.headers,
                },
            });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    public async put<T = any>(url: string, data?: any, token?: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosService.put<T>(url, data, {
                ...config,
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    ...config?.headers,
                },
            });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    public async delete<T = any>(url: string, token?: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosService.delete<T>(url, {
                ...config,
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    ...config?.headers,
                },
            });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    private handleError(error: any): AppError {
        if (error instanceof AppError) return error;
        if (error?.name === 'AxiosError') {
            return new AppError(
                error.response?.data?.message || error.message,
                String(error.response?.status || '000'),
                error.response?.data
            );
        }
        return new AppError('Unknown error', '000', error);
    }
}

export default ApiService;
