import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
	try {
		const sessionToken = request.cookies.get('session_token');

		if (sessionToken && sessionToken.value) {
			return NextResponse.json({ authenticated: true }, { status: 200 });
		} else {
			return NextResponse.json({ authenticated: false }, { status: 401 });
		}
	} catch (error) {
		console.error('Session verification error:', error);
		return NextResponse.json({ authenticated: false }, { status: 401 });
	}
}
