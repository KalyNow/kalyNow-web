export class RestaurantEntity {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public address: string,
        public city: string,
        public phone: string | null,
        public email: string | null,
        public cuisine: string,
        public rating: number,
        public imageUrl: string | null,
        public isOpen: boolean,
        public createdAt: Date
    ) {}
}
