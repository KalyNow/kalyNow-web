import { z } from 'zod';
import { OfferEntity, OfferStatus } from '../../domain/entities/OfferEntity';
import { AppError } from '../../../../core/types/AppError';

// Matches the real NestJS offer-service response shape
const OfferApiSchema = z.object({
    id: z.string(),
    restaurantId: z.string(),
    title: z.string().min(1),
    description: z.string().optional().default(''),
    price: z.number().nonnegative(),
    discountedPrice: z.number().nonnegative().nullable().optional(),
    availableFrom: z.string().datetime().nullable().optional(),
    availableTo: z.string().datetime().nullable().optional(),
    imageUrls: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
    quantity: z.number().nonnegative().nullable().optional(),
    status: z.nativeEnum(OfferStatus).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type OfferApiType = z.infer<typeof OfferApiSchema>;

export class OfferModel {
    static fromJson(json: unknown): OfferEntity {
        try {
            const data = OfferApiSchema.parse(json);
            return new OfferEntity(
                data.id,
                data.restaurantId,
                data.title,
                data.description,
                data.price,
                data.discountedPrice ?? null,
                data.availableFrom ? new Date(data.availableFrom) : null,
                data.availableTo ? new Date(data.availableTo) : null,
                data.imageUrls,
                data.isActive,
                data.quantity ?? null,
                new Date(data.createdAt),
                new Date(data.updatedAt),
                data.status ?? OfferStatus.ACTIVE
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
