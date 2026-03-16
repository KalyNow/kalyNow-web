/**
 * Domain-level parameter types for the Offers feature
 */

export interface GetOffersFiltersParams {
    page?: number;
    limit?: number;
    search?: string;
    restaurantId?: string;
    activeOnly?: boolean;
}

export interface GetOfferByIdParams {
    id: string;
}

export interface CreateOfferParams {
    restaurantId: string;
    title: string;
    description?: string;
    price: number;
    discountedPrice?: number;
    availableFrom?: string;
    availableTo?: string;
    isActive?: boolean;
    quantity?: number;
}

export interface UpdateOfferParams {
    title?: string;
    description?: string;
    price?: number;
    discountedPrice?: number;
    availableFrom?: string;
    availableTo?: string;
    isActive?: boolean;
    quantity?: number;
}

export interface DeleteOfferParams {
    id: string;
}

export interface UploadOfferImageParams {
    id: string;
    file: File;
}
