// app/cart/page.tsx
'use client';

import React, { useState } from 'react';
import {
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Image,
	Stack,
	Text,
	VStack,
	Separator,
	Dialog,
	Portal,
	CloseButton,
} from '@chakra-ui/react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { products } from '@/utils/dummy_products';
import type { CartItem } from '@/context/CartContext';
import type { Product } from '@/types';
import Footer from '@/components/Footer';

function getDetailedCart(cart: CartItem[]): (Product & { quantity: number })[] {
	return cart
		.map((item) => {
			const product = products.find((p) => p.id === item.id);
			if (!product) return null;
			return { ...product, quantity: item.quantity };
		})
		.filter(Boolean) as (Product & { quantity: number })[];
}

export default function CartPage() {
	const { cart: raw_cart, increaseQty, decreaseQty, removeFromCart, clearCart, isLoaded } = useCart();
	const router = useRouter();
	const cart = getDetailedCart(raw_cart);
	// Controlled dialog state: null = closed, "remove" | "clear" = open
	const [dialogAction, setDialogAction] = useState<null | { type: 'remove' | 'clear'; id?: string }>(null);

	const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

	if (!isLoaded) {
		return (
			<Flex align="center" justify="center" h="80vh">
				<Text fontSize="lg" color="gray.500">
					Loading your cart...
				</Text>
			</Flex>
		);
	}

	const openRemoveDialog = (id: string) => setDialogAction({ type: 'remove', id });
	const openClearDialog = () => setDialogAction({ type: 'clear' });
	const closeDialog = () => setDialogAction(null);

	const handleConfirm = () => {
		if (!dialogAction) return;
		if (dialogAction.type === 'clear') {
			clearCart();
		} else if (dialogAction.type === 'remove' && dialogAction.id) {
			removeFromCart(dialogAction.id);
		}
		closeDialog();
	};

	return (
		<>
			<Navbar />
			<Box bg="gray.50" minH="100vh" p={{ base: 4, md: 10 }}>
				<Heading mb={6}>Shopping Bag</Heading>

				{cart.length === 0 ? (
					<Flex
						direction="column"
						align="center"
						justify="center"
						h="60vh"
						bg="white"
						rounded="lg"
						shadow="md"
						p={10}
					>
						<Image
							src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
							alt="Empty cart"
							boxSize="120px"
							mb={6}
						/>
						<Text fontSize="xl" fontWeight="semibold" mb={4}>
							Your cart is empty
						</Text>
						<Button colorPalette="pink" onClick={() => router.push('/')}>
							Continue Shopping
						</Button>
					</Flex>
				) : (
					<Flex gap={8} direction={{ base: 'column', lg: 'row' }}>
						{/* Left side: Cart Items */}
						<VStack flex="2" gap={4} align="stretch">
							{cart.map((item) => (
								<Flex
									key={item.id}
									bg="white"
									shadow="sm"
									rounded="xs"
									p={4}
									align="center"
									justify="space-between"
									direction={{ base: 'column', sm: 'row' }} // Stack vertically on mobile
									gap={{ base: 3, sm: 0 }}
								>
									<HStack
										gap={4}
										align={{ base: 'start', sm: 'center' }}
										w={{ base: '100%', sm: 'auto' }}
									>
										<Image
											src={item.imageURL}
											alt={item.name}
											boxSize={{ base: '60px', sm: '80px' }} // smaller on mobile
											objectFit="cover"
											rounded="md"
											onError={(e) => {
												e.currentTarget.src =
													'https://plus.unsplash.com/premium_photo-1683141052679-942eb9e77760?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
											}}
										/>
										<VStack align="start" gap={1}>
											<Text fontWeight="bold" fontSize={{ base: 'md', sm: 'lg' }}>
												{item.company.toUpperCase()}
											</Text>

											<Text fontSize={{ base: 'md', sm: 'lg' }}>{item.name}</Text>
											<Flex align="center" mt={2} mb={2} gap={2}>
												<Text fontWeight="bold" fontSize="sm" color="gray.800">
													Rs. {item.price}
												</Text>
												<Text
													fontSize="sm"
													color="gray.500"
													as="span"
													textDecoration="line-through"
												>
													Rs. {item.originalPrice}
												</Text>
												<Text fontSize="xs" color="red.400" fontWeight="semibold">
													({item.discountPercent}% OFF)
												</Text>
											</Flex>
										</VStack>
									</HStack>

									{/* Quantity + Remove */}
									<HStack
										gap={3}
										mt={{ base: 2, sm: 0 }}
										w={{ base: '100%', sm: 'auto' }}
										justify={{ base: 'space-between', sm: 'flex-end' }}
									>
										<Button
											size="sm"
											variant="outline"
											onClick={() =>
												item.quantity === 1 ? openRemoveDialog(item.id) : decreaseQty(item.id)
											}
										>
											-
										</Button>
										<Text>{item.quantity}</Text>
										<Button size="sm" variant="outline" onClick={() => increaseQty(item.id)}>
											+
										</Button>
										<Button size="sm" colorPalette="red" onClick={() => openRemoveDialog(item.id)}>
											Remove
										</Button>
									</HStack>
								</Flex>
							))}
						</VStack>

						{/* Right side: Price Summary */}
						<Box flex="1" bg="white" p={6} rounded="xs" shadow="md" h="fit-content">
							<Heading size="md" mb={4}>
								Price Details
							</Heading>
							<Separator mb={4} />
							<Stack gap={3}>
								{cart.map((item) => (
									<Flex
										key={item.id}
										justify="space-between"
										align="center"
										py={2}
										px={2}
										bg="gray.50"
										rounded="md"
										_hover={{ bg: 'teal.50' }}
										transition="background 0.2s"
									>
										<Box>
											<Text fontWeight="semibold" fontSize="md" color="gray.800" lineClamp={1}>
												{item.name}
											</Text>
											<Text fontSize="sm" color="gray.500">
												x {item.quantity}
											</Text>
										</Box>
										<Flex align="center" mt={2} mb={2} gap={2}>
											<Text
												fontSize="sm"
												color="gray.500"
												as="span"
												textDecoration="line-through"
											>
												Rs. {item.originalPrice * item.quantity}
											</Text>
											<Text fontWeight="bold" fontSize="md" color="teal.600">
												₹{item.price * item.quantity}
											</Text>
										</Flex>
									</Flex>
								))}
								<Separator />
								<Flex justify="space-between" align="center" mt={2} py={2}>
									<Text fontWeight="bold" fontSize="lg" color="gray.700">
										Total
									</Text>
									<Text
										fontWeight="extrabold"
										fontSize="lg"
										color="teal.700"
										bg="teal.50"
										px={4}
										py={2}
										rounded="lg"
										boxShadow="sm"
									>
										₹{total}
									</Text>
								</Flex>
							</Stack>

							<Button mt={6} w="full" colorPalette="teal" rounded="md">
								Place Order
							</Button>
							<Button mt={3} w="full" variant="subtle" colorPalette="red" onClick={openClearDialog}>
								Clear Cart
							</Button>
						</Box>
					</Flex>
				)}

				{/* Controlled Dialog (confirmation for remove / clear) */}
				<Dialog.Root
					size="sm"
					placement="center"
					open={Boolean(dialogAction)}
					onOpenChange={(details) => {
						if (!details.open) closeDialog();
					}}
				>
					<Portal>
						<Dialog.Backdrop />
						<Dialog.Positioner>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title>
										{dialogAction?.type === 'clear' ? 'Clear Cart' : 'Remove Item'}
									</Dialog.Title>
									{/* CloseTrigger will close the dialog */}
									<Dialog.CloseTrigger asChild>
										<CloseButton />
									</Dialog.CloseTrigger>
								</Dialog.Header>

								<Dialog.Body>
									<Text>
										{dialogAction?.type === 'clear'
											? 'This will remove all items from your cart. Are you sure?'
											: 'Are you sure you want to remove this item from your cart?'}
									</Text>
								</Dialog.Body>

								<Dialog.Footer>
									{/* ActionTrigger wraps the Cancel button so it dismisses the dialog automatically */}
									<Dialog.ActionTrigger asChild>
										<Button variant="outline">Cancel</Button>
									</Dialog.ActionTrigger>

									<Button colorPalette="red" onClick={handleConfirm}>
										{dialogAction?.type === 'clear' ? 'Clear Cart' : 'Remove'}
									</Button>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog.Positioner>
					</Portal>
				</Dialog.Root>
			</Box>
			<Footer />
		</>
	);
}
