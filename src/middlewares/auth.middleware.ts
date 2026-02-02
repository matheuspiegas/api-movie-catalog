import { getAuth } from '@clerk/fastify'
import type { FastifyInstance, FastifyRequest } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { UnauthorizedError } from '../utils/error-handler.ts'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
	app.addHook('preHandler', async (req: FastifyRequest) => {
		req.getCurrentUserId = async () => {
			const { userId } = await getAuth(req)

			if (!userId) {
				throw new UnauthorizedError('Authentication required')
			}

			return userId
		}
	})
})
