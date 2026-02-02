import type { FastifyInstance } from 'fastify'
import { listsController } from '../controllers/lists.controller.ts'
import { auth } from '../middlewares/auth.middleware.ts'

export async function listsRoutes(app: FastifyInstance) {
	// Register auth middleware - all routes in this file will require authentication
	app.register(auth)

	// GET /api/lists - Get all lists for authenticated user
	app.get('/', listsController.getAll)

	// POST /api/lists - Create a new list
	app.post('/', listsController.create)

	// PUT /api/lists/:listId - Update a list
	app.put('/:listId', listsController.update)

	// DELETE /api/lists/:listId - Delete a list
	app.delete('/:listId', listsController.delete)
}
