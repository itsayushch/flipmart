'use client';
import React, { useState, useMemo } from 'react';
import {
	Box,
	Container,
	Grid,
	Tag,
	Stack,
	Text,
	Button,
	Flex,
	Input,
	Wrap,
	WrapItem,
	IconButton,
} from '@chakra-ui/react';
import { FaSortAlphaDown, FaSortAlphaUp, FaStar } from 'react-icons/fa';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import { Tooltip } from '@/components/ui/tooltip';
import { products } from '@/utils/dummy_products';

const PRODUCTS_PER_PAGE = 12;

const companies = Array.from(new Set(products.map((p) => p.company)));
const categories = Array.from(new Set(products.map((p) => p.category)));

export default function App() {
	const [page, setPage] = useState(1);
	const [company, setCompany] = useState('');
	const [category, setCategory] = useState('');
	const [sort, setSort] = useState<'name-asc' | 'name-desc' | 'rating-desc' | 'rating-asc'>('rating-desc');
	const [search, setSearch] = useState('');

	const filtered = useMemo(() => {
		let arr = [...products];
		if (company) arr = arr.filter((p) => p.company === company);
		if (category) arr = arr.filter((p) => p.category === category);
		if (search) arr = arr.filter((p) => `${p.company} ${p.name}`.toLowerCase().includes(search.toLowerCase()));
		switch (sort) {
			case 'name-asc':
				arr.sort((a, b) => a.company.localeCompare(b.company));
				break;
			case 'name-desc':
				arr.sort((a, b) => b.company.localeCompare(a.company));
				break;
			case 'rating-desc':
				arr.sort((a, b) => b.rating - a.rating);
				break;
			case 'rating-asc':
				arr.sort((a, b) => a.rating - b.rating);
				break;
		}
		return arr;
	}, [company, category, sort, search]);

	const paginatedProducts = filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);
	const filteredTotalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));

	return (
		<>
			<Navbar />
			<Box p={8}>
				<Container maxW="container.xl">
					<Box mb={8} p={4} bg="white" rounded="lg" shadow="md">
						<Stack gap={4}>
							{/* Stylish Filter Pills */}
							<Wrap gap={2}>
								{companies.map((c) => (
									<WrapItem key={c}>
										<Button
											size="sm"
											variant={company === c ? 'solid' : 'outline'}
											colorScheme="teal"
											onClick={() => {
												setCompany(company === c ? '' : c);
												setPage(1);
											}}
											fontWeight="medium"
											rounded="full"
											boxShadow={company === c ? 'md' : undefined}
										>
											{c}
										</Button>
									</WrapItem>
								))}
							</Wrap>
							<Wrap gap={2}>
								{categories.map((cat) => (
									<WrapItem key={cat}>
										<Button
											size="sm"
											variant={category === cat ? 'solid' : 'outline'}
											colorScheme="purple"
											onClick={() => {
												setCategory(category === cat ? '' : cat);
												setPage(1);
											}}
											fontWeight="medium"
											rounded="full"
											boxShadow={category === cat ? 'md' : undefined}
										>
											{cat.charAt(0).toUpperCase() + cat.slice(1)}
										</Button>
									</WrapItem>
								))}
							</Wrap>
							{/* Search Bar */}
							<Flex gap={2} align="center" flexWrap="wrap">
								<Input
									placeholder="Search products"
									value={search}
									onChange={(e) => {
										setSearch(e.target.value);
										setPage(1);
									}}
									maxW="220px"
									bg="gray.50"
									rounded="md"
									size="md"
								/>
								{/* Sorting Buttons */}
								<Text fontWeight="medium" color="gray.600" ml={2}>
									Sort:
								</Text>
								<Tooltip content="Name A-Z" showArrow>
									<IconButton
										aria-label="Sort by name asc"
										variant={sort === 'name-asc' ? 'solid' : 'ghost'}
										onClick={() => setSort('name-asc')}
										colorScheme="teal"
										size="sm"
									>
										<FaSortAlphaDown />
									</IconButton>
								</Tooltip>
								<Tooltip content="Name Z-A" showArrow>
									<IconButton
										aria-label="Sort by name desc"
										variant={sort === 'name-desc' ? 'solid' : 'ghost'}
										onClick={() => setSort('name-desc')}
										colorScheme="teal"
										size="sm"
									>
										<FaSortAlphaUp />
									</IconButton>
								</Tooltip>
								<Tooltip content="Rating High-Low" showArrow>
									<IconButton
										aria-label="Sort by rating desc"
										variant={sort === 'rating-desc' ? 'solid' : 'ghost'}
										onClick={() => setSort('rating-desc')}
										colorScheme="yellow"
										size="sm"
									>
										<FaStar />
									</IconButton>
								</Tooltip>
								<Tooltip content="Rating Low-High" showArrow>
									<IconButton
										aria-label="Sort by rating asc"
										variant={sort === 'rating-asc' ? 'solid' : 'ghost'}
										onClick={() => setSort('rating-asc')}
										colorScheme="yellow"
										size="sm"
									>
										<FaStar style={{ transform: 'rotate(180deg)' }} />{' '}
									</IconButton>
								</Tooltip>
							</Flex>
							{/* Active Filters */}
							<Flex mt={2} gap={2} flexWrap="wrap">
								{company && (
									<Tag.Root size="lg" colorScheme="teal" borderRadius="full">
										<Tag.Label>{company}</Tag.Label>
										<Tag.EndElement>
											<Tag.CloseTrigger onClick={() => setCompany('')} />
										</Tag.EndElement>
									</Tag.Root>
								)}
								{category && (
									<Tag.Root size="lg" colorScheme="purple" borderRadius="full">
										<Tag.Label>{category.charAt(0).toUpperCase() + category.slice(1)}</Tag.Label>
										<Tag.EndElement>
											<Tag.CloseTrigger onClick={() => setCategory('')} />
										</Tag.EndElement>
									</Tag.Root>
								)}
								{search && (
									<Tag.Root size="lg" colorScheme="gray" borderRadius="full">
										<Tag.Label>{search}</Tag.Label>
										<Tag.EndElement>
											<Tag.CloseTrigger onClick={() => setSearch('')} />
										</Tag.EndElement>
									</Tag.Root>
								)}
							</Flex>
						</Stack>
					</Box>
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
						{paginatedProducts.map((product) => (
							<ProductCard key={product.id} {...product} />
						))}
					</Grid>
					{filtered.length > PRODUCTS_PER_PAGE && (
						<Box mt={8} display="flex" justifyContent="center">
							<Stack direction="row" gap={2}>
								<Button
									onClick={() => setPage((p) => Math.max(1, p - 1))}
									disabled={page === 1}
									colorScheme="teal"
									variant="outline"
								>
									Previous
								</Button>
								{Array.from({ length: filteredTotalPages }, (_, i) => (
									<Button
										key={i + 1}
										onClick={() => setPage(i + 1)}
										colorScheme={page === i + 1 ? 'teal' : 'gray'}
										variant={page === i + 1 ? 'solid' : 'ghost'}
									>
										{i + 1}
									</Button>
								))}
								<Button
									onClick={() => setPage((p) => Math.min(filteredTotalPages, p + 1))}
									disabled={page === filteredTotalPages}
									colorScheme="teal"
									variant="outline"
								>
									Next
								</Button>
							</Stack>
						</Box>
					)}
				</Container>
			</Box>
		</>
	);
}
