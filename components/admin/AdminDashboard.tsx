'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import {
	hasEmployeePermissions,
	hasAdminPermissions,
	canAssignRoles,
} from '@/lib/admin-roles';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	banned: boolean;
	banReason?: string;
	createdAt: string;
}

export function AdminDashboard() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [newUser, setNewUser] = useState({
		email: '',
		password: '',
		name: '',
		role: 'employee',
	});
	const { toast } = useToast();

	useEffect(() => {
		loadCurrentUser();
		loadUsers();
	}, []);

	const loadCurrentUser = async () => {
		try {
			const session = await authClient.getSession();
			setCurrentUser(session?.data?.user);
		} catch (error) {
			console.error('Error loading current user:', error);
		}
	};

	const loadUsers = async () => {
		try {
			setLoading(true);
			const response = await authClient.admin.listUsers({
				query: {
					limit: 100,
				},
			});

			if (response.data?.users) {
				setUsers(response.data.users as User[]);
			}
		} catch (error) {
			console.error('Error loading users:', error);
			toast({
				title: 'Error',
				description: 'Failed to load users',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const createUser = async () => {
		try {
			await authClient.admin.createUser({
				email: newUser.email,
				password: newUser.password,
				name: newUser.name,
				role: newUser.role as 'user' | 'admin',
			});

			toast({
				title: 'Success',
				description: 'User created successfully',
			});

			setNewUser({ email: '', password: '', name: '', role: 'user' });
			loadUsers();
		} catch (error) {
			console.error('Error creating user:', error);
			toast({
				title: 'Error',
				description: 'Failed to create user',
				variant: 'destructive',
			});
		}
	};

	const setUserRole = async (userId: string, role: string) => {
		try {
			await authClient.admin.setRole({
				userId,
				role: role as 'user' | 'admin',
			});

			toast({
				title: 'Success',
				description: 'User role updated successfully',
			});

			loadUsers();
		} catch (error) {
			console.error('Error setting user role:', error);
			toast({
				title: 'Error',
				description: 'Failed to update user role',
				variant: 'destructive',
			});
		}
	};

	const banUser = async (
		userId: string,
		reason: string = 'No reason provided'
	) => {
		try {
			await authClient.admin.banUser({
				userId,
				banReason: reason,
			});

			toast({
				title: 'Success',
				description: 'User banned successfully',
			});

			loadUsers();
		} catch (error) {
			console.error('Error banning user:', error);
			toast({
				title: 'Error',
				description: 'Failed to ban user',
				variant: 'destructive',
			});
		}
	};

	const unbanUser = async (userId: string) => {
		try {
			await authClient.admin.unbanUser({
				userId,
			});

			toast({
				title: 'Success',
				description: 'User unbanned successfully',
			});

			loadUsers();
		} catch (error) {
			console.error('Error unbanning user:', error);
			toast({
				title: 'Error',
				description: 'Failed to unban user',
				variant: 'destructive',
			});
		}
	};

	const removeUser = async (userId: string) => {
		try {
			await authClient.admin.removeUser({
				userId,
			});

			toast({
				title: 'Success',
				description: 'User removed successfully',
			});

			loadUsers();
		} catch (error) {
			console.error('Error removing user:', error);
			toast({
				title: 'Error',
				description: 'Failed to remove user',
				variant: 'destructive',
			});
		}
	};

	if (!currentUser || !hasEmployeePermissions(currentUser.role)) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Access Denied</CardTitle>
						<CardDescription>
							You don&apos;t have permission to access the admin
							dashboard.
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-foreground mb-2">
					Admin
				</h1>
			</div>

			{hasAdminPermissions(currentUser.role) && (
				<Card>
					<CardHeader>
						<CardTitle>Create New User</CardTitle>
						<CardDescription>
							Create a new user account
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={newUser.email}
									onChange={(e) =>
										setNewUser({
											...newUser,
											email: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									value={newUser.password}
									onChange={(e) =>
										setNewUser({
											...newUser,
											password: e.target.value,
										})
									}
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									value={newUser.name}
									onChange={(e) =>
										setNewUser({
											...newUser,
											name: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<Label htmlFor="role">Role</Label>
								<Select
									value={newUser.role}
									onValueChange={(value) =>
										setNewUser({ ...newUser, role: value })
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="employee">
											Employee
										</SelectItem>
										<SelectItem value="admin">
											Admin
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<Button onClick={createUser}>Create User</Button>
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Users</CardTitle>
					<CardDescription>Manage user accounts</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div>Loading users...</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user) => (
									<TableRow key={user.id}>
										<TableCell>{user.name}</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>
											{canAssignRoles(
												currentUser.role
											) ? (
												<Select
													value={user.role}
													onValueChange={(value) =>
														setUserRole(
															user.id,
															value
														)
													}
												>
													<SelectTrigger className="w-32">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="user">
															User
														</SelectItem>
														<SelectItem value="employee">
															Employee
														</SelectItem>
														<SelectItem value="admin">
															Admin
														</SelectItem>
													</SelectContent>
												</Select>
											) : (
												<span>{user.role}</span>
											)}
										</TableCell>
										<TableCell>
											{user.banned ? (
												<span className="text-red-600">
													Banned
												</span>
											) : (
												<span className="text-green-600">
													Active
												</span>
											)}
										</TableCell>
										<TableCell className="space-x-2">
											<div className="flex gap-2">
												{user.banned ? (
													<Button
														variant="outline"
														size="sm"
														onClick={() =>
															unbanUser(user.id)
														}
													>
														Unban
													</Button>
												) : (
													<Button
														variant="destructive"
														size="sm"
														onClick={() =>
															banUser(user.id)
														}
													>
														Ban
													</Button>
												)}
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<Button
															variant="destructive"
															size="sm"
														>
															Delete
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>
																Are you sure?
															</AlertDialogTitle>
															<AlertDialogDescription>
																This action
																cannot be
																undone. This
																will permanently
																delete the user
																account for{' '}
																<strong>
																	{user.name}
																</strong>{' '}
																({user.email}).
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>
																Cancel
															</AlertDialogCancel>
															<AlertDialogAction
																onClick={() =>
																	removeUser(
																		user.id
																	)
																}
																className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
															>
																Delete User
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
