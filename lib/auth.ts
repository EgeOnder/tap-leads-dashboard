import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin as adminPlugin } from 'better-auth/plugins';
import { db } from './db';

export const auth = betterAuth({
	trustedOrigins: [
		'http://localhost:8080',
		'https://j4m8r2x6w1v9z5q3t7n.direct-search.org',
	],
	database: drizzleAdapter(db, {
		provider: 'pg',
		usePlural: true,
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
	},
	cookies: {
		sessionToken: {
			name: 'auth-session-token',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7, // 7 days
		},
	},
	pages: {
		signIn: '/auth/signin',
		signUp: '/auth/signup',
	},
	plugins: [adminPlugin()],
});
