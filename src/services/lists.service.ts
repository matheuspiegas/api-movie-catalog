import { eq } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { lists } from '../db/schema.ts'
import type {
	CreateListInput,
	UpdateListInput,
} from '../schemas/lists.schema.ts'
import { ForbiddenError, NotFoundError } from '../utils/error-handler.ts'

export const listsService = {
	// Get all lists for a user
	async getAllByUser(userId: string) {
		const userLists = await db
			.select()
			.from(lists)
			.where(eq(lists.userId, userId))

		return userLists
	},

	// Create a new list
	async create(userId: string, data: CreateListInput) {
		const [newList] = await db
			.insert(lists)
			.values({
				name: data.name,
				description: data.description,
				userId,
			})
			.returning()

		return newList
	},

	// Update a list
	async update(listId: string, userId: string, data: UpdateListInput) {
		// First check if list exists and belongs to user
		const [existingList] = await db
			.select()
			.from(lists)
			.where(eq(lists.id, listId))

		if (!existingList) {
			throw new NotFoundError('List not found')
		}

		if (existingList.userId !== userId) {
			throw new ForbiddenError('You do not have permission to update this list')
		}

		// Update the list
		const [updatedList] = await db
			.update(lists)
			.set({
				...(data.name !== undefined && { name: data.name }),
				...(data.description !== undefined && {
					description: data.description,
				}),
				updatedAt: new Date().toISOString(),
			})
			.where(eq(lists.id, listId))
			.returning()

		return updatedList
	},

	// Delete a list
	async delete(listId: string, userId: string) {
		// First check if list exists and belongs to user
		const [existingList] = await db
			.select()
			.from(lists)
			.where(eq(lists.id, listId))

		if (!existingList) {
			throw new NotFoundError('List not found')
		}

		if (existingList.userId !== userId) {
			throw new ForbiddenError('You do not have permission to delete this list')
		}

		// Delete the list (cascade will delete items)
		await db.delete(lists).where(eq(lists.id, listId))

		return { success: true }
	},
}
