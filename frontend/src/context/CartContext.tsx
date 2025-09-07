'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import type { Product } from '@/types';

interface CartItem extends Product {
	quantity: number;
}

interface CartContextType {
	cart: CartItem[];
	addToCart: (product: Product) => void;
	removeFromCart: (id: string) => void;
	increaseQty: (id: string) => void;
	decreaseQty: (id: string) => void;
	clearCart: () => void;
	isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [cart, setCart] = useState<CartItem[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	// Load from localStorage once
	useEffect(() => {
		const saved = localStorage.getItem('cart');
		if (saved) {
			setCart(JSON.parse(saved));
		}
		setIsLoaded(true);
	}, []);

	// Save whenever cart changes
	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem('cart', JSON.stringify(cart));
		}
	}, [cart, isLoaded]);

	const addToCart = (product: Product) => {
		setCart((prev) => {
			const existing = prev.find((item) => item.id === product.id);
			if (existing) {
				return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
			}
			return [...prev, { ...product, quantity: 1 }];
		});
	};

	const increaseQty = (id: string) => {
		setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
	};

	const decreaseQty = (id: string) => {
		setCart((prev) =>
			prev
				.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
				.filter((item) => item.quantity > 0)
		);
	};

	const removeFromCart = (id: string) => {
		setCart((prev) => prev.filter((item) => item.id !== id));
	};

	const clearCart = () => setCart([]);

	return (
		<CartContext.Provider
			value={{ cart, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart, isLoaded }}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) throw new Error('useCart must be used inside CartProvider');
	return context;
};
