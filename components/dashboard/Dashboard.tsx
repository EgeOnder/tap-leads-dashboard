'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { StatsCards } from './StatsCards';
import { LeadsTable } from './LeadsTable';

interface DashboardProps {
	onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
	const [leads, setLeads] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchLeads();
	}, []);

	const fetchLeads = async () => {
		try {
			const response = await fetch('/api/leads');
			const data = await response.json();
			setLeads(data);
		} catch (error) {
			console.error('Error fetching leads:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-foreground">Loading dashboard...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Sidebar onLogout={onLogout} />

			<main className="ml-64 overflow-auto">
				<div className="p-8">
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-foreground mb-2">
							Leads
						</h1>
					</div>

					<StatsCards leads={leads} />
					<LeadsTable leads={leads} />
				</div>
			</main>
		</div>
	);
}
