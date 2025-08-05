import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import {
	website,
	leads,
	websiteRelations,
	leadsRelations,
	users,
	accounts,
	sessions,
	verifications,
} from './schema';
import { eq } from 'drizzle-orm';

// Create PostgreSQL connection pool
const pool = new Pool({
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT || '5432'),
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

export const db = drizzle(pool, {
	schema: {
		website,
		leads,
		websiteRelations,
		leadsRelations,
		users,
		accounts,
		sessions,
		verifications,
	},
});

// Utility functions
export async function getLeads() {
	return await db
		.select({
			id: leads.id,
			name: leads.name,
			email: leads.email,
			phone: leads.phone,
			jobTitle: leads.jobTitle,
			location: leads.location,
			company: leads.company,
			description: leads.description,
			contactLink: leads.contactLink,
			websiteId: leads.websiteId,
			websiteUrl: website.url,
			websiteDescription: website.description,
		})
		.from(leads)
		.leftJoin(website, eq(leads.websiteId, website.id));
}

export async function getLeadById(id: number) {
	const result = await db
		.select({
			id: leads.id,
			name: leads.name,
			email: leads.email,
			phone: leads.phone,
			jobTitle: leads.jobTitle,
			location: leads.location,
			company: leads.company,
			description: leads.description,
			contactLink: leads.contactLink,
			websiteId: leads.websiteId,
			websiteUrl: website.url,
			websiteDescription: website.description,
		})
		.from(leads)
		.leftJoin(website, eq(leads.websiteId, website.id))
		.where(eq(leads.id, id));
	return result[0] || null;
}

export async function getWebsites() {
	return await db.select().from(website);
}
