import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';

// Extend the default statements with any custom permissions
const statement = {
	...defaultStatements,
	// Add any custom permissions here if needed
} as const;

const ac = createAccessControl(statement);

// Create the employee role with all admin permissions except role assignment
export const employee = ac.newRole({
	user: [
		'create',
		'list',
		'ban',
		'impersonate',
		'delete',
		'set-password',
		'update',
	],
	session: ['list', 'delete', 'revoke'],
	// Note: employee does NOT have "set-role" permission
});

// Create the user role with basic permissions
export const user = ac.newRole({
	// Basic user permissions - can be customized as needed
});

// Export the access control and roles
export { ac, adminAc as admin };
