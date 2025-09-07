'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Product } from '@/types';
import { useUser } from '@/context/UserContext';

export interface CartItem {
	id: string;
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
	const { user, token } = useUser();

	// ✅ Load from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem('cart');
		if (saved) {
			try {
				setCart(JSON.parse(saved));
			} catch {
				setCart([]);
			}
		}
		setIsLoaded(true);
	}, []);

	// 🔑 Sync cart whenever localStorage changes (e.g., after login)
	useEffect(() => {
		const handleStorageChange = () => {
			const saved = localStorage.getItem('cart');
			if (saved) {
				setCart(JSON.parse(saved));
			}
		};
		window.addEventListener('storage', handleStorageChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, []);

	// ✅ Always save to localStorage when cart changes
	useEffect(() => {
		if (isLoaded) {
			try {
				localStorage.setItem('cart', JSON.stringify(cart));
			} catch (err) {
				console.error('Error saving cart to localStorage:', err);
			}
		}
	}, [cart, isLoaded]);

	// ✅ Cart actions
	const addToCart = (product: Product) => {
		setCart((prev) => {
			const existing = prev.find((i) => i.id === product.id);
			if (existing) {
				return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
			}
			return [...prev, { id: product.id, quantity: 1 }];
		});

		if (user && token) {
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ productId: product.id, quantity: 1, user }),
			}).catch((err) => console.error('Error syncing addToCart:', err));
		}
	};

	const increaseQty = (id: string) => {
		setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)));

		if (user && token) {
			const item = cart.find((i) => i.id === id);
			if (item) {
				fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ user, quantity: item.quantity + 1 }),
				}).catch((err) => console.error('Error syncing increaseQty:', err));
			}
		}
	};

	const decreaseQty = (id: string) => {
		setCart((prev) =>
			prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i)).filter((i) => i.quantity > 0)
		);

		if (user && token) {
			const item = cart.find((i) => i.id === id);
			if (item) {
				if (item.quantity - 1 > 0) {
					fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${id}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ user, quantity: item.quantity - 1 }),
					}).catch((err) => console.error('Error syncing decreaseQty:', err));
				} else {
					fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/remove/${id}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ user }),
					}).catch((err) => console.error('Error syncing remove on decrease:', err));
				}
			}
		}
	};

	const removeFromCart = (id: string) => {
		setCart((prev) => prev.filter((i) => i.id !== id));

		if (user && token) {
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/remove/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ user }),
			}).catch((err) => console.error('Error syncing removeFromCart:', err));
		}
	};

	const clearCart = () => {
		setCart([]);

		if (user && token) {
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/clear/${user._id}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${token}` },
				body: JSON.stringify({ user }),
			}).catch((err) => console.error('Error syncing clearCart:', err));
		}
	};

	return (
		<CartContext.Provider
			value={{
				cart,
				addToCart,
				removeFromCart,
				increaseQty,
				decreaseQty,
				clearCart,
				isLoaded,
			}}
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
