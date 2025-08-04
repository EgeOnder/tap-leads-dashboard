'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
	const { isAuthenticated, isLoading, error, login, logout } = useAuth();

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
				<div className="text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 animate-pulse">
						<div className="w-8 h-8 bg-white rounded-full"></div>
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

	if (!isAuthenticated) {
		return (
			<LoginForm onLogin={login} error={error} isLoading={isLoading} />
		);
	}

	return <Dashboard onLogout={logout} />;
}
