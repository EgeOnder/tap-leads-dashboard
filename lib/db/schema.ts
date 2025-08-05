import {
	pgTable,
	serial,
	text,
	integer,
	timestamp,
	boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified')
		.$defaultFn(() => false)
		.notNull(),
	image: text('image'),
	role: text('role').$defaultFn(() => 'user'),
	banned: boolean('banned').$defaultFn(() => false),
	banReason: text('ban_reason'),
	banExpires: timestamp('ban_expires'),
	createdAt: timestamp('created_at')
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp('updated_at')
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	impersonatedBy: text('impersonated_by'),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
});

export const accounts = pgTable('accounts', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
});

export const verifications = pgTable('verifications', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').$defaultFn(
		() => /* @__PURE__ */ new Date()
	),
	updatedAt: timestamp('updated_at').$defaultFn(
		() => /* @__PURE__ */ new Date()
	),
});

// Tags table - global tags that can be used by all users
export const tags = pgTable('tags', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	color: text('color').$defaultFn(() => '#3b82f6'), // Default blue color
	description: text('description'),
	createdBy: text('created_by')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at')
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp('updated_at')
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

// Existing tables
export const website = pgTable('website', {
	id: serial('id').primaryKey(),
	url: text('url').notNull().unique(),
	description: text('description'),
	lastScrapedAt: timestamp('last_scraped_at', {
		withTimezone: true,
		mode: 'date',
	}),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
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
	assignedTo: text('assigned_to').references(() => users.id, {
		onDelete: 'set null',
	}),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Junction table for lead-tag relationships (many-to-many)
export const leadTags = pgTable('lead_tags', {
	id: serial('id').primaryKey(),
	leadId: integer('lead_id')
		.notNull()
		.references(() => leads.id, { onDelete: 'cascade' }),
	tagId: integer('tag_id')
		.notNull()
		.references(() => tags.id, { onDelete: 'cascade' }),
	createdBy: text('created_by')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at')
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	accounts: many(accounts),
	createdTags: many(tags, { relationName: 'tagCreator' }),
	assignedLeads: many(leads, { relationName: 'leadAssignee' }),
	createdLeads: many(leads, { relationName: 'leadCreator' }),
	leadTagAssignments: many(leadTags),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
	creator: one(users, {
		fields: [tags.createdBy],
		references: [users.id],
		relationName: 'tagCreator',
	}),
	leadTags: many(leadTags),
}));

export const websiteRelations = relations(website, ({ many }) => ({
	leads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
	website: one(website, {
		fields: [leads.websiteId],
		references: [website.id],
	}),
	assignedTo: one(users, {
		fields: [leads.assignedTo],
		references: [users.id],
		relationName: 'leadAssignee',
	}),
	leadTags: many(leadTags),
}));

export const leadTagsRelations = relations(leadTags, ({ one }) => ({
	lead: one(leads, {
		fields: [leadTags.leadId],
		references: [leads.id],
	}),
	tag: one(tags, {
		fields: [leadTags.tagId],
		references: [tags.id],
	}),
	createdBy: one(users, {
		fields: [leadTags.createdBy],
		references: [users.id],
	}),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type VerificationToken = typeof verifications.$inferSelect;
export type NewVerificationToken = typeof verifications.$inferInsert;
export type Website = typeof website.$inferSelect;
export type NewWebsite = typeof website.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type LeadTag = typeof leadTags.$inferSelect;
export type NewLeadTag = typeof leadTags.$inferInsert;
