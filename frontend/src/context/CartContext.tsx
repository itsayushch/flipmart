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
	syncCartFromBackend: (token: string) => Promise<void>;
	isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [cart, setCart] = useState<CartItem[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	const API_URL = process.env.NEXT_PUBLIC_API_URL;

	// ✅ Load from localStorage once
	useEffect(() => {
		const saved = localStorage.getItem('cart');
		if (saved) {
			setCart(JSON.parse(saved));
		}
		setIsLoaded(true);
	}, []);

	// ✅ Always save to localStorage
	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem('cart', JSON.stringify(cart));
		}
	}, [cart, isLoaded]);

	// -------------------
	// Helper: Call backend if logged in
	// -------------------
	const syncWithBackend = async (endpoint: string, method: string, body?: object) => {
		const token = localStorage.getItem('token');
		if (!token) return;

		try {
			await fetch(`${API_URL}/api/cart${endpoint}`, {
				method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: body ? JSON.stringify(body) : undefined,
			});
		} catch (err) {
			console.error('Cart backend sync failed:', err);
		}
	};

	// -------------------
	// Cart Actions
	// -------------------
	const addToCart = (product: Product) => {
		setCart((prev) => {
			const existing = prev.find((item) => item.id === product.id);
			if (existing) {
				syncWithBackend(`/${product.id}`, 'PUT', { quantity: existing.quantity + 1 });
				return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
			}
			syncWithBackend('', 'POST', { productId: product.id, quantity: 1 });
			return [...prev, { ...product, quantity: 1 }];
		});
	};

	const increaseQty = (id: string) => {
		setCart((prev) =>
			prev.map((item) => {
				if (item.id === id) {
					syncWithBackend(`/${id}`, 'PUT', { quantity: item.quantity + 1 });
					return { ...item, quantity: item.quantity + 1 };
				}
				return item;
			})
		);
	};

	const decreaseQty = (id: string) => {
		setCart(
			(prev) =>
				prev
					.map((item) => {
						if (item.id === id) {
							const newQty = item.quantity - 1;
							if (newQty > 0) {
								syncWithBackend(`/${id}`, 'PUT', { quantity: newQty });
								return { ...item, quantity: newQty };
							} else {
								syncWithBackend(`/${id}`, 'DELETE');
								return null;
							}
						}
						return item;
					})
					.filter(Boolean) as CartItem[]
		);
	};

	const removeFromCart = (id: string) => {
		setCart((prev) => prev.filter((item) => item.id !== id));
		syncWithBackend(`/${id}`, 'DELETE');
	};

	const clearCart = () => {
		setCart([]);
		syncWithBackend('/clear', 'DELETE');
	};

	// -------------------
	// Sync cart from backend (on login)
	// -------------------
	const syncCartFromBackend = async (token: string) => {
		try {
			const res = await fetch(`${API_URL}/api/cart`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) throw new Error('Failed to fetch cart');
			const backendCart = await res.json();

			// Merge backend + local
			setCart((prev) => {
				const merged = [...backendCart.items];
				prev.forEach((localItem) => {
					const exists = merged.find((i) => i.id === localItem.id);
					if (exists) {
						exists.quantity += localItem.quantity;
					} else {
						merged.push(localItem);
					}
				});
				return merged;
			});
		} catch (err) {
			console.error('Cart sync failed:', err);
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
				syncCartFromBackend,
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
