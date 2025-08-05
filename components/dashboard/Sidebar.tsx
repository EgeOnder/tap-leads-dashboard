'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Users, LogOut, X } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '../ui/switch';
import { useTheme } from 'next-themes';
import { Logo } from '@/components/Logo';

interface SidebarProps {
	onLogout: () => void;
	isOpen?: boolean;
	onClose?: () => void;
}

export function Sidebar({ onLogout, isOpen = false, onClose }: SidebarProps) {
	const { theme, setTheme } = useTheme();

	// TODO: Add more menu items
	const menuItems = [{ icon: Users, label: 'Leads', active: true }];

	const handleThemeChange = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	return (
		<>
			{/* Mobile sidebar */}
			<div
				className={cn(
					'fixed top-0 left-0 w-64 bg-card border-r border-border flex flex-col h-screen shadow-sm z-50 transform transition-transform duration-300 ease-in-out md:hidden',
					isOpen ? 'translate-x-0' : '-translate-x-full'
				)}
			>
				<div className="flex items-center justify-between p-6 border-b border-border">
					<Logo alt="TAP Leads" />
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="md:hidden"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>

				<nav className="flex-1 p-4 space-y-2">
					{menuItems.map((item) => (
						<Button
							key={item.label}
							variant={item.active ? 'secondary' : 'ghost'}
							className={cn(
								'w-full justify-start text-left',
								item.active
									? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
									: 'text-muted-foreground hover:text-foreground hover:bg-accent'
							)}
							onClick={onClose}
						>
							<item.icon className="w-4 h-4 mr-3" />
							{item.label}
						</Button>
					))}
				</nav>

				<div className="flex flex-col w-full space-y-2">
					<div className="p-4 border-t border-border">
						<Button
							variant="ghost"
							onClick={handleThemeChange}
							className="w-full justify-between text-muted-foreground hover:text-foreground hover:bg-accent"
						>
							Dark Mode
							<Switch
								checked={theme === 'dark'}
								onCheckedChange={handleThemeChange}
							/>
						</Button>
					</div>
					<div className="p-4 border-t border-border">
						<Button
							onClick={onLogout}
							variant="ghost"
							className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
						>
							<LogOut className="w-4 h-4 mr-3" />
							Logout
						</Button>
					</div>
				</div>
			</div>

			{/* Desktop sidebar */}
			<div className="hidden md:block fixed top-0 left-0 w-64 bg-card border-r border-border flex flex-col h-screen shadow-sm z-50">
				<Link href="/" className="p-6 border-b border-border">
					<Logo alt="TAP Leads" />
				</Link>

				<nav className="flex-1 p-4 space-y-2">
					{menuItems.map((item) => (
						<Button
							key={item.label}
							variant={item.active ? 'secondary' : 'ghost'}
							className={cn(
								'w-full justify-start text-left',
								item.active
									? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
									: 'text-muted-foreground hover:text-foreground hover:bg-accent'
							)}
						>
							<item.icon className="w-4 h-4 mr-3" />
							{item.label}
						</Button>
					))}
				</nav>

				<div className="flex flex-col w-full space-y-2">
					<div className="p-4 border-t border-border">
						<Button
							variant="ghost"
							onClick={handleThemeChange}
							className="w-full justify-between text-muted-foreground hover:text-foreground hover:bg-accent"
						>
							Dark Mode
							<Switch
								checked={theme === 'dark'}
								onCheckedChange={handleThemeChange}
							/>
						</Button>
					</div>
					<div className="p-4 border-t border-border">
						<Button
							onClick={onLogout}
							variant="ghost"
							className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
						>
							<LogOut className="w-4 h-4 mr-3" />
							Logout
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
