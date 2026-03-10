export class AuthUserEntity {
    constructor(
        public id: string,
        public email: string,
        public firstName: string,
        public lastName: string,
        public role: string,
        public createdAt: Date
    ) {}

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}
