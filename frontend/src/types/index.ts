export interface Product {
	id: string;
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
