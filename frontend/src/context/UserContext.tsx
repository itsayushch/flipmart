'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '@/types';

interface DecodedToken {
	id: string;
	name?: string;
	email?: string;
	exp: number;
}

interface UserContextType {
	user: User | null;
	token: string | null;
	isLoaded: boolean;
	login: (token: string) => void;
	logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	const decodeAndSetUser = (jwt: string) => {
		try {
			const decoded: DecodedToken = jwtDecode(jwt);

			// check expiry
			if (decoded.exp * 1000 < Date.now()) {
				logout();
				return;
			}
			// @ts-expect-error
			const userObj: User = { id: decoded.id, name: decoded?.name, email: decoded?.email };
			setUser(userObj);
			setToken(jwt);
			localStorage.setItem('token', jwt);
		} catch (err) {
			console.error('Invalid token:', err);
			logout();
		}
	};

	useEffect(() => {
		const savedToken = localStorage.getItem('token');
		if (savedToken) {
			decodeAndSetUser(savedToken);
		}
		setIsLoaded(true);
	}, []);

	// ✅ decode immediately on login
	const login = (jwt: string) => {
		decodeAndSetUser(jwt);
	};

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);
		setToken(null);
		window.location.href = '/'; // full reload to reset state
	};

	return <UserContext.Provider value={{ user, token, isLoaded, login, logout }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) throw new Error('useUser must be used within UserProvider');
	return context;
};
