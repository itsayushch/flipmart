'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import { CartProvider } from '@/context/CartContext';
import { UserProvider } from '@/context/UserContext';
import { ColorModeProvider } from "@/components/ui/color-mode"
export default function RootLayout(props: { children: React.ReactNode }) {
	return (
		<ChakraProvider value={defaultSystem}>
			<ColorModeProvider forcedTheme='light'>
			<UserProvider>
				<CartProvider>
					<ThemeProvider attribute="class" disableTransitionOnChange>
						{props.children}
					</ThemeProvider>
				</CartProvider>
			</UserProvider>
			</ColorModeProvider>
		</ChakraProvider>
	);
}
