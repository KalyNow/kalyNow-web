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
