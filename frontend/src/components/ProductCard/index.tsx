'use client';

import { Flex, Box, Image, Badge, Text, Button } from '@chakra-ui/react';
import { BsStarFill, BsCheckCircle } from 'react-icons/bs';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

export default function ProductCard(data: Product) {
	const { addToCart, cart } = useCart();

	const isInCart = cart.some((item: Product) => item.id === data.id);

	const handleAddToCart = () => {
		if (!isInCart) {
			addToCart(data);
		}
	};

	return (
		<Box
			bg={'white'}
			maxW="260px"
			w="260px"
			h="410px"
			borderWidth="1px"
			position="relative"
			display="flex"
			flexDirection="column"
			_hover={{ shadow: 'xl', transform: 'translateY(-6px)', bg: 'gray.50' }}
			transition="0.2s"
		>
			<Box position="relative">
				<Image
					src={data.imageURL}
					alt={`Picture of ${data.name}`}
					boxSize="250px"
					objectFit="cover"
					width="100%"
					height="250px"
					onError={(e) => {
						e.currentTarget.src =
							'https://plus.unsplash.com/premium_photo-1683141052679-942eb9e77760?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
					}}
				/>
				{data.isNew && (
					<Badge
						position={'absolute'}
						top={2}
						right={2}
						rounded="full"
						px="2"
						fontSize="0.8em"
						variant={'subtle'}
						colorPalette="green"
					>
						New
					</Badge>
				)}
				<Box
					position="absolute"
					bottom={2}
					left={2}
					bg="white"
					px={2}
					py={0.5}
					rounded="md"
					boxShadow="md"
					display="flex"
					alignItems="center"
					gap={1}
					fontSize="xs"
					background={'rgba(255, 255, 255, 0.7)'}
				>
					<Text fontWeight="bold" fontSize="xs" color="gray.800">
						{data.rating}
					</Text>
					<Box color="teal.500" fontSize="sm">
						<BsStarFill />
					</Box>
					<Text fontSize="xs" color="gray.700" fontWeight="semibold">
						| {data.numReviews}
					</Text>
				</Box>
			</Box>
			<Box p="2" flex="1" display="flex" flexDirection="column" justifyContent="space-between">
				<Flex justifyContent="space-between" alignContent="center" direction="column">
					<Box fontSize="md" fontWeight="bold" as="p" lineHeight="tight" truncate>
						{data.company.toUpperCase()}
					</Box>
					<Text fontSize="sm" color="gray.600" mt={1} lineClamp={1}>
						{data.name}
					</Text>
				</Flex>
				{/* Price section */}
				<Flex align="center" mt={2} mb={2} gap={2}>
					<Text fontWeight="bold" fontSize="sm" color="gray.800">
						Rs. {data.price}
					</Text>
					<Text fontSize="sm" color="gray.500" as="span" textDecoration="line-through">
						Rs. {data.originalPrice}
					</Text>
					<Text fontSize="xs" color="red.400" fontWeight="semibold">
						({data.discountPercent}% OFF)
					</Text>
				</Flex>
				<Button
					colorPalette={isInCart ? 'green' : 'pink'}
					size="sm"
					width="full"
					mt={2}
					onClick={handleAddToCart}
					disabled={isInCart}
				>
					{isInCart ? <BsCheckCircle /> : <FiShoppingCart />} {isInCart ? 'Added to Cart' : 'Add to Cart'}
				</Button>
			</Box>
		</Box>
	);
}
