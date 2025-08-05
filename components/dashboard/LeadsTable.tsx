'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Search,
	MoreHorizontal,
	Mail,
	Phone,
	ExternalLink,
	Globe,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Copy,
	User,
	Building,
	MapPin,
	Tag,
	Plus,
	X,
	Users,
} from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import React from 'react';
import Link from 'next/link';

interface Tag {
	id: number;
	name: string;
	color: string;
	description?: string;
	createdBy: string;
}

interface User {
	id: string;
	name: string;
	email: string;
}

interface Lead {
	id: number;
	name?: string;
	email?: string;
	phone?: string;
	jobTitle?: string;
	location?: string;
	company?: string;
	description?: string;
	contactLink?: string;
	websiteId: number;
	websiteUrl?: string;
	assignedTo?: string;
	assignedToUser?: User;
	tags?: Tag[];
	createdAt: Date;
	updatedAt: Date;
}

interface LeadsTableProps {
	leads: Lead[];
	users: User[];
	tags: Tag[];
	currentUser: User;
	onAssignLead?: (leadId: number, userId: string | null) => Promise<void>;
	onAddTag?: (leadId: number, tagId: number) => Promise<void>;
	onRemoveTag?: (leadId: number, tagId: number) => Promise<void>;
	onCreateTag?: (
		name: string,
		color: string,
		description?: string
	) => Promise<Tag>;
}

