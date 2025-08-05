import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tags } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/tags - Get all tags
export async function GET() {
	try {
		const allTags = await db
			.select({
				id: tags.id,
				name: tags.name,
				color: tags.color,
				description: tags.description,
				createdBy: tags.createdBy,
				createdAt: tags.createdAt,
				updatedAt: tags.updatedAt,
			})
			.from(tags)
			.orderBy(tags.name);

		return NextResponse.json(allTags);
	} catch (error) {
		console.error('Error fetching tags:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch tags' },
			{ status: 500 }
		);
	}
}

// POST /api/tags - Create a new tag
export async function POST(request: NextRequest) {
	try {
		const { name, color, description, createdBy } = await request.json();

		if (!name || !createdBy) {
			return NextResponse.json(
				{ error: 'Name and createdBy are required' },
				{ status: 400 }
			);
		}

		const newTag = await db
			.insert(tags)
			.values({
				name: name.trim(),
				color: color || '#3b82f6',
				description: description?.trim() || null,
				createdBy,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();

		return NextResponse.json(newTag[0]);
	} catch (error) {
		console.error('Error creating tag:', error);
		return NextResponse.json(
			{ error: 'Failed to create tag' },
			{ status: 500 }
		);
	}
}

// PATCH /api/tags?id= - Update a tag
export async function PATCH(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const tagId = searchParams.get('id');
		const { name, color, description } = await request.json();

		if (!tagId) {
			return NextResponse.json(
				{ error: 'Tag ID is required' },
				{ status: 400 }
			);
		}

		const updated = await db
			.update(tags)
			.set({
				name: name?.trim(),
				color,
				description: description?.trim() || null,
				updatedAt: new Date(),
			})
			.where(eq(tags.id, Number(tagId)))
			.returning();

		if (!updated[0]) {
			return NextResponse.json(
				{ error: 'Tag not found or not updated' },
				{ status: 404 }
			);
		}

		return NextResponse.json(updated[0]);
	} catch (error) {
		console.error('Error updating tag:', error);
		return NextResponse.json(
			{ error: 'Failed to update tag' },
			{ status: 500 }
		);
	}
}

// DELETE /api/tags?id= - Delete a tag
export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const tagId = searchParams.get('id');

		if (!tagId) {
			return NextResponse.json(
				{ error: 'Tag ID is required' },
				{ status: 400 }
			);
		}

		await db.delete(tags).where(eq(tags.id, Number(tagId)));
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting tag:', error);
		return NextResponse.json(
			{ error: 'Failed to delete tag' },
			{ status: 500 }
		);
	}
}
