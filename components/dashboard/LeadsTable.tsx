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
import { useToast } from '@/hooks/use-toast';
import React from 'react';
import Link from 'next/link';

interface LeadsTableProps {
	leads: any[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [companyFilter, setCompanyFilter] = useState<string>('all');
	const [websiteFilter, setWebsiteFilter] = useState<string>('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
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
			companyFilter === 'all' || lead.company === companyFilter;
		const matchesWebsite =
			websiteFilter === 'all' ||
			(lead.websiteUrl &&
				new URL(lead.websiteUrl).hostname === websiteFilter);
		return matchesSearch && matchesCompany && matchesWebsite;
	});

	// Reset to first page when filters change
	React.useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, companyFilter, websiteFilter]);

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
				.map((url) => new URL(url).hostname)
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

	return (
		<TooltipProvider>
			<Card className="bg-card border-border shadow-sm">
				<CardHeader>
					<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
						<h1 className="text-2xl font-bold text-foreground">
							Leads available for{' '}
							{companyFilter === 'all'
								? 'all companies'
								: companyFilter}
						</h1>
						<div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									placeholder="Search leads..."
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
									className="pl-10 bg-background border-input text-foreground focus:border-ring focus:ring-ring w-full sm:w-64"
								/>
							</div>
							<Select
								onValueChange={setCompanyFilter}
								value={companyFilter}
							>
								<SelectTrigger className="w-full sm:w-[180px]">
									<SelectValue placeholder="Select Company" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										All Companies
									</SelectItem>
									{uniqueCompanies.map((company) => (
										<SelectItem
											key={company}
											value={company}
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
								<SelectTrigger className="w-full sm:w-[180px]">
									<SelectValue placeholder="Select Website" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										All Websites
									</SelectItem>
									{uniqueWebsites.map((website) => (
										<SelectItem
											key={website}
											value={website}
										>
											{website}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
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
										Location
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
																lead.websiteUrl
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
										<TableCell className="text-foreground">
											{lead.location || 'Not specified'}
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
																		lead.email,
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
																		lead.name,
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
																		lead.company,
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
																		lead.websiteUrl,
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
																		lead.location,
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
																		lead.phone,
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
						<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<span>
									Showing {startIndex + 1} to{' '}
									{Math.min(endIndex, totalItems)} of{' '}
									{totalItems} leads
								</span>
								<span className="hidden sm:inline">•</span>
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
			</Card>
		</TooltipProvider>
	);
}
