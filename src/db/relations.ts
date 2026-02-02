import { relations } from 'drizzle-orm/relations'
import { listItems, lists } from './schema.ts'

export const listItemsRelations = relations(listItems, ({ one }) => ({
	list: one(lists, {
		fields: [listItems.listId],
		references: [lists.id],
	}),
}))

export const listsRelations = relations(lists, ({ many }) => ({
	listItems: many(listItems),
}))
