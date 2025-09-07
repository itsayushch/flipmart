export interface Product {
	id: string;
	category: string;
	isNew: boolean;
	imageURL: string;
	company: string;
	name: string;
	price: number;
	originalPrice: number;
	discountPercent: number;
	rating: number;
	numReviews: number;
}

export interface CartItem {
	productId: string;
	qty: number;
}

export interface CartResponse {
	items: CartItem[];
}

export interface CartProduct extends Product {
	qty: number;
}

export interface User {
	_id: string;
	name: string;
	email: string;
}

export interface AuthResponse {
	token: string;
	user: User;
}
