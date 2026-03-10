/**
 * Domain-level parameter types for the Offers feature
 */

export interface GetOffersFiltersParams {
    page?: number;
    search?: string;
    restaurantId?: string;
    activeOnly?: boolean;
}

export interface GetOfferByIdParams {
    id: string;
}
