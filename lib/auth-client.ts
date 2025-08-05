import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

export const authClient = createAuthClient({
	emailAndPassword: {
		disableSignUp: isProduction,
	},
	plugins: [adminClient()],
});
