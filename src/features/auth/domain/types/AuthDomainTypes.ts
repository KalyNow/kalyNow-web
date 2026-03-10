/**
 * Domain-level parameter types for the Auth feature
 */

export interface LoginParams {
    email: string;
    password: string;
}

export interface RegisterParams {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
