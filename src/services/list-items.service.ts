import { and, eq } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { listItems, lists } from '../db/schema.ts'
import type { CreateListItemInput } from '../schemas/list-items.schema.ts'
import { ForbiddenError, NotFoundError } from '../utils/error-handler.ts'

export const listItemsService = {
	// Get all items in a list
	async getAllByList(listId: string, userId: string) {
		// First verify the list exists and belongs to the user
		const [list] = await db.select().from(lists).where(eq(lists.id, listId))

		if (!list) {
			throw new NotFoundError('List not found')
		}

		if (list.userId !== userId) {
			throw new ForbiddenError('You do not have permission to access this list')
		}

		// Get all items from the list
		const items = await db
			.select()
			.from(listItems)
			.where(eq(listItems.listId, listId))

		return items
	},

	// Add an item to a list
	async create(listId: string, userId: string, data: CreateListItemInput) {
		// First verify the list exists and belongs to the user
		const [list] = await db.select().from(lists).where(eq(lists.id, listId))

		if (!list) {
			throw new NotFoundError('List not found')
		}

		if (list.userId !== userId) {
			throw new ForbiddenError(
				'You do not have permission to add items to this list',
			)
		}

		// Create the list item
		const [newItem] = await db
			.insert(listItems)
			.values({
				listId,
				movieId: data.movieId,
				movieTitle: data.movieTitle,
				moviePosterPath: data.moviePosterPath,
				movieReleaseDate: data.movieReleaseDate,
				movieVoteAverage: data.movieVoteAverage,
				mediaType: data.mediaType,
			})
			.returning()

		return newItem
	},

	// Delete an item from a list
	async delete(listId: string, itemId: string, userId: string) {
		// First verify the list exists and belongs to the user
		const [list] = await db.select().from(lists).where(eq(lists.id, listId))

		if (!list) {
			throw new NotFoundError('List not found')
		}

		if (list.userId !== userId) {
			throw new ForbiddenError(
				'You do not have permission to delete items from this list',
			)
		}

		// Check if the item exists in this list
		const [item] = await db
			.select()
			.from(listItems)
			.where(and(eq(listItems.id, itemId), eq(listItems.listId, listId)))

		if (!item) {
			throw new NotFoundError('Item not found in this list')
		}

		// Delete the item
		await db.delete(listItems).where(eq(listItems.id, itemId))

		return { success: true }
	},
}
