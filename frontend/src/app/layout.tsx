'use client';
import { Inter } from 'next/font/google';
import Provider from '../components/ui/provider';

const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
});
import { LightMode } from "@/components/ui/color-mode"
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html className={inter.className} suppressHydrationWarning>
			<head />
			<body>
				<Provider><LightMode>{children}</LightMode></Provider>
			</body>
		</html>
	);
}
