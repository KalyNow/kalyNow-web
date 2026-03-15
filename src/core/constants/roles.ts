/**
 * Constantes des rôles utilisateur.
 * Toujours utiliser ces constantes au lieu de strings littérales
 * pour les comparaisons de rôle dans les guards, redirections et composants.
 *
 * ✅ BON : user.role === USER_ROLES.SELLER
 * ❌ MAUVAIS : user.role === 'SELLER'
 */
export const USER_ROLES = {
    SELLER: 'SELLER',
    BUYER: 'BUYER',
    ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
