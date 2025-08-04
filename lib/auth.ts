import bcrypt from 'bcryptjs';

// Get admin password from environment variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Hash the admin password for comparison
const HASHED_ADMIN_PASSWORD = bcrypt.hashSync(ADMIN_PASSWORD, 10);

export function verifyPassword(password: string): boolean {
	return bcrypt.compareSync(password, HASHED_ADMIN_PASSWORD);
}

export function hashPassword(password: string): string {
	return bcrypt.hashSync(password, 10);
}

export function generateSessionToken(): string {
	return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
