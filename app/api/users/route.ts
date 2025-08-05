import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/users - Get all users
export async function GET() {
	try {
		const allUsers = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				role: users.role,
				createdAt: users.createdAt,
			})
			.from(users)
			.orderBy(users.name);

		return NextResponse.json(allUsers);
	} catch (error) {
		console.error('Error fetching users:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch users' },
			{ status: 500 }
		);
	}
}
