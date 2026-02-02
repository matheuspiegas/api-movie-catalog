import type { FastifyReply, FastifyRequest } from 'fastify'
import {
	createListSchema,
	listParamsSchema,
	updateListSchema,
} from '../schemas/lists.schema.ts'
import { listsService } from '../services/lists.service.ts'
import { ValidationError } from '../utils/error-handler.ts'

export const listsController = {
	// GET /api/lists - Get all lists for authenticated user
	async getAll(request: FastifyRequest, reply: FastifyReply) {
		const userId = await request.getCurrentUserId()

		const userLists = await listsService.getAllByUser(userId)

		return reply.code(200).send({ lists: userLists })
	},

	// POST /api/lists - Create a new list
	async create(request: FastifyRequest, reply: FastifyReply) {
		const userId = await request.getCurrentUserId()

		// Validate request body
		const validationResult = createListSchema.safeParse(request.body)
		if (!validationResult.success) {
			throw new ValidationError(
				'Invalid request body',
				validationResult.error.issues,
			)
		}

		const newList = await listsService.create(userId, validationResult.data)

		return reply.code(201).send({ list: newList })
	},

	// PUT /api/lists/:listId - Update a list
	async update(request: FastifyRequest, reply: FastifyReply) {
		const userId = await request.getCurrentUserId()

		// Validate params
		const paramsResult = listParamsSchema.safeParse(request.params)
		if (!paramsResult.success) {
			throw new ValidationError('Invalid list ID', paramsResult.error.issues)
		}

		// Validate body
		const bodyResult = updateListSchema.safeParse(request.body)
		if (!bodyResult.success) {
			throw new ValidationError('Invalid request body', bodyResult.error.issues)
		}

		const updatedList = await listsService.update(
			paramsResult.data.listId,
			userId,
			bodyResult.data,
		)

		return reply.code(200).send({ list: updatedList })
	},

	// DELETE /api/lists/:listId - Delete a list
	async delete(request: FastifyRequest, reply: FastifyReply) {
		const userId = await request.getCurrentUserId()

		// Validate params
		const paramsResult = listParamsSchema.safeParse(request.params)
		if (!paramsResult.success) {
			throw new ValidationError('Invalid list ID', paramsResult.error.issues)
		}

		await listsService.delete(paramsResult.data.listId, userId)

		return reply.code(200).send({ message: 'List deleted successfully' })
	},
}
