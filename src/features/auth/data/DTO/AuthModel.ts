import { z } from 'zod';
import { AuthUserEntity } from '../../domain/entities/AuthUserEntity';
import { AppError } from '../../../../core/types/AppError';

const AuthUserApiSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    role: z.string(),
    created_at: z.string().datetime(),
});

export type AuthUserApiType = z.infer<typeof AuthUserApiSchema>;

export class AuthModel {
    static fromJson(json: unknown): AuthUserEntity {
        try {
            const data = AuthUserApiSchema.parse(json);
            return new AuthUserEntity(
                data.id,
                data.email,
                data.first_name,
                data.last_name,
                data.role,
                new Date(data.created_at)
            );
        } catch (error) {
            if (error instanceof z.ZodError) {
                const message = error.issues
                    .map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`)
                    .join(', ');
                throw new AppError(
                    `Invalid auth user data: ${message}`,
                    'VALIDATION_ERROR',
                    { zodErrors: error.issues, receivedData: json }
                );
            }
            throw error;
        }
    }
}
