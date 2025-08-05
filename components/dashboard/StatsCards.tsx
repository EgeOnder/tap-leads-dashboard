import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Globe, Building } from 'lucide-react';

interface StatsCardsProps {
	leads: any[];
}

export function StatsCards({ leads }: StatsCardsProps) {
	// Ensure leads is an array and handle potential errors
	const leadsArray = Array.isArray(leads) ? leads : [];

	const totalLeads = leadsArray.length;
	const companiesCount = new Set(
		leadsArray.map((lead) => lead.company).filter(Boolean)
	).size;
	const websitesCount = new Set(
		leadsArray.map((lead) => lead.websiteUrl).filter(Boolean)
	).size;
	const leadsWithContact = leadsArray.filter(
		(lead) => lead.contactLink
	).length;

	const stats = [
		{
			title: 'Total Leads',
			value: totalLeads,
			icon: Users,
		},
		{
			title: 'Companies',
			value: companiesCount,
			icon: Building,
		},
		{
			title: 'Websites Scraped',
			value: websitesCount,
			icon: Globe,
		},
		{
			title: 'With Contact Info',
			value: leadsWithContact,
			icon: TrendingUp,
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			{stats.map((stat) => (
				<Card
					key={stat.title}
					className="bg-card border-border shadow-sm"
				>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							{stat.title}
						</CardTitle>
						<stat.icon className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-card-foreground">
							{stat.value}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
