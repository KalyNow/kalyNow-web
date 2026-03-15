import { z } from 'zod';
import { RestaurantEntity } from '../../domain/entities/RestaurantEntity';
import { AppError } from '../../../../core/types/AppError';

// Schéma correspondant à la réponse réelle de l'API offer-service (MongoDB)
const RestaurantApiSchema = z.object({
    id: z.string(),
    ownerId: z.string(),
    name: z.string().min(1),
    description: z.string().optional().default(''),
    address: z.string(),
    phone: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    logoUrl: z.string().nullable().optional(),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    isActive: z.boolean().optional().default(true),
    createdAt: z.string().datetime().or(z.date()),
    updatedAt: z.string().datetime().or(z.date()),
});

export type RestaurantApiType = z.infer<typeof RestaurantApiSchema>;

export class RestaurantModel {
    static fromJson(json: unknown): RestaurantEntity {
        try {
            const data = RestaurantApiSchema.parse(json);
            return new RestaurantEntity(
                data.id,
                data.ownerId,
                data.name,
                data.description,
                data.address,
                data.phone ?? null,
                data.email ?? null,
                data.logoUrl ?? null,
                data.latitude ?? null,
                data.longitude ?? null,
                data.isActive,
                new Date(data.createdAt as string),
                new Date(data.updatedAt as string)
            );
        } catch (error) {
            if (error instanceof z.ZodError) {
                const message = error.issues
                    .map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`)
                    .join(', ');
                throw new AppError(
                    `Invalid restaurant data: ${message}`,
                    'VALIDATION_ERROR',
                    { zodErrors: error.issues, receivedData: json }
                );
            }
            throw error;
        }
    }
}
