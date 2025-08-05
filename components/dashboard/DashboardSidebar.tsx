'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Users, LogOut, X, Shield, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Switch } from '../ui/switch';
import { useTheme } from 'next-themes';
import { Logo } from '@/components/Logo';
import { hasAdminPermissions } from '@/lib/admin-roles';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface DashboardSidebarProps {
	onLogout: () => void;
	isOpen?: boolean;
	onClose?: () => void;
	user?: {
		id: string;
		email: string;
		name?: string;
		image?: string | null;
		role?: string;
	};
}

export function DashboardSidebar({
	onLogout,
	isOpen = false,
	onClose,
	user,
}: DashboardSidebarProps) {
	const { theme, setTheme } = useTheme();
	const pathname = usePathname();

	const handleThemeChange = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	// Get user initials for avatar fallback
	const getUserInitials = (name?: string, email?: string) => {
		if (name) {
			const names = name.split(' ');
			if (names.length >= 2) {
				return `${names[0][0]}${
					names[names.length - 1][0]
				}`.toUpperCase();
			}
			return name[0].toUpperCase();
		}
		if (email) {
			return email[0].toUpperCase();
		}
		return 'U';
	};

	// Define menu items based on user permissions
	const menuItems = [
		{
			icon: Users,
			label: 'Leads',
			href: '/dashboard',
			active: pathname === '/dashboard',
		},
		...(hasAdminPermissions(user?.role || '')
			? [
					{
						icon: Shield,
						label: 'Admin',
						href: '/dashboard/admin',
						active: pathname === '/dashboard/admin',
					},
			  ]
			: []),
	];

	const renderMenuItem = (item: any) => (
		<Link key={item.label} href={item.href} onClick={onClose}>
			<Button
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
		</Link>
	);

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
					{menuItems.map(renderMenuItem)}
				</nav>

				<div className="p-4 border-t border-border">
					{user && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
								>
									<Avatar className="w-6 h-6 mr-3">
										<AvatarFallback className="text-xs">
											{getUserInitials(
												user.name,
												user.email
											)}
										</AvatarFallback>
									</Avatar>
									<span className="truncate">
										{user.name || user.email}
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">
											{user.name || 'User'}
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											{user.role || 'User'}
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											{user.email}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleThemeChange}>
									{theme === 'dark' ? (
										<Sun className="w-4 h-4 mr-3" />
									) : (
										<Moon className="w-4 h-4 mr-3" />
									)}
									{theme === 'dark'
										? 'Light Mode'
										: 'Dark Mode'}
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={onLogout}
									className="text-destructive focus:text-destructive"
								>
									<LogOut className="w-4 h-4 mr-3" />
									Sign out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>

			{/* Desktop sidebar */}
			<div className="hidden md:flex fixed top-0 left-0 w-64 bg-card border-r border-border flex-col h-screen shadow-sm z-50">
				<Link href="/" className="p-6 border-b border-border">
					<Logo alt="TAP Leads" />
				</Link>

				<nav className="flex-1 p-4 space-y-2">
					{menuItems.map(renderMenuItem)}
				</nav>

				<div className="p-4 border-t border-border">
					{user && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="w-full justify-start hover:text-foreground hover:bg-accent"
								>
									<Avatar className="w-6 h-6 mr-3">
										<AvatarFallback className="text-xs">
											{getUserInitials(
												user.name,
												user.email
											)}
										</AvatarFallback>
									</Avatar>
									<span className="truncate">
										{user.name || user.email}
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>
									<div className="flex flex-col space-y-1">
										<p className="text-xs leading-none text-muted-foreground">
											Role: {user.role || 'User'}
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											{user.email}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleThemeChange}>
									{theme === 'dark' ? (
										<Sun className="w-4 h-4 mr-3" />
									) : (
										<Moon className="w-4 h-4 mr-3" />
									)}
									{theme === 'dark'
										? 'Light Mode'
										: 'Dark Mode'}
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={onLogout}
									className="text-destructive focus:text-destructive"
								>
									<LogOut className="w-4 h-4 mr-3" />
									Sign out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</>
	);
}
