import type { FastifyReply, FastifyRequest } from 'fastify'
import {
	createListItemSchema,
	listIdParamsSchema,
	listItemParamsSchema,
} from '../schemas/list-items.schema.ts'
import { listItemsService } from '../services/list-items.service.ts'
import { ValidationError } from '../utils/error-handler.ts'

export const listItemsController = {
	// GET /api/lists/:listId/items - Get all items in a list
	async getAll(request: FastifyRequest, reply: FastifyReply) {
		const userId = await request.getCurrentUserId()

		// Validate params
		const paramsResult = listIdParamsSchema.safeParse(request.params)
		if (!paramsResult.success) {
			throw new ValidationError('Invalid list ID', paramsResult.error.issues)
		}

		const items = await listItemsService.getAllByList(
			paramsResult.data.listId,
			userId,
		)

		return reply.code(200).send({ items })
	},

	// POST /api/lists/:listId/items - Add an item to a list
	async create(request: FastifyRequest, reply: FastifyReply) {
		const userId = await request.getCurrentUserId()

		// Validate params
		const paramsResult = listIdParamsSchema.safeParse(request.params)
		if (!paramsResult.success) {
			throw new ValidationError('Invalid list ID', paramsResult.error.issues)
		}

		// Validate body
		const bodyResult = createListItemSchema.safeParse(request.body)
		if (!bodyResult.success) {
			throw new ValidationError('Invalid request body', bodyResult.error.issues)
		}

		const newItem = await listItemsService.create(
			paramsResult.data.listId,
			userId,
			bodyResult.data,
		)

		return reply.code(201).send({ item: newItem })
	},

	// DELETE /api/lists/:listId/items/:itemId - Delete an item from a list
	async delete(request: FastifyRequest, reply: FastifyReply) {
		const userId = await request.getCurrentUserId()

		// Validate params
		const paramsResult = listItemParamsSchema.safeParse(request.params)
		if (!paramsResult.success) {
			throw new ValidationError('Invalid parameters', paramsResult.error.issues)
		}

		await listItemsService.delete(
			paramsResult.data.listId,
			paramsResult.data.itemId,
			userId,
		)

		return reply.code(204).send()
	},
}
