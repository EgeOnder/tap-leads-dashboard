import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateSessionToken } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
	try {
		const { password } = await request.json();

		if (!password) {
			return NextResponse.json(
				{ error: 'Password is required' },
				{ status: 400 }
			);
		}

		if (verifyPassword(password)) {
			const sessionToken = generateSessionToken();
			const response = NextResponse.json(
				{ success: true, message: 'Authentication successful' },
				{ status: 200 }
			);

			// Set HTTP-only cookie for session
			response.cookies.set('session_token', sessionToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7, // 7 days
			});

			return response;
		} else {
			return NextResponse.json(
				{ error: 'Invalid password' },
				{ status: 401 }
			);
		}
	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
