'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import { CartProvider } from '@/context/CartContext';

export default function RootLayout(props: { children: React.ReactNode }) {
	return (
		<ChakraProvider value={defaultSystem}>
			<CartProvider>
				<ThemeProvider attribute="class" disableTransitionOnChange>
					{props.children}
				</ThemeProvider>
			</CartProvider>
		</ChakraProvider>
	);
}
