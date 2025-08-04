import type { Config } from 'drizzle-kit';

export default {
	schema: './lib/db/schema.ts',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		connectionString: `postgresql://${process.env.DB_USERNAME}:${
			process.env.DB_PASSWORD
		}@${process.env.DB_HOST}:${process.env.DB_PORT || '5432'}/${
			process.env.DB_NAME
		}`,
	},
};
