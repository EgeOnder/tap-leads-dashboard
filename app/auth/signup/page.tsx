'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail, Lock, User, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function SignUpPage() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const router = useRouter();

	// Check if sign-up is disabled (production mode)
	const isProduction = process.env.NODE_ENV === 'production';
	const isSignUpDisabled = isProduction;

	// Check if user is already authenticated
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const { data: session, error } = await authClient.getSession();
				if (session && !error) {
					router.push('/dashboard');
				}
			} catch (err) {
				console.error('Auth check error:', err);
			} finally {
				setIsCheckingAuth(false);
			}
		};

		checkAuth();
	}, [router]);

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();

		if (isSignUpDisabled) {
			setError('Sign up is disabled in production mode');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const { data, error } = await authClient.signUp.email({
				email,
				password,
				name,
			});

			if (error) {
				setError(error.message || 'Sign up failed');
			} else {
				router.push('/dashboard');
			}
		} catch (err) {
			setError('An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	// Show loading while checking authentication
	if (isCheckingAuth) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 animate-pulse">
						<div className="w-8 h-8 bg-primary-foreground rounded-full"></div>
					</div>
					<h1 className="text-2xl font-bold text-foreground mb-2">
						Checking authentication...
					</h1>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<div className="flex items-center justify-center mb-4">
						<Logo />
					</div>
					<h2 className="mt-6 text-3xl font-extrabold text-foreground">
						Create your account
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Or{' '}
						<Link
							href="/auth/signin"
							className="font-medium text-primary hover:text-primary/80"
						>
							sign in to your existing account
						</Link>
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Get started</CardTitle>
						<CardDescription>
							{isSignUpDisabled
								? 'Account creation is disabled in production mode'
								: 'Create your account to access the dashboard'}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{isSignUpDisabled && (
							<Alert className="mb-4">
								<AlertTriangle className="h-4 w-4" />
								<AlertDescription>
									Account creation is only available during
									development. Please contact an administrator
									to create your account.
								</AlertDescription>
							</Alert>
						)}

						<form onSubmit={handleSignUp} className="space-y-4">
							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<div className="space-y-2">
								<Label htmlFor="name">Full name</Label>
								<div className="relative">
									<User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="name"
										type="text"
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
										placeholder="Enter your full name"
										className="pl-10"
										required
										disabled={isSignUpDisabled}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email address</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="email"
										type="email"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										placeholder="Enter your email"
										className="pl-10"
										required
										disabled={isSignUpDisabled}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="password"
										type="password"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										placeholder="Create a password"
										className="pl-10"
										required
										disabled={isSignUpDisabled}
									/>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={isLoading || isSignUpDisabled}
							>
								{isSignUpDisabled
									? 'Sign up disabled'
									: isLoading
									? 'Creating account...'
									: 'Create account'}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
