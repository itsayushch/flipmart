'use client';
import React from 'react';
import {
	Box,
	Flex,
	Heading,
	Text,
	Image,
	SimpleGrid,
	VStack,
	Button,
	HStack,
	Input,
	Link,
	Container,
	Grid,
} from '@chakra-ui/react';
import Navbar from '@/components/Navbar'; // assuming navbar exists
import { products } from '@/utils/dummy_products';
import ProductCard from '@/components/ProductCard';
import { FaArrowRightLong } from 'react-icons/fa6';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

const categories = [
	{
		name: 'Men',
		img: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	},
	{
		name: 'Women',
		img: 'https://images.unsplash.com/photo-1481214110143-ed630356e1bb?auto=format&fit=crop&w=400&q=80',
	},
	{
		name: 'Electronics',
		img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
	},
	{
		name: 'Beauty',
		img: 'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?auto=format&fit=crop&w=400&q=80',
	},
	{
		name: 'Home',
		img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80',
	},
	{
		name: 'Sports',
		img: 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=400&q=80',
	},
];

// Main Landing Page
export default function LandingPage() {
	const Router = useRouter();
	return (
		<Box bg="gray.50" fontFamily="Inter, sans-serif">
			<Navbar />

			{/* Hero Banner */}
			<Flex
				bgGradient="linear(to-r, pink.500, purple.600)"
				color="white"
				direction={{ base: 'column', md: 'row' }}
				align="center"
				justify="space-between"
				px={{ base: 6, md: 16 }}
				py={20}
				rounded="none"
			>
				<Flex
					bgGradient="linear(to-r, pink.500, purple.600)"
					color="white"
					direction={{ base: 'column-reverse', md: 'row' }} // <-- change here
					align="center"
					justify="space-between"
					px={{ md: 5 }}
					rounded="none"
				>
					<VStack align="flex-start" gap={6} flex={1} py={{ base: 10, md: 20 }}>
						<Heading fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold" color={'black'}>
							Refresh Your Wardrobe
						</Heading>
						<Text fontSize={{ base: 'md', md: 'xl' }} maxW={{ base: '100vw', md: '60vw' }} color={'black'}>
							Discover the latest trends in fashion, electronics, beauty, and more. Unbeatable prices,
							fast delivery.
						</Text>

						<Button
							size="xl"
							colorPalette="teal"
							rounded="md"
							as={Link}
							// @ts-expect-error
							href="#categories"
							_hover={{ textDecoration: 'none' }}
						>
							Shop Now <FaArrowRightLong />
						</Button>
					</VStack>
					<Box flex={1} display={{ base: 'block', md: 'block' }}>
						<Image
							src="https://plus.unsplash.com/premium_photo-1681488262364-8aeb1b6aac56?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							alt="Hero Banner"
							rounded="lg"
							objectFit="cover"
							shadow="lg"
						/>
					</Box>
				</Flex>
				<Box flex={1} display={{ base: 'none', md: 'block' }}>
					<Image
						src="https://plus.unsplash.com/premium_photo-1681488262364-8aeb1b6aac56?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt="Hero Banner"
						rounded="lg"
						objectFit="cover"
						shadow="lg"
					/>
				</Box>
			</Flex>

			{/* Categories */}
			<Box maxW="1200px" mx="auto" py={16} px={6}>
				<Heading
					id="categories"
					textTransform={'uppercase'}
					fontWeight={'bolder'}
					color={'pink.500'}
					size="3xl"
					mb={8}
					textAlign="center"
				>
					Shop by Category
				</Heading>
				<SimpleGrid columns={{ base: 2, sm: 3, md: 6 }} gap={8}>
					{categories.map((c) => (
						<VStack
							key={c.name}
							bg="white"
							rounded="xl"
							shadow="md"
							p={4}
							gap={3}
							_hover={{ shadow: 'xl', transform: 'translateY(-6px)', bg: 'gray.50', cursor: 'pointer' }}
							transition="0.2s"
							onClick={() => Router.push(`/products?category=${c.name.toLowerCase()}`)}
						>
							<Image
								src={c.img}
								alt={c.name}
								boxSize="100px"
								rounded="full"
								objectFit="cover"
								border="3px solid"
								borderColor="pink.400"
								shadow="md"
							/>
							<Text fontWeight="bold" fontSize="md" color="gray.700">
								{c.name}
							</Text>
						</VStack>
					))}
				</SimpleGrid>
			</Box>

			{/* Featured Products */}
			<Box p={8}>
				<Heading
					textTransform={'uppercase'}
					fontWeight={'bolder'}
					color={'pink.500'}
					size="3xl"
					mb={8}
					textAlign="center"
				>
					Trending Items
				</Heading>
				<Container maxW="container.md">
					<Grid
						templateColumns={{
							base: 'repeat(1, 1fr)',
							sm: 'repeat(2, 1fr)',
							md: 'repeat(3, 1fr)',
							lg: 'repeat(4, 1fr)',
							xl: 'repeat(5, 1fr)',
						}}
						gap={6}
						justifyItems="center"
					>
						{products.splice(0, 5).map((product) => (
							<ProductCard key={product.id} {...product} />
						))}
					</Grid>
				</Container>
			</Box>

			{/* Newsletter Signup */}
			<Box bg="gray.900" color="white" mt={20} py={12} px={6}>
				<VStack maxW="800px" mx="auto" gap={4} textAlign="center">
					<Heading size="md">Stay Updated</Heading>
					<Text fontSize="sm" color="gray.300">
						Subscribe to our newsletter for latest offers and trends.
					</Text>
					<HStack w="full" maxW="400px">
						<Input placeholder="Enter your email" bg="white" color="black" rounded="md" />
						<Button colorPalette="pink" rounded="md">
							Subscribe
						</Button>
					</HStack>
				</VStack>
			</Box>

			{/* Footer */}
			<Footer />
		</Box>
	);
}
