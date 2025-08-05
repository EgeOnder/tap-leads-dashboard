'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface LogoProps {
	width?: number;
	height?: number;
	className?: string;
	alt?: string;
}

export function Logo({
	width = 150,
	height = 50,
	className = '',
	alt = 'Logo',
}: LogoProps) {
	const { theme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch by only rendering after mount
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		// Return a placeholder with the same dimensions to prevent layout shift
		return (
			<div
				className={`bg-muted animate-pulse ${className}`}
				style={{ width, height }}
			/>
		);
	}

	// Use resolvedTheme to handle system theme preference
	const isDark = resolvedTheme === 'dark';
	const logoSrc = isDark ? '/logo/logo-white.svg' : '/logo/logo.svg';

	return (
		<Image
			src={logoSrc}
			alt={alt}
			width={width}
			height={height}
			className={className}
			priority
		/>
	);
}
