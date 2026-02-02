import { z } from 'zod'

// Schema for creating a new list item
export const createListItemSchema = z.object({
	movieId: z.number().int().positive('Movie ID must be a positive integer'),
	movieTitle: z
		.string()
		.min(1, 'Movie title is required')
		.max(500, 'Movie title is too long'),
	moviePosterPath: z.string().max(500, 'Poster path is too long').optional(),
	movieReleaseDate: z.string().max(50, 'Release date is too long').optional(),
	movieVoteAverage: z.string().max(10, 'Vote average is too long').optional(),
	mediaType: z
		.string()
		.min(1, 'Media type is required')
		.max(50, 'Media type is too long'),
})

// Schema for list ID and item ID in URL params
export const listItemParamsSchema = z.object({
	listId: z.string().uuid('Invalid list ID format'),
	itemId: z.string().uuid('Invalid item ID format'),
})

// Schema for only list ID in URL params
export const listIdParamsSchema = z.object({
	listId: z.string().uuid('Invalid list ID format'),
})

// Type exports
export type CreateListItemInput = z.infer<typeof createListItemSchema>
export type ListItemParams = z.infer<typeof listItemParamsSchema>
export type ListIdParams = z.infer<typeof listIdParamsSchema>
