'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Users, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '../ui/switch';
import { useTheme } from 'next-themes';

interface SidebarProps {
	onLogout: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
	const { theme, setTheme } = useTheme();

	// TODO: Add more menu items
	const menuItems = [{ icon: Users, label: 'Leads', active: true }];

	const handleThemeChange = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	return (
		<div className="fixed top-0 left-0 w-64 bg-card border-r border-border flex flex-col h-screen shadow-sm z-50">
			<Link href="/" className="p-6 border-b border-border">
				<img src="/logo/tap-logo.webp" alt="TAP Leads" />
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

			<div className="flex flex-col w-full space-y-2 ">
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
	);
}
