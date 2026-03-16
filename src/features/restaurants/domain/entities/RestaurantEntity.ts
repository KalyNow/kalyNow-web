export class RestaurantEntity {
    constructor(
        public id: string,
        public ownerId: string,
        public name: string,
        public description: string,
        public address: string,
        public phone: string | null,
        public email: string | null,
        public logoUrl: string | null, public latitude: number | null,
        public longitude: number | null, public isActive: boolean,
        public createdAt: Date,
        public updatedAt: Date
    ) { }

    /** Alias de commodité pour les composants UI */
    get isOpen(): boolean {
        return this.isActive;
    }
}
