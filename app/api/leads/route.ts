import { NextResponse } from 'next/server';
import { getLeads } from '@/lib/db';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		const leads = await getLeads();
		return NextResponse.json(leads);
	} catch (error) {
		console.error('Error fetching leads:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch leads' },
			{ status: 500 }
		);
	}
}