export function LeadsTable({
	leads,
	users,
	tags,
	currentUser,
	onAssignLead,
	onAddTag,
	onRemoveTag,
	onCreateTag,
}: LeadsTableProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [companyFilter, setCompanyFilter] = useState<string>('all');
	const [websiteFilter, setWebsiteFilter] = useState<string>('all');
	const [userFilter, setUserFilter] = useState<string>('all');
	const [tagFilter, setTagFilter] = useState<string>('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
	const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
	const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);
	const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
	const [newTagName, setNewTagName] = useState('');
	const [newTagColor, setNewTagColor] = useState('#3b82f6');
	const [newTagDescription, setNewTagDescription] = useState('');
	const [isEditTagDialogOpen, setIsEditTagDialogOpen] = useState(false);
	const [editingTag, setEditingTag] = useState<Tag | null>(null);
	const [editTagName, setEditTagName] = useState('');
	const [editTagColor, setEditTagColor] = useState('#3b82f6');
	const [editTagDescription, setEditTagDescription] = useState('');
	const [isManageTagsDialogOpen, setIsManageTagsDialogOpen] = useState(false);
	const { toast } = useToast();

	const filteredLeads = leads.filter((lead) => {
		const matchesSearch =
			(lead.name || '')
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			(lead.company || '')
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			(lead.email || '')
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			(lead.jobTitle || '')
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
		const matchesCompany =
			companyFilter === 'all' || (lead.company || '') === companyFilter;
		const matchesWebsite =
			websiteFilter === 'all' ||
			((lead.websiteUrl || '') &&
				new URL(lead.websiteUrl || 'http://example.com').hostname ===
					websiteFilter);
		const matchesUser =
			userFilter === 'all' ||
			(userFilter === 'unassigned'
				? !lead.assignedTo
				: (lead.assignedTo || '') === userFilter);
		const matchesTag =
			tagFilter === 'all' ||
			(tagFilter === 'untagged'
				? !lead.tags || lead.tags.length === 0
				: lead.tags &&
				  lead.tags.some((tag) => tag.id.toString() === tagFilter));
		return (
			matchesSearch &&
			matchesCompany &&
			matchesWebsite &&
			matchesUser &&
			matchesTag
		);
	});

	// Reset to first page when filters change
	React.useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, companyFilter, websiteFilter, userFilter, tagFilter]);

	// Pagination logic
	const totalItems = filteredLeads.length;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentLeads = filteredLeads.slice(startIndex, endIndex);

	const uniqueCompanies = Array.from(
		new Set(leads.map((lead) => lead.company).filter(Boolean))
	);

	const uniqueWebsites = Array.from(
		new Set(
			leads
				.map((lead) => lead.websiteUrl)
				.filter(Boolean)
				.map((url) => new URL(url ?? 'http://example.com').hostname)
		)
	);

	const goToPage = (page: number) => {
		setCurrentPage(Math.max(1, Math.min(page, totalPages)));
	};

	const goToFirstPage = () => goToPage(1);
	const goToLastPage = () => goToPage(totalPages);
	const goToPreviousPage = () => goToPage(currentPage - 1);
	const goToNextPage = () => goToPage(currentPage + 1);

	const copyToClipboard = async (text: string, label: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast({
				title: 'Copied!',
				description: `${label} copied to clipboard`,
			});
		} catch (err) {
			toast({
				title: 'Error',
				description: 'Failed to copy to clipboard',
				variant: 'destructive',
			});
		}
	};

	const handleAssignLead = async (userId: string | null) => {
		if (!selectedLead || !onAssignLead) return;

		try {
			await onAssignLead(selectedLead.id, userId);
			toast({
				title: 'Success',
				description: userId
					? `Lead assigned to ${
							users.find((u) => u.id === userId)?.name
					  }`
					: 'Lead unassigned',
			});
			setIsAssignDialogOpen(false);
			setSelectedLead(null);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to assign lead',
				variant: 'destructive',
			});
		}
	};

	const handleAddTag = async (tagId: number) => {
		if (!selectedLead || !onAddTag) return;

		try {
			await onAddTag(selectedLead.id, tagId);
			toast({
				title: 'Success',
				description: 'Tag added to lead',
			});
			setIsTagDialogOpen(false);
			setSelectedLead(null);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to add tag',
				variant: 'destructive',
			});
		}
	};

	const handleRemoveTag = async (leadId: number, tagId: number) => {
		if (!onRemoveTag) return;

		try {
			await onRemoveTag(leadId, tagId);
			toast({
				title: 'Success',
				description: 'Tag removed from lead',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to remove tag',
				variant: 'destructive',
			});
		}
	};

	const handleCreateTag = async () => {
		if (!onCreateTag || !newTagName.trim()) return;

		try {
			await onCreateTag(
				newTagName.trim(),
				newTagColor,
				newTagDescription.trim() || undefined
			);
			toast({
				title: 'Success',
				description: 'Tag created successfully',
			});
			setIsCreateTagDialogOpen(false);
			setNewTagName('');
			setNewTagColor('#3b82f6');
			setNewTagDescription('');
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to create tag',
				variant: 'destructive',
			});
		}
	};

	const openAssignDialog = (lead: Lead) => {
		setSelectedLead(lead);
		setIsAssignDialogOpen(true);
	};

	const openTagDialog = (lead: Lead) => {
		setSelectedLead(lead);
		setIsTagDialogOpen(true);
	};

	// Handler to open edit dialog
	const openEditTagDialog = (tag: Tag) => {
		setEditingTag(tag);
		setEditTagName(tag.name);
		setEditTagColor(tag.color);
		setEditTagDescription(tag.description || '');
		setIsEditTagDialogOpen(true);
	};

	// Handler to update tag
	const handleUpdateTag = async () => {
		if (!editingTag) return;
		try {
			const response = await fetch(`/api/tags?id=${editingTag.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: editTagName.trim(),
					color: editTagColor,
					description: editTagDescription.trim(),
				}),
			});
			if (response.ok) {
				toast({ title: 'Success', description: 'Tag updated' });
				setIsEditTagDialogOpen(false);
				setEditingTag(null);
				// Optionally, refresh tags in parent
				if (typeof window !== 'undefined') window.location.reload();
			} else {
				throw new Error('Failed to update tag');
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update tag',
				variant: 'destructive',
			});
		}
	};

	// Handler to delete tag
	const handleDeleteTag = async (tagId: number) => {
		if (!window.confirm('Are you sure you want to delete this tag?'))
			return;
		try {
			const response = await fetch(`/api/tags?id=${tagId}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				toast({ title: 'Success', description: 'Tag deleted' });
				if (typeof window !== 'undefined') window.location.reload();
			} else {
				throw new Error('Failed to delete tag');
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete tag',
				variant: 'destructive',
			});
		}
	};

	return (
		<TooltipProvider>
			<Card className="bg-card border-border shadow-sm">
				<CardHeader>
					<div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
						<div className="flex flex-col xl:flex-row gap-2 w-full flex-1">
							<div className="relative w-full flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									placeholder="Search leads..."
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
									className="pl-10 bg-background border-input text-foreground focus:border-ring focus:ring-ring w-full"
								/>
							</div>
						</div>
						<Select
							onValueChange={setCompanyFilter}
							value={companyFilter}
						>
							<SelectTrigger className="w-full xl:w-[180px]">
								<SelectValue placeholder="Select Company" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									All Companies
								</SelectItem>
								{uniqueCompanies.map((company) => (
									<SelectItem
										key={company}
										value={String(company ?? '')}
									>
										{company}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							onValueChange={setWebsiteFilter}
							value={websiteFilter}
						>
							<SelectTrigger className="w-full xl:w-[180px]">
								<SelectValue placeholder="Select Website" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									All Websites
								</SelectItem>
								{uniqueWebsites.map((website) => (
									<SelectItem
										key={website}
										value={String(website ?? '')}
									>
										{website}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							onValueChange={setUserFilter}
							value={userFilter}
						>
							<SelectTrigger className="w-full xl:w-[180px]">
								<SelectValue placeholder="Select User" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Users</SelectItem>
								<SelectItem value="unassigned">
									Unassigned
								</SelectItem>
								{users.map((user) => (
									<SelectItem
										key={user.id}
										value={String(user.id ?? '')}
									>
										{user.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select onValueChange={setTagFilter} value={tagFilter}>
							<SelectTrigger className="w-full xl:w-[180px]">
								<SelectValue placeholder="Select Tag" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Tags</SelectItem>
								<SelectItem value="untagged">
									Untagged
								</SelectItem>
								{tags.map((tag) => (
									<SelectItem
										key={tag.id}
										value={String(tag.id ?? '')}
									>
										{tag.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							variant="outline"
							onClick={() => setIsManageTagsDialogOpen(true)}
							className="flex items-center gap-2 xl:w-auto w-full"
						>
							<Tag className="w-4 h-4" />
							Manage Tags
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="border-border hover:bg-accent/50">
									<TableHead className="text-foreground font-medium">
										Name
									</TableHead>
									<TableHead className="text-foreground font-medium">
										Company
									</TableHead>
									<TableHead className="text-foreground font-medium">
										Job Title
									</TableHead>
									<TableHead className="text-foreground font-medium">
										Website
									</TableHead>
									<TableHead className="text-foreground font-medium">
										Assigned To
									</TableHead>
									<TableHead className="text-foreground font-medium">
										Tags
									</TableHead>
									<TableHead className="text-foreground font-medium">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{currentLeads.map((lead) => (
									<TableRow
										key={lead.id}
										className="border-border hover:bg-accent/50 transition-colors"
									>
										<TableCell>
											<div className="font-medium text-card-foreground">
												{lead.name}
											</div>
											<div className="text-sm text-muted-foreground">
												{lead.email || 'No email'}
											</div>
										</TableCell>
										<TableCell>
											<div className="font-medium text-card-foreground">
												{lead.company || 'Unknown'}
											</div>
											<div className="text-sm text-muted-foreground">
												{lead.description
													? lead.description.substring(
															0,
															50
													  ) + '...'
													: 'No description'}
											</div>
										</TableCell>
										<TableCell className="text-foreground">
											{lead.jobTitle || 'Not specified'}
										</TableCell>
										<TableCell>
											{lead.websiteUrl ? (
												<div className="flex items-center space-x-2 group">
													<Globe className="w-4 h-4 text-muted-foreground" />
													<Link
														href={lead.websiteUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="text-foreground text-sm hover:underline transition-all duration-200 relative"
													>
														{
															new URL(
																lead.websiteUrl ??
																	'http://example.com'
															).hostname
														}
														<ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -right-4 top-0" />
													</Link>
												</div>
											) : (
												<span className="text-foreground text-sm">
													Unknown
												</span>
											)}
										</TableCell>
										<TableCell>
											{lead.assignedToUser ? (
												<div className="flex items-center space-x-2">
													<User className="w-4 h-4 text-muted-foreground" />
													<span className="text-sm text-foreground">
														{
															lead.assignedToUser
																.name
														}
													</span>
												</div>
											) : (
												<span className="text-sm text-muted-foreground">
													Unassigned
												</span>
											)}
										</TableCell>
										<TableCell>
											<div className="flex flex-wrap gap-1">
												{lead.tags &&
												lead.tags.length > 0 ? (
													lead.tags.map((tag) => (
														<Badge
															key={tag.id}
															variant="secondary"
															className="text-xs"
															style={{
																backgroundColor:
																	tag.color +
																	'20',
																color: tag.color,
																borderColor:
																	tag.color +
																	'40',
															}}
														>
															{tag.name}
															<Button
																variant="ghost"
																size="sm"
																className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
																onClick={() =>
																	handleRemoveTag(
																		lead.id,
																		tag.id
																	)
																}
															>
																<X className="w-3 h-3" />
															</Button>
														</Badge>
													))
												) : (
													<span className="text-sm text-muted-foreground">
														No tags
													</span>
												)}
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{lead.email && (
													<Tooltip delayDuration={0}>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="sm"
																className="text-muted-foreground hover:text-foreground hover:bg-accent"
																onClick={() =>
																	window.open(
																		`mailto:${lead.email}`,
																		'_blank'
																	)
																}
															>
																<Mail className="w-4 h-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															<p>
																Send email to{' '}
																{lead.email}
															</p>
														</TooltipContent>
													</Tooltip>
												)}
												{lead.phone && (
													<Tooltip delayDuration={0}>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="sm"
																className="text-muted-foreground hover:text-foreground hover:bg-accent"
																onClick={() =>
																	window.open(
																		`tel:${lead.phone}`,
																		'_blank'
																	)
																}
															>
																<Phone className="w-4 h-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															<p>
																Call{' '}
																{lead.phone}
															</p>
														</TooltipContent>
													</Tooltip>
												)}
												{lead.contactLink && (
													<Tooltip delayDuration={0}>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="sm"
																className="text-muted-foreground hover:text-foreground hover:bg-accent"
																onClick={() =>
																	window.open(
																		lead.contactLink,
																		'_blank'
																	)
																}
															>
																<ExternalLink className="w-4 h-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															<p>
																Visit contact
																page
															</p>
														</TooltipContent>
													</Tooltip>
												)}
												<Tooltip delayDuration={0}>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															className="text-muted-foreground hover:text-foreground hover:bg-accent"
															onClick={() =>
																openAssignDialog(
																	lead
																)
															}
														>
															<Users className="w-4 h-4" />
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<p>Assign lead</p>
													</TooltipContent>
												</Tooltip>
												<Tooltip delayDuration={0}>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															className="text-muted-foreground hover:text-foreground hover:bg-accent"
															onClick={() =>
																openTagDialog(
																	lead
																)
															}
														>
															<Tag className="w-4 h-4" />
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<p>Manage tags</p>
													</TooltipContent>
												</Tooltip>
												<DropdownMenu>
													<DropdownMenuTrigger
														asChild
													>
														<Button
															variant="ghost"
															size="sm"
															className="text-muted-foreground hover:text-foreground hover:bg-accent"
														>
															<MoreHorizontal className="w-4 h-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
														className="w-48"
													>
														{lead.email && (
															<DropdownMenuItem
																onClick={() =>
																	copyToClipboard(
																		lead.email ??
																			'',
																		'Email'
																	)
																}
																className="cursor-pointer"
															>
																<Copy className="mr-2 h-4 w-4" />
																Copy Email
															</DropdownMenuItem>
														)}
														{lead.id && (
															<DropdownMenuItem
																onClick={() =>
																	copyToClipboard(
																		lead.id.toString(),
																		'ID'
																	)
																}
																className="cursor-pointer"
															>
																<Copy className="mr-2 h-4 w-4" />
																Copy ID
															</DropdownMenuItem>
														)}
														{lead.name && (
															<DropdownMenuItem
																onClick={() =>
																	copyToClipboard(
																		lead.name ??
																			'',
																		'Name'
																	)
																}
																className="cursor-pointer"
															>
																<User className="mr-2 h-4 w-4" />
																Copy Name
															</DropdownMenuItem>
														)}
														{lead.company && (
															<DropdownMenuItem
																onClick={() =>
																	copyToClipboard(
																		lead.company ??
																			'',
																		'Company'
																	)
																}
																className="cursor-pointer"
															>
																<Building className="mr-2 h-4 w-4" />
																Copy Company
															</DropdownMenuItem>
														)}
														{lead.websiteUrl && (
															<DropdownMenuItem
																onClick={() =>
																	copyToClipboard(
																		lead.websiteUrl ??
																			'',
																		'Website URL'
																	)
																}
																className="cursor-pointer"
															>
																<Globe className="mr-2 h-4 w-4" />
																Copy Website URL
															</DropdownMenuItem>
														)}
														{lead.location && (
															<DropdownMenuItem
																onClick={() =>
																	copyToClipboard(
																		lead.location ??
																			'',
																		'Location'
																	)
																}
																className="cursor-pointer"
															>
																<MapPin className="mr-2 h-4 w-4" />
																Copy Location
															</DropdownMenuItem>
														)}
														{lead.phone && (
															<DropdownMenuItem
																onClick={() =>
																	copyToClipboard(
																		lead.phone ??
																			'',
																		'Phone'
																	)
																}
																className="cursor-pointer"
															>
																<Phone className="mr-2 h-4 w-4" />
																Copy Phone
															</DropdownMenuItem>
														)}
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() =>
																copyToClipboard(
																	JSON.stringify(
																		lead,
																		null,
																		2
																	),
																	'Lead Data'
																)
															}
															className="cursor-pointer"
														>
															<Copy className="mr-2 h-4 w-4" />
															Copy All Data (JSON)
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{filteredLeads.length === 0 && (
						<div className="text-center py-8">
							<p className="text-muted-foreground">
								No leads found matching your criteria.
							</p>
						</div>
					)}

					{/* Pagination Controls */}
					{filteredLeads.length > 0 && (
						<div className="flex flex-col xl:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<span>
									Showing {startIndex + 1} to{' '}
									{Math.min(endIndex, totalItems)} of{' '}
									{totalItems} leads
								</span>
								<span className="hidden xl:inline">•</span>
								<Select
									value={itemsPerPage.toString()}
									onValueChange={(value) => {
										setItemsPerPage(Number(value));
										setCurrentPage(1);
									}}
								>
									<SelectTrigger className="w-[120px] h-8 text-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="5">
											5 per page
										</SelectItem>
										<SelectItem value="10">
											10 per page
										</SelectItem>
										<SelectItem value="20">
											20 per page
										</SelectItem>
										<SelectItem value="50">
											50 per page
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex items-center gap-1">
								<Button
									variant="outline"
									size="sm"
									onClick={goToFirstPage}
									disabled={currentPage === 1}
									className="h-8 w-8 p-0"
								>
									<ChevronsLeft className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={goToPreviousPage}
									disabled={currentPage === 1}
									className="h-8 w-8 p-0"
								>
									<ChevronLeft className="h-4 w-4" />
								</Button>

								{/* Page Numbers */}
								<div className="flex items-center gap-1">
									{Array.from(
										{ length: Math.min(5, totalPages) },
										(_, i) => {
											let pageNum: number;
											if (totalPages <= 5) {
												pageNum = i + 1;
											} else if (currentPage <= 3) {
												pageNum = i + 1;
											} else if (
												currentPage >=
												totalPages - 2
											) {
												pageNum = totalPages - 4 + i;
											} else {
												pageNum = currentPage - 2 + i;
											}

											return (
												<Button
													key={pageNum}
													variant={
														currentPage === pageNum
															? 'default'
															: 'outline'
													}
													size="sm"
													onClick={() =>
														goToPage(pageNum)
													}
													className="h-8 w-8 p-0 text-xs"
												>
													{pageNum}
												</Button>
											);
										}
									)}
								</div>

								<Button
									variant="outline"
									size="sm"
									onClick={goToNextPage}
									disabled={currentPage === totalPages}
									className="h-8 w-8 p-0"
								>
									<ChevronRight className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={goToLastPage}
									disabled={currentPage === totalPages}
									className="h-8 w-8 p-0"
								>
									<ChevronsRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					)}
				</CardContent>

				{/* Assign Lead Dialog */}
				<Dialog
					open={isAssignDialogOpen}
					onOpenChange={setIsAssignDialogOpen}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Assign Lead</DialogTitle>
							<DialogDescription>
								Assign this lead to a user or unassign it.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<div className="grid gap-2">
								<label className="text-sm font-medium">
									Current Assignment
								</label>
								<p className="text-sm text-muted-foreground">
									{selectedLead?.assignedToUser?.name ||
										'Unassigned'}
								</p>
							</div>
							<div className="grid gap-2">
								<label className="text-sm font-medium">
									Assign to
								</label>
								<Select
									onValueChange={(value) =>
										handleAssignLead(
											value === 'unassigned'
												? null
												: value
										)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a user" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="unassigned">
											Unassigned
										</SelectItem>
										{users.map((user) => (
											<SelectItem
												key={user.id}
												value={String(user.id ?? '')}
											>
												{user.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setIsAssignDialogOpen(false)}
							>
								Cancel
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Add Tag Dialog */}
				<Dialog
					open={isTagDialogOpen}
					onOpenChange={setIsTagDialogOpen}
				>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>Manage Tags</DialogTitle>
							<DialogDescription>
								Add tags to this lead, create new tags, or
								manage existing tags.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-6">
							{/* Current Tags Section */}
							<div className="grid gap-2">
								<label className="text-sm font-medium">
									Current Tags on This Lead
								</label>
								<div className="flex flex-wrap gap-1">
									{selectedLead?.tags &&
									selectedLead.tags.length > 0 ? (
										selectedLead.tags.map((tag) => (
											<Badge
												key={tag.id}
												variant="secondary"
												className="text-xs"
												style={{
													backgroundColor:
														tag.color + '20',
													color: tag.color,
													borderColor:
														tag.color + '40',
												}}
											>
												{tag.name}
											</Badge>
										))
									) : (
										<span className="text-sm text-muted-foreground">
											No tags assigned to this lead
										</span>
									)}
								</div>
							</div>

							{/* Add Tag Section */}
							<div className="grid gap-2">
								<label className="text-sm font-medium">
									Add Tag to This Lead
								</label>
								<Select
									onValueChange={(value) =>
										handleAddTag(parseInt(value))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a tag to add" />
									</SelectTrigger>
									<SelectContent>
										{tags
											.filter(
												(tag) =>
													!selectedLead?.tags?.some(
														(leadTag) =>
															leadTag.id ===
															tag.id
													)
											)
											.map((tag) => (
												<SelectItem
													key={tag.id}
													value={String(tag.id ?? '')}
												>
													{tag.name}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
							</div>

							{/* Tag Management Section */}
							<div className="grid gap-2">
								<label className="text-sm font-medium">
									Manage All Tags
								</label>
								<div className="border rounded-lg p-4 space-y-3">
									{tags.length > 0 ? (
										tags.map((tag) => (
											<div
												key={tag.id}
												className="flex items-center justify-between p-3 border rounded bg-muted/20"
											>
												<div className="flex items-center gap-3">
													<div
														className="w-4 h-4 rounded"
														style={{
															backgroundColor:
																tag.color,
														}}
													/>
													<div>
														<div className="font-medium text-sm">
															{tag.name}
														</div>
														{tag.description && (
															<div className="text-xs text-muted-foreground">
																{
																	tag.description
																}
															</div>
														)}
													</div>
												</div>
												<div className="flex items-center gap-2">
													<Button
														size="sm"
														variant="outline"
														onClick={() =>
															openEditTagDialog(
																tag
															)
														}
													>
														Edit
													</Button>
													<Button
														size="sm"
														variant="destructive"
														onClick={() =>
															handleDeleteTag(
																tag.id
															)
														}
													>
														Delete
													</Button>
												</div>
											</div>
										))
									) : (
										<div className="text-center py-4 text-muted-foreground">
											No tags available
										</div>
									)}
								</div>
							</div>

							{/* Create New Tag Section */}
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setIsCreateTagDialogOpen(true)
									}
									className="flex items-center gap-2"
								>
									<Plus className="w-4 h-4" />
									Create New Tag
								</Button>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setIsTagDialogOpen(false)}
							>
								Close
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Create Tag Dialog */}
				<Dialog
					open={isCreateTagDialogOpen}
					onOpenChange={setIsCreateTagDialogOpen}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create New Tag</DialogTitle>
							<DialogDescription>
								Create a new tag that will be available to all
								users.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<div className="grid gap-2">
								<label className="text-sm font-medium">
									Tag Name
								</label>
								<Input
									placeholder="Enter tag name"
									value={newTagName}
									onChange={(e) =>
										setNewTagName(e.target.value)
									}
								/>
							</div>
							<div className="grid gap-2">
								<label className="text-sm font-medium">
									Color
								</label>
								<Input
									type="color"
									value={newTagColor}
									onChange={(e) =>
										setNewTagColor(e.target.value)
									}
									className="w-20 h-10"
								/>
							</div>
							<div className="grid gap-2">
								<label className="text-sm font-medium">
									Description (Optional)
								</label>
								<Input
									placeholder="Enter description"
									value={newTagDescription}
									onChange={(e) =>
										setNewTagDescription(e.target.value)
									}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setIsCreateTagDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={handleCreateTag}
								disabled={!newTagName.trim()}
							>
								Create Tag
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Edit Tag Dialog */}
				<Dialog
					open={isEditTagDialogOpen}
					onOpenChange={setIsEditTagDialogOpen}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit Tag</DialogTitle>
							<DialogDescription>
								Update the tag details below.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<div className="grid gap-2">
								<label className="text-sm font-medium">
									Tag Name
								</label>
								<Input
									value={editTagName}
									onChange={(e) =>
										setEditTagName(e.target.value)
									}
								/>
							</div>
							<div className="grid gap-2">
								<label className="text-sm font-medium">
									Color
								</label>
								<Input
									type="color"
									value={editTagColor}
									onChange={(e) =>
										setEditTagColor(e.target.value)
									}
									className="w-20 h-10"
								/>
							</div>
							<div className="grid gap-2">
								<label className="text-sm font-medium">
									Description
								</label>
								<Input
									value={editTagDescription}
									onChange={(e) =>
										setEditTagDescription(e.target.value)
									}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setIsEditTagDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={handleUpdateTag}
								disabled={!editTagName.trim()}
							>
								Update Tag
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Manage Tags Dialog */}
				<Dialog
					open={isManageTagsDialogOpen}
					onOpenChange={setIsManageTagsDialogOpen}
				>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>Manage All Tags</DialogTitle>
							<DialogDescription>
								Create, edit, or delete tags. Changes will
								affect all leads using these tags.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							{/* Tag List */}
							<div className="border rounded-lg p-4 space-y-3 max-h-96 overflow-y-auto">
								{tags.length > 0 ? (
									tags.map((tag) => (
										<div
											key={tag.id}
											className="flex items-center justify-between p-3 border rounded bg-muted/20"
										>
											<div className="flex items-center gap-3">
												<div
													className="w-4 h-4 rounded"
													style={{
														backgroundColor:
															tag.color,
													}}
												/>
												<div>
													<div className="font-medium text-sm">
														{tag.name}
													</div>
													{tag.description && (
														<div className="text-xs text-muted-foreground">
															{tag.description}
														</div>
													)}
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														openEditTagDialog(tag)
													}
												>
													Edit
												</Button>
												<Button
													size="sm"
													variant="destructive"
													onClick={() =>
														handleDeleteTag(tag.id)
													}
												>
													Delete
												</Button>
											</div>
										</div>
									))
								) : (
									<div className="text-center py-8 text-muted-foreground">
										No tags available. Create your first tag
										below.
									</div>
								)}
							</div>

							{/* Create New Tag */}
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setIsCreateTagDialogOpen(true)
									}
									className="flex items-center gap-2"
								>
									<Plus className="w-4 h-4" />
									Create New Tag
								</Button>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setIsManageTagsDialogOpen(false)}
							>
								Close
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</Card>
		</TooltipProvider>
	);
}
