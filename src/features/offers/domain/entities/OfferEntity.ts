export class OfferEntity {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public restaurantId: string,
        public restaurantName: string,
        public discountPercent: number | null,
        public originalPrice: number | null,
        public discountedPrice: number | null,
        public imageUrl: string | null,
        public validFrom: Date,
        public validUntil: Date,
        public isActive: boolean,
        public createdAt: Date
    ) {}

    get isExpired(): boolean {
        return new Date() > this.validUntil;
    }
}
