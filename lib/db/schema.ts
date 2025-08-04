import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const website = pgTable('website', {
  id: serial('id').primaryKey(),
  url: text('url').notNull().unique(),
  description: text('description'),
  lastScrapedAt: timestamp('last_scraped_at', { withTimezone: true, mode: 'date' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email'),
  phone: text('phone'),
  jobTitle: text('job_title'),
  location: text('location'),
  company: text('company'),
  description: text('description'),
  contactLink: text('contact_link'),
  websiteId: integer('website_id')
    .notNull()
    .references(() => website.id, { onDelete: 'cascade' }),
});

// Relations
export const websiteRelations = relations(website, ({ many }) => ({
  leads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  website: one(website, {
    fields: [leads.websiteId],
    references: [website.id],
  }),
}));

export type Website = typeof website.$inferSelect;
export type NewWebsite = typeof website.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;