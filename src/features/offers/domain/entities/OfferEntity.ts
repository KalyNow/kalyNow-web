export enum OfferStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    INACTIVE = 'INACTIVE',
}

export class OfferEntity {
    constructor(
        public id: string,
        public restaurantId: string,
        public title: string,
        public description: string,
        public price: number,
        public discountedPrice: number | null,
        public availableFrom: Date | null,
        public availableTo: Date | null,
        public imageUrls: string[],
        public isActive: boolean,
        public quantity: number | null,
        public createdAt: Date,
        public updatedAt: Date,
        /** Champ calculé renvoyé par l'API */
        public status: OfferStatus = OfferStatus.ACTIVE
    ) { }

    get isExpired(): boolean {
        if (!this.availableTo) return false;
        return new Date() > this.availableTo;
    }

    get effectivePrice(): number {
        return this.discountedPrice ?? this.price;
    }
}
