import { CartResponse, CartProduct } from '@/types';
import { products } from '@/utils/dummy_products';

export function mergeCartWithProducts(cart: CartResponse): CartProduct[] {
	return cart.items.map((item) => {
		const product = products.find((p) => p.id === item.productId);
		return product
			? { ...product, qty: item.qty }
			: {
					id: item.productId,
					category: 'unknown',
					isNew: false,
					imageURL: '',
					company: '',
					name: 'Unknown Product',
					price: 0,
					originalPrice: 0,
					discountPercent: 0,
					rating: 0,
					numReviews: 0,
					qty: item.qty,
				};
	});
}
