import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// PATCH /api/leads/[id]/assign - Assign lead to user
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { assignedTo } = await request.json();
		const leadId = parseInt(params.id);

		// Update lead assignment
		await db
			.update(leads)
			.set({
				assignedTo: assignedTo || null,
				updatedAt: new Date(),
			})
			.where(eq(leads.id, leadId));

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error assigning lead:', error);
		return NextResponse.json(
			{ error: 'Failed to assign lead' },
			{ status: 500 }
		);
	}
}
