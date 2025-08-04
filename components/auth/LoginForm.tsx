'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
	onLogin: (password: string) => Promise<boolean>;
	error?: string;
	isLoading?: boolean;
}

export function LoginForm({ onLogin, error, isLoading }: LoginFormProps) {
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const success = await onLogin(password);
		if (success) {
			setPassword('');
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<img src="/logo/tap-logo.webp" alt="TAP Leads" />
				</div>

				<Card className="bg-card border-border shadow-lg">
					<CardHeader>
						<CardTitle className="text-card-foreground">
							Sign in
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label
									htmlFor="password"
									className="text-foreground"
								>
									Password
								</Label>
								<div className="relative">
									<Input
										id="password"
										type={
											showPassword ? 'text' : 'password'
										}
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										placeholder="••••••••"
										className="pr-10 bg-background border-input text-foreground focus:border-ring focus:ring-ring"
										required
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
										onClick={() =>
											setShowPassword(!showPassword)
										}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4 text-muted-foreground" />
										) : (
											<Eye className="h-4 w-4 text-muted-foreground" />
										)}
									</Button>
								</div>
							</div>

							{error && (
								<div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
									<p className="text-sm text-destructive">
										{error}
									</p>
								</div>
							)}

							<Button
								type="submit"
								className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
								disabled={isLoading}
							>
								{isLoading ? 'Signing in...' : 'Sign in'}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
