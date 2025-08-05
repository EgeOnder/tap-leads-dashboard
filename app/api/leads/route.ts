import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads, users, tags, leadTags, website } from '@/lib/db/schema';
import { eq, and, isNull, or, inArray } from 'drizzle-orm';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/leads - Get all leads with related data
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get('userId');
		const tagId = searchParams.get('tagId');
		const assignedTo = searchParams.get('assignedTo');

		// Build query conditions
		const conditions = [];

		if (userId) {
			conditions.push(eq(leads.assignedTo, userId));
		}

		if (assignedTo === 'unassigned') {
			conditions.push(isNull(leads.assignedTo));
		} else if (assignedTo && assignedTo !== 'all') {
			conditions.push(eq(leads.assignedTo, assignedTo));
		}

		// Get leads with website data
		const leadsData = await db
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
				assignedTo: leads.assignedTo,
				createdAt: leads.createdAt,
				updatedAt: leads.updatedAt,
				websiteUrl: website.url,
			})
			.from(leads)
			.leftJoin(website, eq(leads.websiteId, website.id))
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		// Get user data for assigned users only
		const userIds = new Set<string>();
		leadsData.forEach((lead) => {
			if (lead.assignedTo) userIds.add(lead.assignedTo);
		});

		let usersData: any[] = [];
		if (userIds.size > 0) {
			const userIdArray = Array.from(userIds);
			if (userIdArray.length === 1) {
				usersData = await db
					.select({
						id: users.id,
						name: users.name,
						email: users.email,
					})
					.from(users)
					.where(eq(users.id, userIdArray[0]));
			} else {
				usersData = await db
					.select({
						id: users.id,
						name: users.name,
						email: users.email,
					})
					.from(users)
					.where(inArray(users.id, userIdArray));
			}
		}

		const usersMap = new Map(usersData.map((user) => [user.id, user]));

		// Get tags for each lead
		const leadsWithTags = await Promise.all(
			leadsData.map(async (lead) => {
				const leadTagsData = await db
					.select({
						id: tags.id,
						name: tags.name,
						color: tags.color,
						description: tags.description,
						createdBy: tags.createdBy,
					})
					.from(tags)
					.innerJoin(leadTags, eq(tags.id, leadTags.tagId))
					.where(eq(leadTags.leadId, lead.id));

				return {
					...lead,
					assignedToUser: lead.assignedTo
						? usersMap.get(lead.assignedTo)
						: null,
					tags: leadTagsData,
				};
			})
		);

		// Filter by tag if specified
		let filteredLeads = leadsWithTags;
		if (tagId && tagId !== 'all') {
			if (tagId === 'untagged') {
				filteredLeads = leadsWithTags.filter(
					(lead) => !lead.tags || lead.tags.length === 0
				);
			} else {
				filteredLeads = leadsWithTags.filter(
					(lead) =>
						lead.tags &&
						lead.tags.some((tag) => tag.id.toString() === tagId)
				);
			}
		}

		return NextResponse.json(filteredLeads);
	} catch (error) {
		console.error('Error fetching leads:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch leads' },
			{ status: 500 }
		);
	}
}

// PATCH /api/leads/:id/assign - Assign lead to user
export async function PATCH(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const leadId = searchParams.get('leadId');
		const { assignedTo } = await request.json();

		if (!leadId) {
			return NextResponse.json(
				{ error: 'Lead ID is required' },
				{ status: 400 }
			);
		}

		// Update lead assignment
		await db
			.update(leads)
			.set({
				assignedTo: assignedTo || null,
				updatedAt: new Date(),
			})
			.where(eq(leads.id, parseInt(leadId)));

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error assigning lead:', error);
		return NextResponse.json(
			{ error: 'Failed to assign lead' },
			{ status: 500 }
		);
	}
}
