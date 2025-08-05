'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { StatsCards } from './StatsCards';
import { LeadsTable } from './LeadsTable';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface DashboardProps {
	onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
	const [leads, setLeads] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(false);

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
			{/* Mobile navbar */}
			<nav className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center px-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setSidebarOpen(true)}
					className="mr-3"
				>
					<Menu className="h-5 w-5" />
				</Button>
			</nav>

			{/* Overlay for mobile */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 md:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			<Sidebar
				onLogout={onLogout}
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>

			<main className="md:ml-64 overflow-auto">
				<div className="p-4 md:p-8 md:pt-8 pt-20">
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-foreground mb-2 md:block hidden">
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
