import { z } from 'zod'

// Schema for creating a new list
export const createListSchema = z.object({
	name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
	description: z.string().max(1000, 'Description is too long').optional(),
})

// Schema for updating a list
export const updateListSchema = z
	.object({
		name: z
			.string()
			.min(1, 'Name is required')
			.max(255, 'Name is too long')
			.optional(),
		description: z.string().max(1000, 'Description is too long').optional(),
	})
	.refine((data) => data.name !== undefined || data.description !== undefined, {
		message: 'At least one field (name or description) must be provided',
	})

// Schema for list ID in URL params
export const listParamsSchema = z.object({
	listId: z.string().uuid('Invalid list ID format'),
})

// Type exports
export type CreateListInput = z.infer<typeof createListSchema>
export type UpdateListInput = z.infer<typeof updateListSchema>
export type ListParams = z.infer<typeof listParamsSchema>
