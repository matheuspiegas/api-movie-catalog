import type { FastifyInstance } from 'fastify'
import { listItemsController } from '../controllers/list-items.controller.ts'
import { auth } from '../middlewares/auth.middleware.ts'

export async function listItemsRoutes(app: FastifyInstance) {
	// Register auth middleware - all routes in this file will require authentication
	app.register(auth)

	// GET /api/lists/:listId/items - Get all items in a list
	app.get('/', listItemsController.getAll)

	// POST /api/lists/:listId/items - Add an item to a list
	app.post('/', listItemsController.create)

	// DELETE /api/lists/:listId/items/:itemId - Delete an item from a list
	app.delete('/:itemId', listItemsController.delete)
}
