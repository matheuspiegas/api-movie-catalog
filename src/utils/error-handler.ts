import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

// Custom error classes
export class AppError extends Error {
	constructor(
		public statusCode: number,
		message: string,
		public details?: unknown,
	) {
		super(message)
		this.name = 'AppError'
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = 'Unauthorized') {
		super(401, message)
		this.name = 'UnauthorizedError'
	}
}

export class NotFoundError extends AppError {
	constructor(message = 'Resource not found') {
		super(404, message)
		this.name = 'NotFoundError'
	}
}

export class ValidationError extends AppError {
	constructor(message = 'Validation failed', details?: unknown) {
		super(400, message, details)
		this.name = 'ValidationError'
	}
}

export class ForbiddenError extends AppError {
	constructor(message = 'Forbidden') {
		super(403, message)
		this.name = 'ForbiddenError'
	}
}

// Global error handler for Fastify
export const errorHandler = (
	error: FastifyError,
	_request: FastifyRequest,
	reply: FastifyReply,
) => {
	console.error('Error:', error)

	// Handle custom app errors
	if (error instanceof AppError) {
		return reply.code(error.statusCode).send({
			error: error.message,
			details: error.details,
		})
	}

	// Handle Zod validation errors
	if (error.validation) {
		return reply.code(400).send({
			error: 'Validation failed',
			details: error.validation,
		})
	}

	// Handle Fastify errors
	if (error.statusCode) {
		return reply.code(error.statusCode).send({
			error: error.message,
		})
	}

	// Default server error
	return reply.code(500).send({
		error: 'Internal server error',
	})
}
