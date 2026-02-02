import { z } from 'zod'

const envSchema = z.object({
	CLERK_SECRET_KEY: z.string(),
	CLERK_PUBLISHABLE_KEY: z.string(),
	DATABASE_URL: z.url(),
})

export const env = envSchema.parse(process.env)
