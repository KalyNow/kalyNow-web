import { z } from 'zod';
import { RestaurantEntity } from '../../domain/entities/RestaurantEntity';
import { AppError } from '../../../../core/types/AppError';

const RestaurantApiSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    description: z.string(),
    address: z.string(),
    city: z.string(),
    phone: z.string().nullable().optional(),
    email: z.string().email().nullable().optional(),
    cuisine: z.string(),
    rating: z.number().min(0).max(5),
    image_url: z.string().url().nullable().optional(),
    is_open: z.boolean(),
    created_at: z.string().datetime(),
});

export type RestaurantApiType = z.infer<typeof RestaurantApiSchema>;

export class RestaurantModel {
    static fromJson(json: unknown): RestaurantEntity {
        try {
            const data = RestaurantApiSchema.parse(json);
            return new RestaurantEntity(
                data.id,
                data.name,
                data.description,
                data.address,
                data.city,
                data.phone ?? null,
                data.email ?? null,
                data.cuisine,
                data.rating,
                data.image_url ?? null,
                data.is_open,
                new Date(data.created_at)
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
