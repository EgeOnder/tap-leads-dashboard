'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
	const { isAuthenticated, isLoading, user, signOut } = useAuth();
	const router = useRouter();

	// Redirect to sign in page if not authenticated
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
		return router.push('/dashboard');
	}

	// Return null while redirecting
	return null;
}
