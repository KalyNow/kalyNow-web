import { z } from 'zod';
import { OfferEntity } from '../../domain/entities/OfferEntity';
import { AppError } from '../../../../core/types/AppError';

const OfferApiSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1),
    description: z.string(),
    restaurant_id: z.string().uuid(),
    restaurant_name: z.string(),
    discount_percent: z.number().min(0).max(100).nullable().optional(),
    original_price: z.number().nonnegative().nullable().optional(),
    discounted_price: z.number().nonnegative().nullable().optional(),
    image_url: z.string().url().nullable().optional(),
    valid_from: z.string().datetime(),
    valid_until: z.string().datetime(),
    is_active: z.boolean(),
    created_at: z.string().datetime(),
});

export type OfferApiType = z.infer<typeof OfferApiSchema>;

export class OfferModel {
    static fromJson(json: unknown): OfferEntity {
        try {
            const data = OfferApiSchema.parse(json);
            return new OfferEntity(
                data.id,
                data.title,
                data.description,
                data.restaurant_id,
                data.restaurant_name,
                data.discount_percent ?? null,
                data.original_price ?? null,
                data.discounted_price ?? null,
                data.image_url ?? null,
                new Date(data.valid_from),
                new Date(data.valid_until),
                data.is_active,
                new Date(data.created_at)
            );
        } catch (error) {
            if (error instanceof z.ZodError) {
                const message = error.issues
                    .map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`)
                    .join(', ');
                throw new AppError(
                    `Invalid offer data: ${message}`,
                    'VALIDATION_ERROR',
                    { zodErrors: error.issues, receivedData: json }
                );
            }
            throw error;
        }
    }
}
