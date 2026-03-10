/**
 * Shared types used across multiple features
 */

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        itemsPerPage: number;
    };
}

export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface GeoLocation {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    country: string;
}

export interface MediaItem {
    id: string;
    url: string;
    type: 'image' | 'video';
    alt?: string;
}
