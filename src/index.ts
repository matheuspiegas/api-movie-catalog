import { clerkPlugin } from '@clerk/fastify'
import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import { listItemsRoutes } from './routes/list-items.routes.ts'
import { listsRoutes } from './routes/lists.routes.ts'
import { errorHandler } from './utils/error-handler.ts'

export async function buildApp() {
	const app = fastify()

	// Register Clerk authentication FIRST (must be before any route that uses getAuth)
	await app.register(clerkPlugin)

	// Register CORS
	await app.register(fastifyCors, {
		origin: [
			'http://localhost:5173',
			'https://moviecatalog.com.br',
			'https://www.moviecatalog.com.br',
		],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})

	// Set custom error handler
	app.setErrorHandler(errorHandler)

	// Register all routes
	app.register(listsRoutes, { prefix: '/api/lists' })
	app.register(listItemsRoutes, { prefix: '/api/lists/:listId/items' })
	// Wait for all plugins to be ready
	await app.ready()

	return app
}
