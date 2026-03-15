/**
 * Domain-level parameter types for the Restaurants feature
 */

export interface GetRestaurantsFiltersParams {
    page?: number;
    search?: string;
    cuisine?: string;
    city?: string;
}

export interface GetRestaurantByIdParams {
    id: string;
}

export interface CreateRestaurantParams {
    name: string;
    description?: string;
    address: string;
    phone?: string;
    email?: string;
    logoUrl?: string;
    latitude?: number;
    longitude?: number;
    isActive?: boolean;
}
