'use client';

import { useState, useEffect } from 'react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { LeadsTable } from '@/components/dashboard/LeadsTable';

interface User {
	id: string;
	name: string;
	email: string;
}

interface Tag {
	id: number;
	name: string;
	color: string;
	description?: string;
	createdBy: string;
}

interface Lead {
	id: number;
	name?: string;
	email?: string;
	phone?: string;
	jobTitle?: string;
	location?: string;
	company?: string;
	description?: string;
	contactLink?: string;
	websiteId: number;
	websiteUrl?: string;
	assignedTo?: string;
	assignedToUser?: User;
	tags?: Tag[];
	createdAt: Date;
	updatedAt: Date;
}

export default function DashboardPage() {
	const [leads, setLeads] = useState<Lead[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			// Fetch leads, users, and tags in parallel
			const [leadsResponse, usersResponse, tagsResponse] =
				await Promise.all([
					fetch('/api/leads'),
					fetch('/api/users'),
					fetch('/api/tags'),
				]);

			// Check if responses are ok
			if (!leadsResponse.ok || !usersResponse.ok || !tagsResponse.ok) {
				throw new Error(
					'Failed to fetch data from one or more endpoints'
				);
			}

			const [leadsData, usersData, tagsData] = await Promise.all([
				leadsResponse.json(),
				usersResponse.json(),
				tagsResponse.json(),
			]);

			// Ensure leads is an array
			setLeads(Array.isArray(leadsData) ? leadsData : []);
			setUsers(Array.isArray(usersData) ? usersData : []);
			setTags(Array.isArray(tagsData) ? tagsData : []);

			// For now, set the first user as current user (in a real app, this would come from auth)
			if (usersData.length > 0) {
				setCurrentUser(usersData[0]);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
			// Set empty arrays on error to prevent crashes
			setLeads([]);
			setUsers([]);
			setTags([]);
		} finally {
			setLoading(false);
		}
	};

	const handleAssignLead = async (leadId: number, userId: string | null) => {
		try {
			const response = await fetch(`/api/leads/${leadId}/assign`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ assignedTo: userId }),
			});

			if (response.ok) {
				// Refresh leads data
				fetchData();
			} else {
				throw new Error('Failed to assign lead');
			}
		} catch (error) {
			console.error('Error assigning lead:', error);
			throw error;
		}
	};

	const handleAddTag = async (leadId: number, tagId: number) => {
		try {
			const response = await fetch(`/api/leads/${leadId}/tags`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					tagId,
					createdBy: currentUser?.id || 'system',
				}),
			});

			if (response.ok) {
				// Refresh leads data
				fetchData();
			} else {
				throw new Error('Failed to add tag');
			}
		} catch (error) {
			console.error('Error adding tag:', error);
			throw error;
		}
	};

	const handleRemoveTag = async (leadId: number, tagId: number) => {
		try {
			const response = await fetch(
				`/api/leads/${leadId}/tags?tagId=${tagId}`,
				{
					method: 'DELETE',
				}
			);

			if (response.ok) {
				// Refresh leads data
				fetchData();
			} else {
				throw new Error('Failed to remove tag');
			}
		} catch (error) {
			console.error('Error removing tag:', error);
			throw error;
		}
	};

	const handleCreateTag = async (
		name: string,
		color: string,
		description?: string
	): Promise<Tag> => {
		try {
			const response = await fetch('/api/tags', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name,
					color,
					description,
					createdBy: currentUser?.id || 'system',
				}),
			});

			if (response.ok) {
				const newTag = await response.json();
				// Refresh tags data
				const tagsResponse = await fetch('/api/tags');
				const tagsData = await tagsResponse.json();
				setTags(tagsData);
				return newTag;
			} else {
				throw new Error('Failed to create tag');
			}
		} catch (error) {
			console.error('Error creating tag:', error);
			throw error;
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-foreground">Loading leads...</div>
			</div>
		);
	}

	if (!currentUser) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-foreground">No user found</div>
			</div>
		);
	}

	return (
		<>
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-foreground mb-2">
					Leads
				</h1>
			</div>

			<StatsCards leads={leads} />
			<LeadsTable
				leads={leads}
				users={users}
				tags={tags}
				currentUser={currentUser}
				onAssignLead={handleAssignLead}
				onAddTag={handleAddTag}
				onRemoveTag={handleRemoveTag}
				onCreateTag={handleCreateTag}
			/>
		</>
	);
}
