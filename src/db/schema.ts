import {
	foreignKey,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core'

export const lists = pgTable('lists', {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
	userId: text('user_id').notNull(),
})

export const listItems = pgTable(
	'list_items',
	{
		id: uuid().defaultRandom().primaryKey().notNull(),
		listId: uuid('list_id').notNull(),
		movieId: integer('movie_id').notNull(),
		movieTitle: text('movie_title').notNull(),
		moviePosterPath: text('movie_poster_path'),
		movieReleaseDate: text('movie_release_date'),
		movieVoteAverage: text('movie_vote_average'),
		mediaType: text('media_type').notNull(),
		addedAt: timestamp('added_at', { mode: 'string' }).defaultNow().notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.listId],
			foreignColumns: [lists.id],
			name: 'list_items_list_id_lists_id_fk',
		}).onDelete('cascade'),
	],
)
