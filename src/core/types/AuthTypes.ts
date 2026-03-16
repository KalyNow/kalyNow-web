/**
 * Types pour la gestion des tokens JWT
 */

export interface TokenPayload {
    exp: number;          // Expiration timestamp
    iat: number;          // Issued at timestamp
    sub: string;          // ID de l'utilisateur (JWT standard claim)
    role: string;         // Rôle de l'utilisateur
    email: string;        // Email de l'utilisateur
    verified?: boolean;   // Statut de vérification
    iss?: string;         // Issuer (ex: kalynow-user-service)
    permissions?: string[]; // Permissions optionnelles
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface TokenValidationResult {
    isValid: boolean;
    isExpired: boolean;
    payload: TokenPayload | null;
    error?: string;
}