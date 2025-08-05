import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leadTags } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST /api/leads/[id]/tags - Add a tag to a lead
export async function POST(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { tagId, createdBy } = await request.json();
		const leadId = parseInt(params.id);

		if (!tagId || !createdBy) {
			return NextResponse.json(
				{ error: 'Tag ID and createdBy are required' },
				{ status: 400 }
			);
		}

		// Check if the tag is already assigned to this lead
		const existingTag = await db
			.select()
			.from(leadTags)
			.where(and(eq(leadTags.leadId, leadId), eq(leadTags.tagId, tagId)))
			.limit(1);

		if (existingTag.length > 0) {
			return NextResponse.json(
				{ error: 'Tag is already assigned to this lead' },
				{ status: 400 }
			);
		}

		// Add the tag to the lead
		const newLeadTag = await db
			.insert(leadTags)
			.values({
				leadId,
				tagId,
				createdBy,
				createdAt: new Date(),
			})
			.returning();

		return NextResponse.json(newLeadTag[0]);
	} catch (error) {
		console.error('Error adding tag to lead:', error);
		return NextResponse.json(
			{ error: 'Failed to add tag to lead' },
			{ status: 500 }
		);
	}
}

// DELETE /api/leads/[id]/tags - Remove a tag from a lead
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { searchParams } = new URL(request.url);
		const tagId = searchParams.get('tagId');
		const leadId = parseInt(params.id);

		if (!tagId) {
			return NextResponse.json(
				{ error: 'Tag ID is required' },
				{ status: 400 }
			);
		}

		// Remove the tag from the lead
		await db
			.delete(leadTags)
			.where(
				and(
					eq(leadTags.leadId, leadId),
					eq(leadTags.tagId, parseInt(tagId))
				)
			);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error removing tag from lead:', error);
		return NextResponse.json(
			{ error: 'Failed to remove tag from lead' },
			{ status: 500 }
		);
	}
}
