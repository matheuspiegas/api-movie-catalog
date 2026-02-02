import type { FastifyInstance } from 'fastify'
import { listItemsRoutes } from './list-items.routes.ts'
import { listsRoutes } from './lists.routes.ts'

export async function registerRoutes(app: FastifyInstance) {
	// Register lists routes: /api/lists
	await app.register(listsRoutes, { prefix: '/api/lists' })

	// Register list items routes: /api/lists/:listId/items
	await app.register(listItemsRoutes, { prefix: '/api/lists/:listId/items' })
}
