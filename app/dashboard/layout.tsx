'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { hasEmployeePermissions } from '@/lib/admin-roles';

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const { isAuthenticated, isLoading, user, signOut } = useAuth();
	const router = useRouter();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Redirect to sign in if not authenticated
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push('/auth/signin');
		}
	}, [isAuthenticated, isLoading, router]);

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 animate-pulse">
						<div className="w-8 h-8 bg-primary-foreground rounded-full"></div>
					</div>
					<h1 className="text-2xl font-bold text-foreground mb-2">
						Loading...
					</h1>
					<p className="text-muted-foreground">
						Checking authentication status
					</p>
				</div>
			</div>
		);
	}

	// Show dashboard if authenticated
	if (isAuthenticated && user) {
		// Check if user has permissions to access dashboard
		if (!hasEmployeePermissions(user.role || '')) {
			return (
				<div className="min-h-screen bg-background flex items-center justify-center">
					<div className="text-center max-w-md mx-auto p-6">
						<div className="mb-6">
							<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8 text-muted-foreground"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
							</div>
							<h1 className="text-2xl font-bold text-foreground mb-2">
								Access Restricted
							</h1>
							<p className="text-muted-foreground mb-4">
								You don&apos;t have permission to access the
								dashboard. Please contact your administrator to
								request employee permissions.
							</p>
							<div className="text-sm text-muted-foreground">
								<p>
									Current role:{' '}
									<span className="font-medium">
										{user.role || 'user'}
									</span>
								</p>
								<p>Required: employee or admin</p>
							</div>
						</div>
						<Button onClick={signOut} variant="outline">
							Sign Out
						</Button>
					</div>
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

				<DashboardSidebar
					onLogout={signOut}
					isOpen={sidebarOpen}
					onClose={() => setSidebarOpen(false)}
					user={user}
				/>

				<main className="md:ml-64 overflow-auto">
					<div className="p-4 md:p-8 md:pt-8 pt-20">{children}</div>
				</main>
			</div>
		);
	}

	// Return null while redirecting
	return null;
}
