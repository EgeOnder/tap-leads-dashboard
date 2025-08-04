import { useState, useEffect } from 'react';

interface AuthState {
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string;
}

export function useAuth() {
	const [authState, setAuthState] = useState<AuthState>({
		isAuthenticated: false,
		isLoading: true,
		error: '',
	});

	// Check authentication status on mount
	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			const response = await fetch('/api/auth/verify');
			const data = await response.json();

			setAuthState({
				isAuthenticated: data.authenticated,
				isLoading: false,
				error: '',
			});
		} catch (error) {
			setAuthState({
				isAuthenticated: false,
				isLoading: false,
				error: 'Failed to verify authentication status',
			});
		}
	};

	const login = async (password: string): Promise<boolean> => {
		setAuthState((prev) => ({ ...prev, isLoading: true, error: '' }));

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ password }),
			});

			const data = await response.json();

			if (response.ok) {
				setAuthState({
					isAuthenticated: true,
					isLoading: false,
					error: '',
				});
				return true;
			} else {
				setAuthState({
					isAuthenticated: false,
					isLoading: false,
					error: data.error || 'Login failed',
				});
				return false;
			}
		} catch (error) {
			setAuthState({
				isAuthenticated: false,
				isLoading: false,
				error: 'Network error occurred',
			});
			return false;
		}
	};

	const logout = async () => {
		setAuthState((prev) => ({ ...prev, isLoading: true }));

		try {
			await fetch('/api/auth/logout', {
				method: 'POST',
			});
		} catch (error) {
			console.error('Logout error:', error);
		}

		setAuthState({
			isAuthenticated: false,
			isLoading: false,
			error: '',
		});
	};

	return {
		...authState,
		login,
		logout,
	};
}
