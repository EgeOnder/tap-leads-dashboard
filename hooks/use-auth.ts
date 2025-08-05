'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

interface User {
	id: string;
	email: string;
	name?: string;
	image?: string | null;
	role?: string;
}

interface AuthState {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
}

export function useAuth() {
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		isLoading: true,
		isAuthenticated: false,
	});

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const { data: session, error } = await authClient.getSession();

				if (error) {
					console.error('Session error:', error);
					setAuthState({
						user: null,
						isLoading: false,
						isAuthenticated: false,
					});
					return;
				}

				if (session) {
					setAuthState({
						user: {
							...session.user,
							role: session.user.role || undefined,
						},
						isLoading: false,
						isAuthenticated: true,
					});
				} else {
					setAuthState({
						user: null,
						isLoading: false,
						isAuthenticated: false,
					});
				}
			} catch (error) {
				console.error('Auth check error:', error);
				setAuthState({
					user: null,
					isLoading: false,
					isAuthenticated: false,
				});
			}
		};

		checkAuth();
	}, []);

	const signOut = async () => {
		try {
			const { error } = await authClient.signOut();
			if (error) {
				console.error('Sign out error:', error);
			} else {
				setAuthState({
					user: null,
					isLoading: false,
					isAuthenticated: false,
				});
			}
		} catch (error) {
			console.error('Sign out error:', error);
		}
	};

	return {
		...authState,
		signOut,
	};
}
